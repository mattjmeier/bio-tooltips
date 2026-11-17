import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchMyGeneRefs } from '../src/providers/mygene/client';

function response(payload: unknown): Response {
  return { ok: true, json: async () => payload } as Response;
}

afterEach(() => vi.restoreAllMocks());

describe('MyGene projected annotation requests', () => {
  it('maps out-of-order ID annotations back to symbols and species, omitting missing records', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response([
      { _id: '22059', summary: 'Mouse p53' },
      { query: 'missing', notfound: true },
      { query: '7157', _id: '7157', summary: 'Human p53' },
      { _id: 'unrelated', summary: 'Unrequested annotation' },
    ]));

    const results = await fetchMyGeneRefs([
      { query: 'TP53', context: { taxid: 9606, recordId: '7157' } },
      { query: 'Trp53', context: { taxid: 10090, recordId: '22059' } },
      { query: 'MISSING', context: { taxid: 9606, recordId: 'missing' } },
      { query: 'ABSENT', context: { taxid: 9606, recordId: 'absent' } },
    ], ['summary']);

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe('https://mygene.info/v3/gene');
    expect(options?.method).toBe('POST');
    expect(Object.fromEntries(options?.body as URLSearchParams)).toEqual({
      ids: '7157,22059,missing,absent', fields: 'summary',
    });
    expect([...results]).toEqual([
      ['mygene:TP53_9606', { query: 'TP53', _id: '7157', summary: 'Human p53' }],
      ['mygene:Trp53_10090', { query: 'Trp53', _id: '22059', summary: 'Mouse p53' }],
    ]);
  });

  it('combines resolved ID enrichment with unresolved symbol lookups using the same projection', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response({ _id: '7157', summary: 'Human p53' }))
      .mockResolvedValueOnce(response([{ _id: '12189', query: 'Brca1', summary: 'Mouse BRCA1' }]));

    const results = await fetchMyGeneRefs([
      { query: 'TP53', context: { taxid: 9606, recordId: '7157' } },
      { query: 'Brca1', context: { taxid: 10090 } },
    ], ['summary', 'generif']);

    const annotation = new URL(String(fetch.mock.calls[0][0]));
    expect(annotation.pathname).toBe('/v3/gene/7157');
    expect(annotation.searchParams.get('fields')).toBe('summary,generif');
    expect(fetch.mock.calls[1][0]).toBe('https://mygene.info/v3/query');
    expect(Object.fromEntries(fetch.mock.calls[1][1]?.body as URLSearchParams)).toEqual({
      q: 'Brca1', species: '10090', scopes: 'symbol', fields: 'summary,generif',
    });
    expect([...results.keys()]).toEqual(['mygene:TP53_9606', 'mygene:Brca1_10090']);
  });

  it('encodes resolved IDs and retains the full field selection when no projection is supplied', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response({ _id: 'id/with space', symbol: 'TP53' }));
    const results = await fetchMyGeneRefs([
      { query: 'TP53', context: { taxid: 9606, recordId: 'id/with space' } },
    ]);
    const url = new URL(String(fetch.mock.calls[0][0]));
    expect(url.pathname).toBe('/v3/gene/id%2Fwith%20space');
    expect(url.searchParams.get('fields')?.split(',')).toEqual(expect.arrayContaining(['symbol', 'summary', 'generif']));
    expect(results.get('mygene:TP53_9606')).toMatchObject({ _id: 'id/with space', query: 'TP53' });
  });

  it.each(['http', 'network', 'json'] as const)('propagates %s annotation failures so enrichment can be retried', async kind => {
    const error = new Error(kind === 'http' ? 'HTTP error! status: 503' : kind);
    const fetch = vi.spyOn(globalThis, 'fetch');
    if (kind === 'http') fetch.mockResolvedValueOnce({ ok: false, status: 503 } as Response);
    else if (kind === 'network') fetch.mockRejectedValueOnce(error);
    else fetch.mockResolvedValueOnce({ ok: true, json: async () => { throw error; } } as unknown as Response);
    const refs = [{ query: 'TP53', context: { taxid: 9606, recordId: '7157' } }];

    await expect(fetchMyGeneRefs(refs, ['summary'])).rejects.toThrow(error.message);
    fetch.mockResolvedValueOnce(response({ _id: '7157', summary: 'Recovered' }));
    expect((await fetchMyGeneRefs(refs, ['summary'])).get('mygene:TP53_9606')?.summary).toBe('Recovered');
  });
});

describe('MyGene species batch isolation', () => {
  it('starts species batches concurrently and waits for a successful batch after another fails', async () => {
    let resolveMouse!: (value: Response) => void;
    const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async (_url, options) => {
      const species = (options?.body as URLSearchParams).get('species');
      if (species === '9606') throw new Error('human batch offline');
      return new Promise<Response>(resolve => { resolveMouse = resolve; });
    });
    let settled = false;
    const pending = fetchMyGeneRefs([
      { query: 'TP53', context: { taxid: 9606 } },
      { query: 'Trp53', context: { taxid: 10090 } },
      { query: 'Brca1', context: { taxid: 10090 } },
    ], ['summary']).then(result => { settled = true; return result; });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect((fetch.mock.calls[1][1]?.body as URLSearchParams).get('q')).toBe('Trp53,Brca1');
    await Promise.resolve();
    expect(settled).toBe(false);
    resolveMouse(response([{ query: 'Trp53', _id: '22059', summary: 'Available' }, { query: 'Brca1', notfound: true }]));
    expect([...await pending]).toEqual([
      ['mygene:Trp53_10090', { query: 'Trp53', _id: '22059', summary: 'Available' }],
    ]);
  });

  it('rejects rather than reporting not-found when all usable batches fail or return no matches', async () => {
    const error = new Error('offline');
    vi.spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(response([{ query: 'Trp53', notfound: true }]));
    await expect(fetchMyGeneRefs([
      { query: 'TP53', context: { taxid: 9606 } },
      { query: 'Trp53', context: { taxid: 10090 } },
    ], ['summary'])).rejects.toBe(error);
  });

  it('skips refs without a finite species and makes no requests for an empty batch', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unexpected request'));
    expect(await fetchMyGeneRefs([])).toEqual(new Map());
    expect(await fetchMyGeneRefs([
      { query: 'TP53' },
      { query: 'TP53', context: { taxid: 'human' } },
      { query: 'TP53', context: { taxid: Infinity } },
    ], ['summary'])).toEqual(new Map());
    expect(fetch).not.toHaveBeenCalled();
  });
});
