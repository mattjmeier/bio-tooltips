import type {
  MyChemInfoResult,
  MyChemPrimitive,
  MyChemRecord,
  ResolvedField,
  SourceValue,
} from './types.js';

export interface FieldCandidate {
  source: string;
  path: string;
  url?: string;
}

export interface ChemicalIdentity {
  preferredName: string;
  secondaryName?: string;
  synonyms: string[];
  badges: string[];
  matchLabel?: string;
}

const SOURCE_PRIORITY = ['PubChem', 'ChEMBL', 'ChEBI', 'DrugBank', 'UNII', 'MyChem'];

export function escapeHTML(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeAttr(value: unknown): string {
  return escapeHTML(value).replace(/`/g, '&#96;');
}

export function sanitizeInlineHTML(value: unknown): string {
  const allowedTags = new Set(['b', 'em', 'i', 'strong', 'sub', 'sup']);

  return String(value)
    .split(/(<[^>]*>)/g)
    .map(part => {
      const tag = part.match(/^<\s*(\/?)\s*([a-z][a-z0-9]*)(?:\s+[^>]*)?\s*>$/i);
      if (!tag) return escapeHTML(part);

      const tagName = tag[2].toLowerCase();
      if (!allowedTags.has(tagName)) return escapeHTML(part);

      return tag[1] ? `</${tagName}>` : `<${tagName}>`;
    })
    .join('');
}

export function asArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || typeof value === 'undefined') return [];
  return Array.isArray(value) ? value : [value];
}

export function uniqueStrings(values: unknown[]): string[] {
  const seen = new Set<string>();
  const results: string[] = [];

  values.forEach(value => {
    const text = primitiveToString(value);
    if (!text) return;
    const key = text.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    results.push(text);
  });

  return results;
}

export function getPathValues(record: unknown, path: string): unknown[] {
  const segments = path.split('.');

  function walk(value: unknown, index: number): unknown[] {
    if (value === null || typeof value === 'undefined') return [];
    if (Array.isArray(value)) {
      return value.flatMap(item => walk(item, index));
    }
    if (index >= segments.length) return [value];
    if (!isRecord(value)) return [];

    return walk(value[segments[index]], index + 1);
  }

  return walk(record, 0);
}

export function getFirstString(record: unknown, paths: string[]): string | undefined {
  for (const path of paths) {
    const value = uniqueStrings(getPathValues(record, path))[0];
    if (value) return value;
  }

  return undefined;
}

export function collectStrings(record: unknown, paths: string[]): string[] {
  return uniqueStrings(paths.flatMap(path => getPathValues(record, path)));
}

export function collectSourceValues(
  data: MyChemInfoResult,
  candidates: FieldCandidate[]
): SourceValue<string>[] {
  const values: SourceValue<string>[] = [];

  candidates.forEach(candidate => {
    uniqueStrings(getPathValues(data, candidate.path)).forEach(value => {
      values.push({
        value,
        source: candidate.source,
        sourcePath: candidate.path,
        url: candidate.url,
      });
    });
  });

  return dedupeSourceValues(values);
}

export function resolveField(
  label: string,
  values: SourceValue<string>[],
  options: { numeric?: boolean; precision?: number } = {}
): ResolvedField<string> | undefined {
  if (values.length === 0) return undefined;

  const deduped = dedupeSourceValues(values);
  const canonical = selectCanonical(deduped);
  const alternatives = deduped.filter(value => value !== canonical);
  const normalizedValues = new Set(deduped.map(value => normalizeComparable(value.value)));

  if (deduped.length === 1) {
    return { label, canonical, alternatives, resolution: 'single' };
  }

  if (normalizedValues.size === 1) {
    return { label, canonical, alternatives, resolution: 'agreement' };
  }

  if (options.numeric && deduped.every(value => Number.isFinite(Number(value.value)))) {
    const precision = options.precision ?? 2;
    const rounded = new Set(deduped.map(value => Number(value.value).toFixed(precision)));
    if (rounded.size === 1) {
      return {
        label,
        canonical: {
          ...canonical,
          value: trimNumber(Number(canonical.value), precision),
          quality: 'preferred',
        },
        alternatives,
        resolution: 'precision-difference',
      };
    }
  }

  return {
    label,
    canonical: { ...canonical, quality: 'conflict' },
    alternatives,
    resolution: 'conflict',
  };
}

export function getPropertyValue(data: MyChemInfoResult, names: string[]): SourceValue<string>[] {
  return [
    ...propertyArrayValues(data, 'drugbank.calculated_properties', names, 'DrugBank'),
    ...propertyArrayValues(data, 'drugbank.experimental_properties', names, 'DrugBank'),
  ];
}

export function buildChemicalIdentity(data: MyChemInfoResult, query?: string): ChemicalIdentity {
  const names = uniqueStrings([
    ...asArray(data.name),
    ...collectStrings(data, [
      'drugbank.name',
      'chembl.pref_name',
      'chebi.name',
      'unii.preferred_term',
      'pubchem.iupac',
    ]),
  ]);

  const preferredName = names[0] ?? data._id;
  const secondaryName = names.find(name => name !== preferredName);
  const synonyms = uniqueStrings([
    ...names.slice(1),
    ...collectStrings(data, [
      'synonyms',
      'pubchem.synonyms',
      'drugbank.synonyms',
      'drugbank.synonyms.synonym',
      'chebi.synonyms',
      'chebi.synonyms.synonym',
      'chembl.molecule_synonyms.synonyms',
      'chembl.molecule_synonyms.molecule_synonym',
    ]),
  ]).filter(name => name.toLowerCase() !== preferredName.toLowerCase());

  const badges = buildBadges(data);

  return {
    preferredName,
    secondaryName,
    synonyms,
    badges,
    matchLabel: describeMatch(data, query),
  };
}

export function getPubChemCid(data: MyChemInfoResult): string | undefined {
  return getFirstString(data, ['pubchem.cid', 'unii.pubchem', 'drugbank.external_identifiers.pubchem']);
}

export function getBestStructureInput(data: MyChemInfoResult): { kind: 'cid' | 'smiles' | 'inchi'; value: string } | undefined {
  const cid = getPubChemCid(data);
  if (cid) return { kind: 'cid', value: cid };

  const smiles = getFirstString(data, [
    'pubchem.isomeric_smiles',
    'pubchem.canonical_smiles',
    'chembl.molecule_structures.canonical_smiles',
    'chebi.smiles',
    'smiles',
  ]);
  if (smiles) return { kind: 'smiles', value: smiles };

  const inchi = getFirstString(data, [
    'inchi',
    'pubchem.inchi',
    'chembl.molecule_structures.standard_inchi',
    'chebi.inchi',
  ]);
  if (inchi) return { kind: 'inchi', value: inchi };

  return undefined;
}

export function getExternalUrl(kind: string, value: string): string | undefined {
  const encoded = encodeURIComponent(value);

  switch (kind) {
    case 'PubChem CID':
      return `https://pubchem.ncbi.nlm.nih.gov/compound/${encoded}`;
    case 'ChEMBL':
      return `https://www.ebi.ac.uk/chembl/compound_report_card/${encoded}/`;
    case 'ChEBI':
      return `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=${encoded}`;
    case 'DrugBank':
      return `https://go.drugbank.com/drugs/${encoded}`;
    case 'UNII':
      return `https://precision.fda.gov/uniisearch/srs/unii/${encoded}`;
    case 'RxCUI':
      return `https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${encoded}`;
    case 'CAS':
      return `https://commonchemistry.cas.org/detail?cas_rn=${encoded}`;
    default:
      return undefined;
  }
}

function isRecord(value: unknown): value is MyChemRecord {
  return typeof value === 'object' && value !== null;
}

function primitiveToString(value: unknown): string | undefined {
  if (typeof value === 'string') return value.trim() || undefined;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return undefined;
}

function normalizeComparable(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function trimNumber(value: number, precision: number): string {
  return value.toFixed(precision).replace(/\.?0+$/, '');
}

function dedupeSourceValues<T extends MyChemPrimitive>(values: SourceValue<T>[]): SourceValue<T>[] {
  const seen = new Set<string>();
  const deduped: SourceValue<T>[] = [];

  values.forEach(value => {
    const key = `${value.sourcePath}:${String(value.value).toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    deduped.push(value);
  });

  return deduped;
}

function selectCanonical(values: SourceValue<string>[]): SourceValue<string> {
  const priority = (source: string) => {
    const index = SOURCE_PRIORITY.indexOf(source);
    return index === -1 ? SOURCE_PRIORITY.length : index;
  };

  return [...values].sort((a, b) => priority(a.source) - priority(b.source))[0];
}

function propertyArrayValues(
  data: MyChemInfoResult,
  path: string,
  names: string[],
  source: string
): SourceValue<string>[] {
  const wanted = names.map(name => name.toLowerCase());

  return getPathValues(data, path).flatMap(entry => {
    if (!isRecord(entry)) return [];

    const label = primitiveToString(entry.kind)
      ?? primitiveToString(entry.name)
      ?? primitiveToString(entry.property);
    const value = primitiveToString(entry.value);

    if (!label || !value) return [];
    if (!wanted.some(name => label.toLowerCase().includes(name))) return [];

    return [{ value, source, sourcePath: `${path}.${label}` }];
  });
}

function buildBadges(data: MyChemInfoResult): string[] {
  const rawGroups = collectStrings(data, [
    'drugbank.groups',
    'drugbank.groups.group',
    'drugbank.categories.category',
  ]);
  const roles = collectStrings(data, ['chebi.role', 'chebi.role.name']);
  const chemblType = getFirstString(data, ['chembl.molecule_type']);
  const badges = uniqueStrings([
    chemblType ?? 'small molecule',
    ...rawGroups,
    ...roles.filter(role => /metabolite|pesticide|toxin|solvent|drug/i.test(role)).slice(0, 3),
  ]);

  return badges.slice(0, 5);
}

function describeMatch(data: MyChemInfoResult, query?: string): string | undefined {
  const normalizedQuery = query?.trim().toLowerCase();
  if (!normalizedQuery) return undefined;

  if (data.inchikey?.toLowerCase() === normalizedQuery) return 'exact InChIKey match';

  const cid = getPubChemCid(data);
  if (cid?.toLowerCase() === normalizedQuery) return 'PubChem CID match';

  const chembl = getFirstString(data, ['chembl.molecule_chembl_id']);
  if (chembl?.toLowerCase() === normalizedQuery) return 'ChEMBL ID match';

  const chebi = getFirstString(data, ['chebi.id']);
  if (chebi?.toLowerCase() === normalizedQuery) return 'ChEBI ID match';

  const drugbank = getFirstString(data, ['drugbank.id']);
  if (drugbank?.toLowerCase() === normalizedQuery) return 'DrugBank ID match';

  const unii = getFirstString(data, ['unii.unii']);
  if (unii?.toLowerCase() === normalizedQuery) return 'UNII match';

  const names = collectStrings(data, ['name', 'drugbank.name', 'chembl.pref_name', 'chebi.name']);
  if (names.some(name => name.toLowerCase() === normalizedQuery)) return 'name match';

  const synonyms = collectStrings(data, ['synonyms', 'pubchem.synonyms', 'drugbank.synonyms', 'chebi.synonyms']);
  if (synonyms.some(name => name.toLowerCase() === normalizedQuery)) return 'synonym match';

  return undefined;
}
