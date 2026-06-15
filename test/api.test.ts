import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchMyGeneBatch } from '../src/providers/mygene/client';
import type { MyGeneInfoResult } from '../src/providers/mygene/types';

// Define a type for the not-found result to keep things clean
type MyGeneNotFoundResult = {
  query: string;
  notfound: true;
};

// This is our "database" of all possible mock results
const allMockResults: (MyGeneInfoResult | MyGeneNotFoundResult)[] = [
  {
    _id: '7157',
    query: 'TP53',
    symbol: 'TP53',
    name: 'tumor protein p53',
    summary: 'This gene encodes a tumor suppressor protein...',
    taxid: 9606,
    genomic_pos: { chr: '17', start: 7661779, end: 7687538, strand: -1 } // Added for completeness
  },
  {
    _id: '1234',
    query: 'BRCA1',
    symbol: 'BRCA1',
    name: 'BRCA1 DNA repair associated',
    summary: 'This gene is implicated in breast cancer...',
    taxid: 9606,
    genomic_pos: { chr: '17', start: 43044295, end: 43125483, strand: 1 } // Added for completeness
  },
  {
    query: 'NOTAGENE',
    notfound: true,
  },
];

describe('fetchMyGeneBatch', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.spyOn(global, 'fetch').mockImplementation(async (_url, options) => {
      const body = options?.body?.toString() || '';
      const requestedGenes = new URLSearchParams(body).get('q')?.split(',') || [];
      const filteredResponse = allMockResults.filter(item =>
        requestedGenes.includes(item.query)
      );

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(filteredResponse),
      } as Response);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch data for multiple genes and return a Map', async () => {
    const geneSymbols = ['TP53', 'BRCA1']; // Removed NOTAGENE for this specific test
    const species = 'human';
    const results = await fetchMyGeneBatch(geneSymbols, species);

    expect(results.size).toBe(2);
    expect(results.has('TP53')).toBe(true);
    expect(results.get('TP53')?.symbol).toBe('TP53');
    expect(results.get('BRCA1')?.name).toContain('BRCA1');
  });

  it('should correctly filter out genes that were not found', async () => {
    const geneSymbols = ['TP53', 'NOTAGENE'];
    const species = 'human';
    const results = await fetchMyGeneBatch(geneSymbols, species);

    expect(results.size).toBe(1);
    expect(results.has('NOTAGENE')).toBe(false);
    expect(results.has('TP53')).toBe(true);
  });

  it('should return an empty map if the fetch request fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const results = await fetchMyGeneBatch(['TP53'], 'human');
    expect(results.size).toBe(0);
  });

  it('should return an empty map if the fetch promise is rejected', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network failure'));

    const results = await fetchMyGeneBatch(['TP53'], 'human');
    expect(results.size).toBe(0);
  });

  it('should return an empty map if given an empty array of genes', async () => {
    const results = await fetchMyGeneBatch([], 'human');
    expect(global.fetch).not.toHaveBeenCalled();
    expect(results.size).toBe(0);
  });
});
