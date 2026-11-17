import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  fetchMyChemAnnotationBatch, fetchMyChemBatch, fetchMyChemBestGuessBatch, fetchMyChemRefs,
} from '../src/providers/mychem/client';

const response = (payload: unknown) => ({ ok: true, json: async () => payload }) as Response;
afterEach(() => vi.restoreAllMocks());

describe.each([
  { name: 'symbol query', request: () => fetchMyChemBatch(['aspirin'], 'name'), strict: () => fetchMyChemBatch(['aspirin'], 'name', true) },
  { name: 'ID annotation', request: () => fetchMyChemAnnotationBatch(['2244']), strict: () => fetchMyChemAnnotationBatch(['2244'], true) },
])('MyChem $name failure handling', ({ request, strict }) => {
  it.each(['http', 'network', 'json'] as const)('handles %s errors according to the caller error policy', async kind => {
    const error = new Error(kind === 'http' ? 'HTTP error! status: 503' : kind);
    const fetch = vi.spyOn(globalThis, 'fetch');
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    if (kind === 'http') fetch.mockResolvedValue({ ok: false, status: 503 } as Response);
    else if (kind === 'network') fetch.mockRejectedValue(error);
    else fetch.mockResolvedValue({ ok: true, json: async () => { throw error; } } as unknown as Response);

    await expect(request()).resolves.toEqual(new Map());
    expect(log).toHaveBeenCalledTimes(1);
    await expect(strict()).rejects.toThrow(error.message);
    expect(log).toHaveBeenCalledTimes(1);
  });
});

describe('MyChem response mapping', () => {
  it('skips missing and unmappable query responses without losing successful records', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response([
      { _id: 'aspirin', query: 'aspirin', name: 'Aspirin' },
      { query: 'missing', notfound: true },
      { _id: 'unmapped' },
    ]));
    expect([...await fetchMyChemBatch(['aspirin', 'missing'], 'name', true)]).toEqual([
      ['aspirin', { _id: 'aspirin', query: 'aspirin', name: 'Aspirin' }],
    ]);
  });

  it('maps annotation responses by query or request position without shifting over missing records', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response([
      { _id: 'missing', notfound: true },
      { _id: 'aspirin', name: 'Aspirin' },
      { _id: 'caffeine', query: 'explicit' },
    ]));
    expect([...await fetchMyChemAnnotationBatch(['missing', '2244', 'ignored'], true)]).toEqual([
      ['2244', { _id: 'aspirin', name: 'Aspirin' }],
      ['explicit', { _id: 'caffeine', query: 'explicit' }],
    ]);
  });

  it('combines resolved ID enrichment and unresolved lookups without changing cache identities', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, options) => {
      if (String(url).endsWith('/chem')) return response([
        { _id: 'resolved-id', query: 'resolved-id', drugbank: { toxicity: 'Annotation' } },
        { query: 'gone-id', notfound: true },
      ]);
      expect((options?.body as URLSearchParams).get('scopes')).toBe('drugbank.id');
      return response([{ _id: 'new-id', query: 'DB0001', drugbank: { toxicity: 'Lookup' } }]);
    });
    const results = await fetchMyChemRefs([
      { query: 'aspirin', context: { recordId: 'resolved-id' } },
      { query: 'gone', context: { recordId: 'gone-id' } },
      { query: 'DB0001', context: { scope: 'drugbank', lookup: 'id' } },
    ], ['drugbank.toxicity']);
    expect(fetch).toHaveBeenCalledTimes(2);
    for (const [, options] of fetch.mock.calls) {
      expect((options?.body as URLSearchParams).get('fields')).toBe('drugbank.toxicity');
    }
    expect(results.get('mychem:best-guess:name:aspirin')).toMatchObject({ _id: 'resolved-id', query: 'aspirin' });
    expect(results.get('mychem:id:drugbank.id:DB0001')).toMatchObject({ _id: 'new-id' });
    expect(results.size).toBe(2);
  });
});

describe('MyChem best-guess searches', () => {
  it('escapes constrained queries and falls back to the original query when molecule search has no hits', async () => {
    const query = 'compound "A"\\B';
    const fetch = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response({ hits: null }))
      .mockResolvedValueOnce(response({ hits: [{ _id: 'product', name: query, ndc: { productndc: '123' } }] }));
    const result = await fetchMyChemBestGuessBatch([query], true, 'name,ndc');
    const first = new URL(String(fetch.mock.calls[0][0])).searchParams;
    const fallback = new URL(String(fetch.mock.calls[1][0])).searchParams;
    expect(first.get('q')).toBe('"compound \\"A\\"\\\\B" AND (_exists_:pubchem OR _exists_:chembl OR _exists_:chebi OR _exists_:drugbank OR _exists_:unii OR _exists_:inchikey)');
    expect(fallback.get('q')).toBe(query);
    expect(fallback.get('fields')).toBe('name,ndc');
    expect(result.get(query)?._id).toBe('product');
  });

  it.each([
    {
      name: 'nested exact synonyms over a higher search score', expected: 'exact',
      hits: [
        { _id: 'loose', _score: 20, smiles: 'C', name: 'Aspirin mixture' },
        { _id: 'exact', _score: 0, smiles: 'C', drugbank: [{ synonyms: [{ synonym: '  ASPIRIN  ' }] }] },
      ],
    },
    {
      name: 'molecules without product annotations on otherwise equal scores', expected: 'molecule',
      hits: [
        { _id: 'product', pubchem: { cid: 1 }, name: 'aspirin', ndc: { productndc: '123' } },
        { _id: 'molecule', pubchem: { cid: 1 }, name: 'aspirin' },
      ],
    },
    {
      name: 'valid hits over not-found entries', expected: 'valid',
      hits: [
        { _id: 'missing', _score: 1000, notfound: true, name: 'aspirin' },
        { _id: 'valid', inchikey: 'key', synonyms: [null, {}, 'aspirin'] },
      ],
    },
  ])('ranks $name', async ({ hits, expected }) => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response({ hits }));
    expect((await fetchMyChemBestGuessBatch(['aspirin'], true)).get('aspirin')?._id).toBe(expected);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('starts queries concurrently and retains successful results when a peer fails', async () => {
    let resolveSuccess!: (value: Response) => void;
    const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async url => {
      const query = new URL(String(url)).searchParams.get('q')!;
      if (query.includes('broken')) return { ok: false, status: 503 } as Response;
      return new Promise<Response>(resolve => { resolveSuccess = resolve; });
    });
    const pending = fetchMyChemBestGuessBatch(['broken', 'aspirin'], true);
    expect(fetch).toHaveBeenCalledTimes(2);
    resolveSuccess(response({ hits: [{ _id: 'aspirin', name: 'Aspirin' }] }));
    expect([...await pending]).toEqual([['aspirin', { _id: 'aspirin', name: 'Aspirin' }]]);
  });

  it('propagates total failure in strict mode while allowing tolerant callers to continue', async () => {
    const error = new Error('offline');
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(error);
    await expect(fetchMyChemBestGuessBatch(['aspirin'], true)).rejects.toBe(error);
    await expect(fetchMyChemBestGuessBatch(['aspirin'])).resolves.toEqual(new Map());
  });

  it('returns no match when both searches are empty', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response({ hits: [] }));
    expect(await fetchMyChemBestGuessBatch(['unknown'], true)).toEqual(new Map());
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

describe('MyChem lookup group isolation', () => {
  it('keeps successful identifier groups when another lookup group fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async url => String(url).endsWith('/chem')
      ? response([{ _id: 'aspirin', query: '2244' }])
      : { ok: false, status: 503 } as Response);
    expect([...await fetchMyChemRefs([
      { query: '2244', context: { scope: 'pubchem' } },
      { query: 'DB0001', context: { scope: 'drugbank' } },
    ])]).toEqual([['mychem:id:pubchem.cid:2244', { _id: 'aspirin', query: '2244' }]]);
  });

  it('rejects when all lookup groups fail so errors cannot be cached as not-found', async () => {
    const error = new Error('offline');
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(error);
    await expect(fetchMyChemRefs([{ query: '2244', context: { scope: 'pubchem' } }])).rejects.toBe(error);
  });
});
