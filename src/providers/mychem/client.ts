import type { EntityRef } from '../../core/types.js';
import type { MyChemInfoResult, MyChemScope } from './types.js';

const MYCHEM_FIELDS = [
  '_id',
  'name',
  'inchi',
  'inchikey',
  'formula',
  'chembl.molecule_chembl_id',
  'chembl.pref_name',
  'chebi.id',
  'chebi.name',
  'drugbank.id',
  'drugbank.name',
  'drugbank.description',
  'pubchem.cid',
  'unii.unii',
  'unii.preferred_term',
].join(',');

export async function fetchMyChemBatch(
  queries: string[],
  scope: MyChemScope = 'name'
): Promise<Map<string, MyChemInfoResult>> {
  if (!queries || queries.length === 0) {
    return new Map();
  }

  try {
    const response = await fetch('https://mychem.info/v1/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `q=${queries.join(',')}&scopes=${scope}&fields=${MYCHEM_FIELDS}`,
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
  if (
    scope === 'inchikey' ||
    scope === 'chebi' ||
    scope === 'chembl' ||
    scope === 'drugbank' ||
    scope === 'pubchem' ||
    scope === 'unii'
  ) {
    return scope;
  }

  return 'name';
}
