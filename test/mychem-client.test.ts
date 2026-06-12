import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchMyChemRefs, getMyChemCacheKey } from '../src/providers/mychem/client';
import type { MyChemInfoResult } from '../src/providers/mychem/types';

const aspirinMolecule: MyChemInfoResult = {
  _id: 'BSYNRYMUTXBXSQ-UHFFFAOYSA-N',
  query: 'aspirin',
  _score: 15,
  name: 'Aspirin',
  inchikey: 'BSYNRYMUTXBXSQ-UHFFFAOYSA-N',
  pubchem: { cid: 2244 },
};

const aspirinProduct: MyChemInfoResult = {
  _id: '50090-7624',
  query: 'aspirin',
  _score: 30,
  ndc: {
    productndc: '50090-7624',
    proprietaryname: 'Aspirin',
  },
};

describe('MyChem client lookup modes', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('routes supported identifier lookups through the annotation endpoint', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ ...aspirinMolecule, query: '2244' }]),
    } as Response);

    const results = await fetchMyChemRefs([
      {
        query: '2244',
        context: { lookup: 'id', scope: 'pubchem.cid' },
      },
    ]);

    const fetchCall = vi.mocked(global.fetch).mock.calls[0];
    expect(String(fetchCall[0])).toBe('https://mychem.info/v1/chem');
    expect(fetchCall[1]?.method).toBe('POST');
    expect(results.get('mychem:id:pubchem.cid:2244')?._id).toBe('BSYNRYMUTXBXSQ-UHFFFAOYSA-N');
  });

  it('chooses molecule-backed records over product-only records for best-guess searches', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        hits: [aspirinProduct, aspirinMolecule],
      }),
    } as Response);

    const results = await fetchMyChemRefs([
      {
        query: 'aspirin',
        context: { lookup: 'best-guess', scope: 'name' },
      },
    ]);

    const fetchCall = vi.mocked(global.fetch).mock.calls[0];
    expect(String(fetchCall[0])).toContain('/v1/query?');
    expect(decodeURIComponent(String(fetchCall[0]))).toContain('_exists_:pubchem');
    expect(results.get('mychem:best-guess:name:aspirin')?._id).toBe('BSYNRYMUTXBXSQ-UHFFFAOYSA-N');
  });

  it('includes lookup mode in cache keys', () => {
    expect(getMyChemCacheKey('aspirin')).toBe('mychem:best-guess:name:aspirin');
    expect(getMyChemCacheKey('2244', 'pubchem.cid')).toBe('mychem:id:pubchem.cid:2244');
  });
});
