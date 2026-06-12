import type { TooltipProfile } from '../../core/types.js';
import { fetchMyChemRefs, getMyChemCacheKey, normalizeMyChemScope } from './client.js';
import { parseChemicalElement } from './parser.js';
import type { MyChemInfoResult } from './types.js';

function renderValue(label: string, value: string | number | undefined): string {
  if (value === undefined || value === '') return '';

  return `
    <div class="gene-tooltip-section">
      <strong>${label}</strong>
      <span>${value}</span>
    </div>
  `;
}

function firstName(data: MyChemInfoResult): string {
  if (Array.isArray(data.name)) {
    return data.name[0] ?? data._id;
  }

  return data.name ?? data.drugbank?.name ?? data.chebi?.name ?? data.chembl?.pref_name ?? data._id;
}

function renderMyChemTooltip(data: MyChemInfoResult | null | undefined, uniqueId: string): string {
  if (!data) return '<p>Chemical not found.</p>';

  const title = firstName(data);
  const description = data.drugbank?.description
    ? `<p class="gene-tooltip-summary" style="--line-clamp: 4;">${data.drugbank.description}</p>`
    : '';

  return `
    <div class="gene-tooltip-content" data-tooltip-id="${uniqueId}">
      <div class="gene-tooltip-header">
        <div class="gene-tooltip-title">
          <strong>${title}</strong>
          <span class="gene-tooltip-name">(${data._id})</span>
        </div>
      </div>
      ${description}
      ${renderValue('Formula', data.formula)}
      ${renderValue('InChIKey', data.inchikey)}
      ${renderValue('ChEMBL', data.chembl?.molecule_chembl_id)}
      ${renderValue('ChEBI', data.chebi?.id)}
      ${renderValue('DrugBank', data.drugbank?.id)}
      ${renderValue('PubChem', data.pubchem?.cid)}
      ${renderValue('UNII', data.unii?.unii)}
    </div>
  `;
}

export const myChemProfile: TooltipProfile<MyChemInfoResult> = {
  id: 'mychem',
  invalidElementMessage: 'Invalid chemical element',
  notFoundHTML: '<p>Chemical not found.</p>',
  provider: {
    id: 'mychem',
    parseElement: parseChemicalElement,
    getCacheKey(ref) {
      return getMyChemCacheKey(ref.query, normalizeMyChemScope(ref.context?.scope));
    },
    fetchBatch: fetchMyChemRefs,
  },
  renderTooltipHTML(data, options) {
    return renderMyChemTooltip(data, options.uniqueId);
  },
};
