import type { EntityRef } from '../../core/types.js';
import type { MyChemInfoResult, MyChemScope } from './types.js';

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
  'drugcentral',
  'sider',
  'aeolus',
].join(',');

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

export async function fetchMyChemRefs(refs: EntityRef[]): Promise<Map<string, MyChemInfoResult>> {
  const refsByScope = new Map<MyChemScope, EntityRef[]>();

  refs.forEach(ref => {
    const scope = normalizeMyChemScope(ref.context?.scope);
    if (!refsByScope.has(scope)) {
      refsByScope.set(scope, []);
    }
    refsByScope.get(scope)!.push(ref);
  });

  const results = new Map<string, MyChemInfoResult>();
  await Promise.allSettled(
    Array.from(refsByScope.entries()).map(async ([scope, scopedRefs]) => {
      const batchResults = await fetchMyChemBatch(scopedRefs.map(ref => ref.query), scope);
      batchResults.forEach((data, query) => {
        results.set(getMyChemCacheKey(query, scope), data);
      });
    })
  );

  return results;
}

export function getMyChemCacheKey(query: string, scope: MyChemScope = 'name'): string {
  return `mychem:${scope}:${query}`;
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
