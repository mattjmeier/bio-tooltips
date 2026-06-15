import type { EntityRef } from '../../core/types.js';
import type { MyGeneInfoResult } from './types.js';

/**
 * Fetches data for multiple genes in a single batch request from mygene.info.
 * @param geneSymbols - An array of gene symbols.
 * @param species - The species for all genes in this batch.
 * @returns A Map of gene symbols to data.
 */
export async function fetchMyGeneBatch(
  geneSymbols: string[],
  species: string
): Promise<Map<string, MyGeneInfoResult>> {
  if (!geneSymbols || geneSymbols.length === 0) {
    return new Map();
  }

  const url = 'https://mygene.info/v3/query';
  const query = geneSymbols.join(',');

  const fields = [
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

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `q=${query}&species=${species}&scopes=symbol&fields=${fields}`,
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
    console.error('Batch fetch failed:', error);
    return new Map();
  }
}

export async function fetchMyGeneRefs(refs: EntityRef[]): Promise<Map<string, MyGeneInfoResult>> {
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
  await Promise.allSettled(
    Array.from(refsByTaxid.entries()).map(async ([taxid, taxidRefs]) => {
      const symbols = taxidRefs.map(ref => ref.query);
      const batchResults = await fetchMyGeneBatch(symbols, String(taxid));
      batchResults.forEach((data, symbol) => {
        results.set(getMyGeneCacheKey(symbol, taxid), data);
      });
    })
  );

  return results;
}

export function getMyGeneCacheKey(symbol: string, taxid: number): string {
  return `mygene:${symbol}_${taxid}`;
}
