import type { EntityRef } from '../../core/types.js';
import type { MyGeneInfoResult } from './types.js';

const MYGENE_FIELDS = [
  '_id',
  'query',
  'symbol',
  'name',
  'summary',
  'taxid',
  'genomic_pos',
  'pathway',
  'interpro',
  'exons',
  'ensembl.gene',
  'ensembl.protein',
  'ensembl.transcript',
  'pdb',
  'generif',
  'wikipedia.url_stub'
].join(',');

/**
 * Fetches data for multiple genes in a single batch request from mygene.info.
 * @param geneSymbols - An array of gene symbols.
 * @param species - The species for all genes in this batch.
 * @returns A Map of gene symbols to data.
 */
export async function fetchMyGeneBatch(
  geneSymbols: string[],
  species: string,
  throwOnError = false,
  fields: string = MYGENE_FIELDS
): Promise<Map<string, MyGeneInfoResult>> {
  if (!geneSymbols || geneSymbols.length === 0) {
    return new Map();
  }

  const url = 'https://mygene.info/v3/query';
  const query = geneSymbols.join(',');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ q: query, species, scopes: 'symbol', fields }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const results: (MyGeneInfoResult & { notfound?: boolean })[] = await response.json();
    const resultsMap = new Map<string, MyGeneInfoResult>();
    for (const item of results) {
      if (item.notfound) continue;
      resultsMap.set(item.query, item);
    }
    return resultsMap;
  } catch (error) {
    if (throwOnError) throw error;
    console.error('Batch fetch failed:', error);
    return new Map();
  }
}

export async function fetchMyGeneRefs(refs: EntityRef[], fields?: readonly string[]): Promise<Map<string, MyGeneInfoResult>> {
  if (refs.some(ref => ref.context?.recordId)) {
    const results = new Map<string, MyGeneInfoResult>();
    const resolved = refs.filter(ref => ref.context?.recordId);
    const unresolved = refs.filter(ref => !ref.context?.recordId);
    const ids = resolved.map(ref => String(ref.context!.recordId));
    const selectedFields = fields?.join(',') ?? MYGENE_FIELDS;
    const response = ids.length === 1
      ? await fetch(`https://mygene.info/v3/gene/${encodeURIComponent(ids[0])}?${new URLSearchParams({ fields: selectedFields })}`)
      : await fetch('https://mygene.info/v3/gene', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ ids: ids.join(','), fields: selectedFields }),
      });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const payload = await response.json();
    const annotations: (MyGeneInfoResult & { notfound?: boolean })[] = Array.isArray(payload) ? payload : [payload];
    resolved.forEach(ref => {
      const data = annotations.find(item => item.query === ref.context!.recordId || item._id === ref.context!.recordId);
      if (data && !data.notfound) results.set(getMyGeneCacheKey(ref.query, Number(ref.context!.taxid)), { ...data, query: ref.query });
    });
    (await fetchMyGeneRefs(unresolved, fields)).forEach((value, key) => results.set(key, value));
    return results;
  }
  const refsByTaxid = new Map<number, EntityRef[]>();

  refs.forEach(ref => {
    const taxid = Number(ref.context?.taxid);
    if (!Number.isFinite(taxid)) return;

    if (!refsByTaxid.has(taxid)) {
      refsByTaxid.set(taxid, []);
    }
    refsByTaxid.get(taxid)!.push(ref);
  });

  const results = new Map<string, MyGeneInfoResult>();
  const batches = await Promise.allSettled(
    Array.from(refsByTaxid.entries()).map(async ([taxid, taxidRefs]) => {
      const symbols = taxidRefs.map(ref => ref.query);
      const batchResults = await fetchMyGeneBatch(symbols, String(taxid), true, fields?.join(','));
      batchResults.forEach((data, symbol) => {
        results.set(getMyGeneCacheKey(symbol, taxid), data);
      });
    })
  );

  const failure = batches.find(batch => batch.status === 'rejected');
  if (failure?.status === 'rejected' && results.size === 0) throw failure.reason;
  return results;
}

export function getMyGeneCacheKey(symbol: string, taxid: number): string {
  return `mygene:${symbol}_${taxid}`;
}
