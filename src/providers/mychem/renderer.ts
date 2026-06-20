import {
  defaultMyChemConfig,
  type MyChemTooltipConfig,
  type MyChemDisplayConfig,
  type MyChemStructureRenderer,
  type MyChemSectionVisibility,
} from './config.js';
import type { MyChemInfoResult, ResolvedField, SourceValue } from './types.js';
import type { NestedTooltipDefinition } from '../../core/types.js';
import type { SectionVariant } from '../../core/config.js';
import {
  buildChemicalIdentity,
  collectSourceValues,
  collectStrings,
  escapeAttr,
  escapeHTML,
  getBestStructureInput,
  getExternalUrl,
  getFirstString,
  getPathValues,
  getPropertyValue,
  resolveField,
  sanitizeInlineHTML,
  uniqueStrings,
} from './formatters.js';
import {
  generateUniqueId,
  renderMoreButton,
  renderTooltipHeader,
  renderTooltipShell,
} from '../../core/renderer.js';
import { getSectionState, renderCollapsibleSection } from '../../core/sections.js';

interface RenderOptions {
  uniqueId?: string;
  truncate?: number;
  synonymCount?: number;
  listCount?: number;
  tooltipWidth?: number;
  tooltipHeight?: number;
  sectionVariant?: SectionVariant;
  display?: Partial<MyChemDisplayConfig>;
  structureRenderer?: MyChemStructureRenderer;
}

interface Group {
  title: string;
  items: string[];
  sourcePath?: string;
}

interface IdentifierRow {
  label: string;
  value: string;
  action: 'open' | 'copy';
  url?: string;
  sourcePath?: string;
}

function renderPinButton(): string {
  return `
    <button class="gt-pin-button" aria-label="Pin tooltip" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354"/>
      </svg>
    </button>
  `;
}

export function renderTooltipHTML(
  data: MyChemInfoResult | null | undefined,
  options: RenderOptions = {}
): string {
  if (!data) return '<p>Chemical not found.</p>';

  const uniqueId = options.uniqueId || generateUniqueId();
  const truncate = options.truncate ?? 4;
  const synonymCount = options.synonymCount ?? 6;
  const listCount = options.listCount ?? 5;
  const display = {
    ...defaultMyChemConfig.display,
    ...options.display,
  };
  const collapsible = display.collapsible ?? true;
  const globalCollapsedByDefault = display.collapsedByDefault ?? true;
  const showSourcePaths = display.sourcePaths === true;

  const styleParts: string[] = [];
  if (options.tooltipWidth) styleParts.push(`max-width: ${options.tooltipWidth}px`);
  if (options.tooltipHeight) styleParts.push(`max-height: ${options.tooltipHeight}px`, 'overflow-y: auto');
  const inlineStyle = styleParts.length > 0 ? `style="${styleParts.join('; ')}"` : '';

  const identity = buildChemicalIdentity(data, data.query);
  const { isVisible: showIdentityMeta } = getSectionState(
    display.identity as MyChemSectionVisibility | undefined,
    globalCollapsedByDefault
  );
  const titleHTML = `
    <strong>${escapeHTML(identity.preferredName)}</strong>
    ${identity.secondaryName ? `<span class="gene-tooltip-name">(${escapeHTML(identity.secondaryName)})</span>` : ''}
  `;
  const propertyFields = getResolvedPropertyFields(data);

  const buildSection = (
    key: keyof MyChemDisplayConfig,
    title: string,
    content: string,
    headerRightHTML = ''
  ) => {
    if (!content) return '';

    const setting = display[key] as MyChemSectionVisibility | undefined;
    const { isVisible, startCollapsed } = getSectionState(setting, globalCollapsedByDefault);

    if (!isVisible) return '';

    return renderCollapsibleSection(
      title,
      content,
      uniqueId,
      collapsible,
      startCollapsed,
      headerRightHTML
    );
  };

  const visibleIdentity = showIdentityMeta ? identity : undefined;
  const sections = [
    buildSection(
      'structureProperties',
      'Structure & Properties',
      renderStructureProperties(data, propertyFields, visibleIdentity, showSourcePaths, options.structureRenderer),
      renderIdentityHeaderMeta(visibleIdentity)
    ),
    buildSection('summary', 'Summary', renderSummarySection(data, truncate)),
    buildSection('synonyms', 'Synonyms', renderSynonymsSection(identity.synonyms, synonymCount, uniqueId)),
    buildSection('detailedProperties', 'Detailed Properties', renderDetailedProperties(propertyFields, showSourcePaths)),
    buildSection('classes', 'Chemical Classes', renderGroupedSection(getClassGroups(data), listCount, showSourcePaths, uniqueId, 'classes')),
    buildSection('pharmacology', 'Pharmacology & Targets', renderGroupedSection(getPharmacologyGroups(data), listCount, showSourcePaths, uniqueId, 'pharmacology')),
    buildSection('regulatory', 'Regulatory / Products', renderGroupedSection(getRegulatoryGroups(data), listCount, showSourcePaths, uniqueId, 'regulatory')),
    buildSection('safety', 'Safety & Reported Effects', renderSafetySection(data, listCount, showSourcePaths, uniqueId)),
    buildSection('identifiers', 'Identifiers & External Records', renderIdentifiers(data, showSourcePaths)),
    display.rawJson ? buildSection('rawJson', 'Raw MyChem JSON', renderRawJson(data)) : '',
  ].join('');

  return renderTooltipShell(
    uniqueId,
    `
      ${renderTooltipHeader(titleHTML, renderPinButton())}
      ${sections}
      ${display.footer !== false ? renderFooter(data) : ''}
    `,
    inlineStyle,
    options.sectionVariant
  );
}

export function renderMyChemTooltipFromConfig(
  data: MyChemInfoResult | null | undefined,
  uniqueId: string,
  config: MyChemTooltipConfig
): string {
  return renderTooltipHTML(data, {
    uniqueId,
    truncate: config.truncateSummary,
    synonymCount: config.synonymCount,
    listCount: config.listCount,
    tooltipWidth: config.tooltipWidth,
    tooltipHeight: config.tooltipHeight,
    sectionVariant: config.sectionVariant,
    display: config.display,
    structureRenderer: config.structureRenderer,
  });
}

function renderIdentityHeaderMeta(identity: ReturnType<typeof buildChemicalIdentity> | undefined): string {
  if (!identity) return '';

  return identity.matchLabel
    ? `<span class="gt-chem-section-meta">${escapeHTML(identity.matchLabel)}</span>`
    : '';
}

function renderIdentityRow(identity: ReturnType<typeof buildChemicalIdentity> | undefined): string {
  if (!identity || identity.badges.length === 0) return '';

  return `
    <div class="gt-chem-property-row gt-chem-identity-row">
      <dt>Identity</dt>
      <dd>${identity.badges.map(escapeHTML).join(', ')}</dd>
    </div>
  `;
}

function renderIdentityMeta(identity: ReturnType<typeof buildChemicalIdentity> | undefined): string {
  const row = renderIdentityRow(identity);

  return row
    ? `<div class="gt-chem-identity-meta">${row}</div>`
    : '';
}

function renderStructureProperties(
  data: MyChemInfoResult,
  fields: ResolvedField<string>[],
  identity: ReturnType<typeof buildChemicalIdentity> | undefined,
  showSourcePaths: boolean,
  structureRenderer: MyChemStructureRenderer | undefined
): string {
  const compactLabels = new Set(['Formula', 'Molecular weight', 'Exact mass']);
  const identifierLabels = new Set(['SMILES', 'InChIKey']);
  const compactRows = fields
    .filter(field => compactLabels.has(field.label))
    .map(field => renderResolvedField(field, showSourcePaths, compactLabel(field.label)))
    .join('');
  const identifierRows = fields
    .filter(field => identifierLabels.has(field.label))
    .map(field => renderResolvedField(field, showSourcePaths))
    .join('');
  const structure = getBestStructureInput(data);
  const smiles = getBestStructureSmiles(data);
  const figure = renderStructureFigure(structure, data, smiles, structureRenderer);
  const identityMeta = renderIdentityMeta(identity);

  if (!compactRows && !identifierRows && !structure) return '';

  return `
    <div class="gt-chem-structure-layout">
      ${figure}
      ${compactRows || identityMeta ? `
        <div class="gt-chem-structure-summary">
          ${compactRows ? `
            <div class="gt-chem-property-grid gt-chem-property-grid-compact">
              ${compactRows}
            </div>
          ` : ''}
          ${identityMeta}
        </div>
      ` : ''}
      ${identifierRows ? `
        <div class="gt-chem-structure-identifiers">
          <div class="gt-chem-property-grid">
            ${identifierRows}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function renderDetailedProperties(fields: ResolvedField<string>[], showSourcePaths: boolean): string {
  const detailedLabels = new Set([
    'XLogP / LogP',
    'TPSA',
    'H-bond donors',
    'H-bond acceptors',
    'Rotatable bonds',
    'Charge',
    'Stereochemistry count',
  ]);
  const rows = fields
    .filter(field => detailedLabels.has(field.label))
    .map(field => renderResolvedField(field, showSourcePaths))
    .join('');

  if (!rows) return '';

  return `
    <div class="gt-chem-property-grid gt-chem-property-grid-detailed">
      ${rows}
    </div>
  `;
}

function compactLabel(label: string): string {
  return label === 'Molecular weight' ? 'MW' : label;
}

function renderStructureFigure(
  structure: { kind: 'cid' | 'smiles' | 'inchi'; value: string } | undefined,
  data: MyChemInfoResult,
  smiles: string | undefined,
  structureRenderer: MyChemStructureRenderer | undefined
): string {
  const image = structure
    ? renderStructureImage(structure, data, smiles, structureRenderer)
    : '<div class="gt-chem-structure-empty">Structure unavailable</div>';

  return `
    <div class="gt-chem-structure-figure">
      <div class="gt-chem-structure-art">
        ${image}
      </div>
    </div>
  `;
}

function renderStructureImage(
  structure: { kind: 'cid' | 'smiles' | 'inchi'; value: string },
  data: MyChemInfoResult,
  smiles: string | undefined,
  structureRenderer: MyChemStructureRenderer | undefined
): string {
  const alt = '2D chemical structure';
  const rendered = renderCustomStructureImage(structure, data, smiles, alt, structureRenderer);
  if (rendered) return rendered;

  const encoded = encodeURIComponent(structure.value);
  const path = structure.kind === 'cid'
    ? `cid/${encoded}`
    : `${structure.kind}/${encoded}`;
  const src = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/${path}/PNG?image_size=large`;

  return `
    <img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy" />
  `;
}

function renderCustomStructureImage(
  structure: { kind: 'cid' | 'smiles' | 'inchi'; value: string },
  data: MyChemInfoResult,
  smiles: string | undefined,
  alt: string,
  structureRenderer: MyChemStructureRenderer | undefined
): string | undefined {
  if (!structureRenderer) return undefined;

  try {
    return structureRenderer({ structure, smiles, data, alt }) || undefined;
  } catch {
    return undefined;
  }
}

function getBestStructureSmiles(data: MyChemInfoResult): string | undefined {
  return getFirstString(data, [
    'pubchem.isomeric_smiles',
    'pubchem.canonical_smiles',
    'chembl.molecule_structures.canonical_smiles',
    'chebi.smiles',
    'smiles',
  ]);
}

function renderSummarySection(
  data: MyChemInfoResult,
  truncate: number
): string {
  const summary = getFirstString(data, [
    'drugbank.description',
    'chebi.definition',
    'pubchem.description',
    'drugbank.pharmacodynamics',
  ]);
  const summaryHTML = summary
    ? `<p class="gene-tooltip-summary" style="--line-clamp: ${truncate};">${sanitizeInlineHTML(summary)}</p>`
    : '';

  return summaryHTML;
}

function renderSynonymsSection(synonyms: string[], synonymCount: number, uniqueId: string): string {
  return renderValueList(uniqueStrings(synonyms), synonymCount, getSynonymsMoreButtonId(uniqueId));
}

function renderResolvedField(field: ResolvedField<string>, showSourcePaths: boolean, label = field.label): string {
  const sourceCount = uniqueStrings([
    field.canonical.source,
    ...field.alternatives.map(value => value.source),
  ]).length;
  const sourceBadge = sourceCount > 1
    ? `<span class="gt-chem-source-badge">${sourceCount} sources</span>`
    : `<span class="gt-chem-source-badge">${escapeHTML(field.canonical.source)}</span>`;
  const compare = field.alternatives.length > 0
    ? renderSourceCompare(field, showSourcePaths)
    : '';

  return `
    <div class="gt-chem-property-row">
      <dt>${escapeHTML(label)}</dt>
      <dd>
        <span>${escapeHTML(field.canonical.value)}</span>
        ${sourceBadge}
        ${showSourcePaths ? `<code>${escapeHTML(field.canonical.sourcePath)}</code>` : ''}
        ${compare}
      </dd>
    </div>
  `;
}

function renderSourceCompare(field: ResolvedField<string>, showSourcePaths: boolean): string {
  const values = [field.canonical, ...field.alternatives];

  return `
    <details class="gt-chem-compare">
      <summary>${field.resolution === 'precision-difference' ? 'compare precision' : 'compare sources'}</summary>
      <div class="gt-chem-compare-table">
        ${values.map(value => `
          <div>
            <span>${escapeHTML(value.source)}</span>
            <span>${escapeHTML(value.value)}</span>
            ${showSourcePaths ? `<code>${escapeHTML(value.sourcePath)}</code>` : ''}
          </div>
        `).join('')}
      </div>
    </details>
  `;
}

function getResolvedPropertyFields(data: MyChemInfoResult): ResolvedField<string>[] {
  const fieldValues: Array<ResolvedField<string> | undefined> = [
    resolveField('Formula', collectSourceValues(data, [
      { source: 'MyChem', path: 'formula' },
      { source: 'PubChem', path: 'pubchem.molecular_formula' },
      { source: 'ChEMBL', path: 'chembl.molecule_properties.full_molformula' },
      { source: 'ChEBI', path: 'chebi.formulae.formula' },
      { source: 'ChEBI', path: 'chebi.formulae' },
    ])),
    resolveField('Molecular weight', collectSourceValues(data, [
      { source: 'PubChem', path: 'pubchem.molecular_weight' },
      { source: 'ChEMBL', path: 'chembl.molecule_properties.full_mwt' },
      { source: 'ChEMBL', path: 'chembl.molecule_properties.mw_freebase' },
      { source: 'ChEBI', path: 'chebi.mass' },
    ]), { numeric: true, precision: 2 }),
    resolveField('Exact mass', collectSourceValues(data, [
      { source: 'PubChem', path: 'pubchem.exact_mass' },
      { source: 'ChEBI', path: 'chebi.mon_mass' },
    ]), { numeric: true, precision: 4 }),
    resolveField('SMILES', [
      ...collectSourceValues(data, [
        { source: 'MyChem', path: 'smiles' },
        { source: 'PubChem', path: 'pubchem.isomeric_smiles' },
        { source: 'PubChem', path: 'pubchem.canonical_smiles' },
        { source: 'ChEMBL', path: 'chembl.molecule_structures.canonical_smiles' },
        { source: 'ChEBI', path: 'chebi.smiles' },
      ]),
      ...getPropertyValue(data, ['smiles']),
    ]),
    resolveField('InChIKey', collectSourceValues(data, [
      { source: 'MyChem', path: 'inchikey' },
      { source: 'PubChem', path: 'pubchem.inchikey' },
      { source: 'ChEMBL', path: 'chembl.molecule_structures.standard_inchi_key' },
      { source: 'ChEBI', path: 'chebi.inchikey' },
    ])),
    resolveField('XLogP / LogP', [
      ...collectSourceValues(data, [
        { source: 'PubChem', path: 'pubchem.xlogp' },
        { source: 'ChEMBL', path: 'chembl.molecule_properties.alogp' },
      ]),
      ...getPropertyValue(data, ['logp', 'xlogp']),
    ], { numeric: true, precision: 2 }),
    resolveField('TPSA', collectSourceValues(data, [
      { source: 'PubChem', path: 'pubchem.tpsa' },
      { source: 'ChEMBL', path: 'chembl.molecule_properties.psa' },
    ]), { numeric: true, precision: 2 }),
    resolveField('H-bond donors', collectSourceValues(data, [
      { source: 'PubChem', path: 'pubchem.h_bond_donor_count' },
      { source: 'ChEMBL', path: 'chembl.molecule_properties.hbd' },
    ]), { numeric: true, precision: 0 }),
    resolveField('H-bond acceptors', collectSourceValues(data, [
      { source: 'PubChem', path: 'pubchem.h_bond_acceptor_count' },
      { source: 'ChEMBL', path: 'chembl.molecule_properties.hba' },
    ]), { numeric: true, precision: 0 }),
    resolveField('Rotatable bonds', collectSourceValues(data, [
      { source: 'PubChem', path: 'pubchem.rotatable_bond_count' },
      { source: 'ChEMBL', path: 'chembl.molecule_properties.rtb' },
    ]), { numeric: true, precision: 0 }),
    resolveField('Charge', collectSourceValues(data, [
      { source: 'PubChem', path: 'pubchem.charge' },
    ]), { numeric: true, precision: 0 }),
    resolveField('Stereochemistry count', collectSourceValues(data, [
      { source: 'PubChem', path: 'pubchem.defined_atom_stereo_count' },
      { source: 'PubChem', path: 'pubchem.undefined_atom_stereo_count' },
    ]), { numeric: true, precision: 0 }),
  ];

  return fieldValues.filter((field): field is ResolvedField<string> => Boolean(field));
}

function getClassGroups(data: MyChemInfoResult): Group[] {
  return [
    {
      title: 'ChEBI',
      items: collectStrings(data, ['chebi.role', 'chebi.role.name', 'chebi.class', 'chebi.class.name']),
      sourcePath: 'chebi.role',
    },
    {
      title: 'ATC',
      items: collectStrings(data, ['drugbank.atc_codes', 'drugbank.atc_codes.code', 'drugbank.atc_codes.description']),
      sourcePath: 'drugbank.atc_codes',
    },
    {
      title: 'ChEMBL',
      items: collectStrings(data, ['chembl.molecule_type', 'chembl.therapeutic_flag']),
      sourcePath: 'chembl',
    },
    {
      title: 'DrugCentral',
      items: collectStrings(data, ['drugcentral.drug_use.category', 'drugcentral.categories', 'drugcentral.class.name']),
      sourcePath: 'drugcentral',
    },
  ];
}

function getPharmacologyGroups(data: MyChemInfoResult): Group[] {
  return [
    {
      title: 'Mechanism of action',
      items: collectStrings(data, ['drugbank.mechanism_of_action', 'drugcentral.mechanism_of_action']),
      sourcePath: 'drugbank.mechanism_of_action',
    },
    {
      title: 'Indications',
      items: collectStrings(data, ['drugbank.indication', 'drugcentral.indications', 'drugcentral.drug_use.indication']),
      sourcePath: 'drugbank.indication',
    },
    {
      title: 'Targets',
      items: collectStrings(data, [
        'drugbank.targets.name',
        'drugbank.targets.polypeptide.name',
        'chembl.target.name',
        'drugcentral.bioactivity.target_name',
      ]),
      sourcePath: 'drugbank.targets',
    },
    {
      title: 'Target action type',
      items: collectStrings(data, ['drugbank.targets.actions', 'drugcentral.bioactivity.action_type']),
      sourcePath: 'drugbank.targets.actions',
    },
    {
      title: 'Bioactivity summaries',
      items: collectStrings(data, ['drugcentral.bioactivity.act_value', 'chembl.activities.standard_value']),
      sourcePath: 'drugcentral.bioactivity',
    },
  ];
}

function getRegulatoryGroups(data: MyChemInfoResult): Group[] {
  return [
    {
      title: 'Approval / status',
      items: collectStrings(data, ['drugbank.groups', 'chembl.max_phase', 'chembl.first_approval']),
      sourcePath: 'drugbank.groups',
    },
    {
      title: 'Products',
      items: collectStrings(data, [
        'drugbank.products.name',
        'drugbank.products.ndc_product_code',
        'drugcentral.approval.product',
        'drugcentral.ndc.product_ndc',
      ]),
      sourcePath: 'drugbank.products',
    },
    {
      title: 'Orphan designations',
      items: collectStrings(data, ['drugcentral.omop_relationship.orphan', 'drugcentral.orphan']),
      sourcePath: 'drugcentral.orphan',
    },
  ];
}

function renderSafetySection(
  data: MyChemInfoResult,
  listCount: number,
  showSourcePaths: boolean,
  uniqueId: string
): string {
  const rendered = renderGroupedSection(getSafetyGroups(data), listCount, showSourcePaths, uniqueId, 'safety');

  if (!rendered) return '';

  return `
    <p class="gt-chem-caution">Reported effects are source annotations and reports, not clinical advice.</p>
    ${rendered}
  `;
}

function renderGroupedSection(
  groups: Group[],
  listCount: number,
  showSourcePaths: boolean,
  uniqueId: string,
  sectionKey: string
): string {
  return groups
    .map(group => ({ ...group, items: uniqueStrings(group.items) }))
    .filter(group => group.items.length > 0)
    .map(group => `
      <div class="gt-chem-source-group">
        <div class="gt-chem-source-title">
          <span>${escapeHTML(group.title)}</span>
          ${showSourcePaths && group.sourcePath ? `<code>${escapeHTML(group.sourcePath)}</code>` : ''}
        </div>
        ${renderValueList(group.items, listCount, getGroupMoreButtonId(uniqueId, sectionKey, group.title))}
      </div>
    `)
    .join('');
}

function renderValueList(items: string[], listCount: number, moreButtonId: string): string {
  const visible = items.slice(0, listCount);
  const hidden = items.slice(listCount);

  return `
    <ul class="gt-chem-list">
      ${visible.map(item => `<li>${escapeHTML(item)}</li>`).join('')}
    </ul>
    ${hidden.length > 0 ? renderMoreButton(moreButtonId, `... and ${hidden.length} more`) : ''}
  `;
}

function renderIdentifiers(data: MyChemInfoResult, showSourcePaths: boolean): string {
  const rows = getIdentifierRows(data);
  if (rows.length === 0) return '';

  return `
    <div class="gt-chem-id-table">
      ${rows.map(row => renderIdentifierRow(row, showSourcePaths)).join('')}
    </div>
  `;
}

function renderIdentifierRow(row: IdentifierRow, showSourcePaths: boolean): string {
  const action = row.action === 'open' && row.url
    ? `<a href="${escapeAttr(row.url)}" target="_blank" rel="noopener noreferrer">Open</a>`
    : `<button type="button" data-copy="${escapeAttr(row.value)}" onclick="navigator.clipboard && navigator.clipboard.writeText(this.dataset.copy || '')">Copy</button>`;

  return `
    <div class="gt-chem-id-row">
      <span>${escapeHTML(row.label)}</span>
      <code>${escapeHTML(row.value)}</code>
      ${showSourcePaths && row.sourcePath ? `<small>${escapeHTML(row.sourcePath)}</small>` : ''}
      ${action}
    </div>
  `;
}

function getIdentifierRows(data: MyChemInfoResult): IdentifierRow[] {
  const specs = [
    { label: 'PubChem CID', paths: ['pubchem.cid'], action: 'open' as const },
    { label: 'ChEMBL', paths: ['chembl.molecule_chembl_id'], action: 'open' as const },
    { label: 'ChEBI', paths: ['chebi.id'], action: 'open' as const },
    { label: 'DrugBank', paths: ['drugbank.id'], action: 'open' as const },
    { label: 'UNII', paths: ['unii.unii', 'drugbank.unii'], action: 'open' as const },
    { label: 'CAS', paths: ['cas', 'drugbank.cas_number'], action: 'copy' as const },
    { label: 'RxCUI', paths: ['rxcui', 'unii.rxcui', 'drugcentral.rxcui'], action: 'open' as const },
    { label: 'InChIKey', paths: ['inchikey', 'pubchem.inchikey', 'chembl.molecule_structures.standard_inchi_key', 'chebi.inchikey'], action: 'copy' as const },
    { label: 'SMILES', paths: ['smiles', 'pubchem.isomeric_smiles', 'chembl.molecule_structures.canonical_smiles', 'chebi.smiles'], action: 'copy' as const },
  ];
  const seen = new Set<string>();
  const rows: IdentifierRow[] = [];

  specs.forEach(spec => {
    for (const path of spec.paths) {
      const value = uniqueStrings(getPathValues(data, path))[0];
      if (!value) continue;

      const key = `${spec.label}:${value.toLowerCase()}`;
      if (seen.has(key)) break;
      seen.add(key);
      rows.push({
        label: spec.label,
        value,
        action: spec.action,
        url: spec.action === 'open' ? getExternalUrl(spec.label, value) : undefined,
        sourcePath: path,
      });
      break;
    }
  });

  return rows;
}

function renderRawJson(data: MyChemInfoResult): string {
  return `
    <details class="gt-chem-raw" open>
      <summary>View JSON</summary>
      <pre>${escapeHTML(JSON.stringify(data, null, 2))}</pre>
    </details>
  `;
}

function renderFooter(data: MyChemInfoResult): string {
  const sourceValues: SourceValue<string>[] = collectSourceValues(data, [
    { source: 'MyChem', path: '_id' },
  ]);
  const id = sourceValues[0]?.value ?? data._id;

  return `
    <div class="gt-source-footer gt-chem-footer">
      <span>Data from MyChem.info</span>
      <a href="https://mychem.info/v1/chem/${encodeURIComponent(id)}" target="_blank" rel="noopener noreferrer">View JSON</a>
    </div>
  `;
}

export function getMyChemNestedTooltipDefinitions(
  data: MyChemInfoResult,
  config: MyChemTooltipConfig,
  uniqueId: string
): NestedTooltipDefinition[] {
  const identity = buildChemicalIdentity(data, data.query);
  const listCount = config.listCount;
  const synonymCount = config.synonymCount;
  const definitions: NestedTooltipDefinition[] = [];

  addTextDefinition(definitions, getSynonymsMoreButtonId(uniqueId), identity.synonyms, synonymCount);
  addGroupedDefinitions(definitions, getClassGroups(data), listCount, uniqueId, 'classes');
  addGroupedDefinitions(definitions, getPharmacologyGroups(data), listCount, uniqueId, 'pharmacology');
  addGroupedDefinitions(definitions, getRegulatoryGroups(data), listCount, uniqueId, 'regulatory');
  addGroupedDefinitions(definitions, getSafetyGroups(data), listCount, uniqueId, 'safety');

  return definitions;
}

function getSafetyGroups(data: MyChemInfoResult): Group[] {
  return [
    {
      title: 'Reported side effects',
      items: collectStrings(data, ['sider.side_effect.name', 'sider.side_effect', 'drugbank.toxicity']),
      sourcePath: 'sider.side_effect',
    },
    {
      title: 'Adverse-event reports',
      items: collectStrings(data, ['aeolus.outcomes.name', 'aeolus.outcomes', 'aeolus.adverse_events']),
      sourcePath: 'aeolus.outcomes',
    },
  ];
}

function addGroupedDefinitions(
  definitions: NestedTooltipDefinition[],
  groups: Group[],
  listCount: number,
  uniqueId: string,
  sectionKey: string
): void {
  groups
    .map(group => ({ ...group, items: uniqueStrings(group.items) }))
    .forEach(group => addTextDefinition(
      definitions,
      getGroupMoreButtonId(uniqueId, sectionKey, group.title),
      group.items,
      listCount
    ));
}

function addTextDefinition(
  definitions: NestedTooltipDefinition[],
  selectorId: string,
  items: string[],
  visibleCount: number
): void {
  const uniqueItems = uniqueStrings(items);
  if (uniqueItems.length <= visibleCount) return;

  definitions.push({
    selector: `#${selectorId}`,
    items: uniqueItems.map(name => ({ name })),
  });
}

function getSynonymsMoreButtonId(uniqueId: string): string {
  return `mychem-more-synonyms-${uniqueId}`;
}

function getGroupMoreButtonId(uniqueId: string, sectionKey: string, title: string): string {
  return `mychem-more-${sectionKey}-${slugifyId(title)}-${uniqueId}`;
}

function slugifyId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'items';
}
