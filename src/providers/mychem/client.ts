import type { EntityRef } from '../../core/types.js';
import type { MyChemInfoResult, MyChemLookupMode, MyChemRecord, MyChemScope } from './types.js';

const MYCHEM_FIELDS = [
  '_id',
  '_score',
  'name',
  'synonyms',
  'smiles',
  'inchi',
  'inchikey',
  'formula',
  'cas',
  'rxcui',
  'chembl.molecule_chembl_id',
  'chembl.pref_name',
  'chembl.molecule_type',
  'chembl.max_phase',
  'chembl.first_approval',
  'chembl.molecule_properties',
  'chembl.molecule_structures',
  'chembl.molecule_synonyms',
  'chebi.id',
  'chebi.name',
  'chebi.definition',
  'chebi.formulae',
  'chebi.inchi',
  'chebi.inchikey',
  'chebi.mass',
  'chebi.mon_mass',
  'chebi.role',
  'chebi.smiles',
  'chebi.synonyms',
  'drugbank.id',
  'drugbank.name',
  'drugbank.description',
  'drugbank.synonyms',
  'drugbank.cas_number',
  'drugbank.unii',
  'drugbank.groups',
  'drugbank.categories',
  'drugbank.atc_codes',
  'drugbank.indication',
  'drugbank.mechanism_of_action',
  'drugbank.pharmacodynamics',
  'drugbank.toxicity',
  'drugbank.targets',
  'drugbank.products',
  'drugbank.calculated_properties',
  'drugbank.experimental_properties',
  'pubchem.cid',
  'pubchem.molecular_formula',
  'pubchem.molecular_weight',
  'pubchem.exact_mass',
  'pubchem.canonical_smiles',
  'pubchem.isomeric_smiles',
  'pubchem.inchi',
  'pubchem.inchikey',
  'pubchem.iupac',
  'pubchem.xlogp',
  'pubchem.tpsa',
  'pubchem.h_bond_donor_count',
  'pubchem.h_bond_acceptor_count',
  'pubchem.rotatable_bond_count',
  'pubchem.charge',
  'pubchem.defined_atom_stereo_count',
  'pubchem.undefined_atom_stereo_count',
  'pubchem.synonyms',
  'unii.unii',
  'unii.preferred_term',
  'unii.rxcui',
  'unii.pubchem',
  'ndc.productndc',
  'ndc.proprietaryname',
  'ndc.nonproprietaryname',
  'ndc.substancename',
  'drugcentral',
  'sider',
  'aeolus',
].join(',');

const DIRECT_ANNOTATION_SCOPES = new Set<MyChemScope>([
  'inchikey',
  'chebi.id',
  'chembl.molecule_chembl_id',
  'pubchem.cid',
  'unii.unii',
]);

export async function fetchMyChemBatch(
  queries: string[],
  scope: MyChemScope = 'name'
): Promise<Map<string, MyChemInfoResult>> {
  if (!queries || queries.length === 0) {
    return new Map();
  }

  try {
    const body = new URLSearchParams({
      q: queries.join(','),
      scopes: scope,
      fields: MYCHEM_FIELDS,
    });

    const response = await fetch('https://mychem.info/v1/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const results: (MyChemInfoResult & { notfound?: boolean })[] = await response.json();
    const resultsMap = new Map<string, MyChemInfoResult>();

    results.forEach(item => {
      if (item.notfound) return;
      if (item.query) {
        resultsMap.set(item.query, item);
      }
    });

    return resultsMap;
  } catch (error) {
    console.error('MyChem batch fetch failed:', error);
    return new Map();
  }
}

export async function fetchMyChemAnnotationBatch(
  ids: string[]
): Promise<Map<string, MyChemInfoResult>> {
  if (!ids || ids.length === 0) {
    return new Map();
  }

  try {
    const body = new URLSearchParams({
      ids: ids.join(','),
      fields: MYCHEM_FIELDS,
    });

    const response = await fetch('https://mychem.info/v1/chem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const results: (MyChemInfoResult & { notfound?: boolean; query?: string })[] = await response.json();
    const resultsMap = new Map<string, MyChemInfoResult>();

    results.forEach((item, index) => {
      if (item.notfound) return;
      const query = item.query ?? ids[index];
      if (query) {
        resultsMap.set(query, item);
      }
    });

    return resultsMap;
  } catch (error) {
    console.error('MyChem annotation fetch failed:', error);
    return new Map();
  }
}

export async function fetchMyChemBestGuessBatch(
  queries: string[]
): Promise<Map<string, MyChemInfoResult>> {
  if (!queries || queries.length === 0) {
    return new Map();
  }

  const resultsMap = new Map<string, MyChemInfoResult>();

  await Promise.allSettled(
    queries.map(async query => {
      const result = await fetchBestGuessResult(query);
      if (result) {
        resultsMap.set(query, result);
      }
    })
  );

  return resultsMap;
}

export async function fetchMyChemRefs(refs: EntityRef[]): Promise<Map<string, MyChemInfoResult>> {
  const refsByLookup = new Map<string, { lookup: MyChemLookupMode; scope: MyChemScope; refs: EntityRef[] }>();

  refs.forEach(ref => {
    const scope = normalizeMyChemScope(ref.context?.scope);
    const lookup = normalizeMyChemLookupMode(ref.context?.lookup, scope);
    const key = `${lookup}:${scope}`;
    if (!refsByLookup.has(key)) {
      refsByLookup.set(key, { lookup, scope, refs: [] });
    }
    refsByLookup.get(key)!.refs.push(ref);
  });

  const results = new Map<string, MyChemInfoResult>();
  await Promise.allSettled(
    Array.from(refsByLookup.values()).map(async ({ lookup, scope, refs: scopedRefs }) => {
      const queries = scopedRefs.map(ref => ref.query);
      const batchResults = lookup === 'best-guess'
        ? await fetchMyChemBestGuessBatch(queries)
        : DIRECT_ANNOTATION_SCOPES.has(scope)
          ? await fetchMyChemAnnotationBatch(queries)
          : await fetchMyChemBatch(queries, scope);

      batchResults.forEach((data, query) => {
        results.set(getMyChemCacheKey(query, scope, lookup), data);
      });
    })
  );

  return results;
}

export function getMyChemCacheKey(
  query: string,
  scope: MyChemScope = 'name',
  lookup: MyChemLookupMode = normalizeMyChemLookupMode(undefined, scope)
): string {
  return `mychem:${lookup}:${scope}:${query}`;
}

export function normalizeMyChemScope(scope: unknown): MyChemScope {
  if (typeof scope !== 'string') {
    return 'name';
  }

  const normalized = scope.trim().toLowerCase();
  const aliases: Record<string, MyChemScope> = {
    name: 'name',
    inchi: 'inchi',
    inchikey: 'inchikey',
    chebi: 'chebi.id',
    'chebi.id': 'chebi.id',
    chembl: 'chembl.molecule_chembl_id',
    'chembl.molecule_chembl_id': 'chembl.molecule_chembl_id',
    drugbank: 'drugbank.id',
    'drugbank.id': 'drugbank.id',
    pubchem: 'pubchem.cid',
    cid: 'pubchem.cid',
    'pubchem.cid': 'pubchem.cid',
    unii: 'unii.unii',
    'unii.unii': 'unii.unii',
  };

  if (normalized in aliases) {
    return aliases[normalized];
  }

  return 'name';
}

export function normalizeMyChemLookupMode(
  lookup: unknown,
  scope: MyChemScope = 'name'
): MyChemLookupMode {
  if (typeof lookup === 'string') {
    const normalized = lookup.trim().toLowerCase();
    if (['id', 'identifier', 'exact'].includes(normalized)) return 'id';
    if (['best-guess', 'bestguess', 'search', 'name'].includes(normalized)) return 'best-guess';
  }

  return scope === 'name' ? 'best-guess' : 'id';
}

async function fetchBestGuessResult(query: string): Promise<MyChemInfoResult | undefined> {
  const constrainedHits = await queryMyChemSearch(buildBestGuessQuery(query), 10);
  const unconstrainedHits = constrainedHits.length > 0
    ? []
    : await queryMyChemSearch(query, 10);
  const hits = constrainedHits.length > 0 ? constrainedHits : unconstrainedHits;

  return selectBestGuessHit(hits, query);
}

async function queryMyChemSearch(query: string, size: number): Promise<MyChemInfoResult[]> {
  const params = new URLSearchParams({
    q: query,
    fields: MYCHEM_FIELDS,
    size: String(size),
  });

  const response = await fetch(`https://mychem.info/v1/query?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const payload = await response.json();
  return Array.isArray(payload?.hits) ? payload.hits : [];
}

function buildBestGuessQuery(query: string): string {
  const escaped = query.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${escaped}" AND (_exists_:pubchem OR _exists_:chembl OR _exists_:chebi OR _exists_:drugbank OR _exists_:unii OR _exists_:inchikey)`;
}

function selectBestGuessHit(
  hits: MyChemInfoResult[],
  query: string
): MyChemInfoResult | undefined {
  return hits
    .filter(hit => !isNotFound(hit))
    .sort((a, b) => scoreBestGuessHit(b, query) - scoreBestGuessHit(a, query))[0];
}

function scoreBestGuessHit(hit: MyChemInfoResult, query: string): number {
  const normalizedQuery = normalizeComparable(query);
  const moleculeEvidence = [
    'pubchem.cid',
    'inchikey',
    'inchi',
    'smiles',
    'chembl.molecule_chembl_id',
    'chebi.id',
    'drugbank.id',
    'unii.unii',
  ];
  const hasMoleculeEvidence = moleculeEvidence.some(path => getPathValues(hit, path).length > 0);
  const hasNdc = getPathValues(hit, 'ndc').length > 0;
  const score = Number(hit._score) || 0;
  const candidateNames = [
    'name',
    'synonyms',
    'drugbank.name',
    'drugbank.synonyms',
    'drugbank.synonyms.synonym',
    'chembl.pref_name',
    'chembl.molecule_synonyms.synonyms',
    'chembl.molecule_synonyms.molecule_synonym',
    'chebi.name',
    'chebi.synonyms',
    'chebi.synonyms.synonym',
    'unii.preferred_term',
    'pubchem.synonyms',
    'ndc.proprietaryname',
    'ndc.nonproprietaryname',
    'ndc.substancename',
  ].flatMap(path => getPathValues(hit, path))
    .map(primitiveToString)
    .filter((value): value is string => Boolean(value));
  const exactNameMatch = candidateNames.some(name => normalizeComparable(name) === normalizedQuery);
  const looseNameMatch = candidateNames.some(name => normalizeComparable(name).includes(normalizedQuery));

  return score
    + (hasMoleculeEvidence ? 100 : 0)
    + (getPathValues(hit, 'pubchem.cid').length > 0 ? 40 : 0)
    + (getPathValues(hit, 'inchikey').length > 0 ? 25 : 0)
    + (exactNameMatch ? 35 : 0)
    + (!exactNameMatch && looseNameMatch ? 10 : 0)
    - (hasNdc && !hasMoleculeEvidence ? 100 : 0)
    - (hasNdc && hasMoleculeEvidence ? 10 : 0);
}

function isNotFound(hit: MyChemInfoResult): boolean {
  return Boolean((hit as MyChemInfoResult & { notfound?: boolean }).notfound);
}

function getPathValues(record: unknown, path: string): unknown[] {
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
