import { beforeEach, describe, it, expect } from 'vitest';
import * as cache from '../src/core/cache';
import { getMyGeneCacheKey } from '../src/providers/mygene/client';
import type { MyGeneInfoResult } from '../src/providers/mygene/types';

const mockGeneData: MyGeneInfoResult = {
  _id: '7157',
  query: 'TP53',
  symbol: 'TP53',
  name: 'tumor protein p53',
  summary: 'A summary.',
  taxid: 9606
};

describe('cache', () => {
  beforeEach(() => {
    cache.clear();
  });
  
  it('should initially not have a key', () => {
    expect(cache.has(getMyGeneCacheKey('MYC', 9606))).toBe(false);
  });

  it('should set and get a value', () => {
    const cacheKey = getMyGeneCacheKey('TP53', 9606);
    cache.set(cacheKey, mockGeneData);
    expect(cache.has(cacheKey)).toBe(true);
    const retrieved = cache.get(cacheKey);
    expect(retrieved).toEqual(mockGeneData);
  });
  
  it('should be able to cache a "not found" result as null', () => {
    const cacheKey = getMyGeneCacheKey('NOTAGENE', 9606);
    cache.set(cacheKey, null);
    expect(cache.has(cacheKey)).toBe(true);
    const retrieved = cache.get(cacheKey);
    expect(retrieved).toBeNull();
  });

  it('should handle different species for the same gene symbol', () => {
    const humanKey = getMyGeneCacheKey('TP53', 9606);
    const mouseKey = getMyGeneCacheKey('Trp53', 10090);
    const notFoundKey = getMyGeneCacheKey('NOTAGENE', 9606);

    cache.set(humanKey, mockGeneData);
    cache.set(mouseKey, mockGeneData); // mouse version
    expect(cache.has(humanKey)).toBe(true);
    expect(cache.has(mouseKey)).toBe(true);
    expect(cache.get(humanKey)).not.toEqual(cache.get(notFoundKey));
  });

  it('setBatch should add multiple items to the cache', () => {
    const resultsMap = new Map<string, MyGeneInfoResult>();
    const brca1Key = getMyGeneCacheKey('BRCA1', 9606);
    const brca2Key = getMyGeneCacheKey('BRCA2', 9606);
    resultsMap.set(brca1Key, { ...mockGeneData, symbol: 'BRCA1', taxid: 9606 });
    resultsMap.set(brca2Key, { ...mockGeneData, symbol: 'BRCA2', taxid: 9606 });

    cache.setBatch(resultsMap);

    expect(cache.has(brca1Key)).toBe(true);
    expect(cache.has(brca2Key)).toBe(true);
    expect(cache.get<MyGeneInfoResult>(brca1Key)?.symbol).toBe('BRCA1');
  });

  it('should expose deterministic size and clear controls', () => {
    cache.set(getMyGeneCacheKey('TP53', 9606), mockGeneData);
    expect(cache.size()).toBe(1);

    cache.clear();
    expect(cache.size()).toBe(0);
  });
  it('tracks requested coverage, including fields absent from the response', () => {
    cache.set('partial', { _id: '1' }, ['summary']);
    expect(cache.has('partial', ['summary'])).toBe(true);
    expect(cache.has('partial', ['exons'])).toBe(false);
    expect(cache.get('partial')).toBeUndefined();
    expect(cache.get('partial', ['summary'])).toEqual({ _id: '1' });
  });

  it('merges nested projections without losing sibling annotations', () => {
    cache.set('partial', { ensembl: { gene: 'ENSG1' } }, ['ensembl.gene']);
    cache.set('partial', { ensembl: { transcript: ['ENST1'] } }, ['ensembl.transcript']);
    expect(cache.get('partial', ['ensembl.gene', 'ensembl.transcript'])).toEqual({
      ensembl: { gene: 'ENSG1', transcript: ['ENST1'] },
    });
    expect(cache.has('partial', ['ensembl'])).toBe(false);
    cache.set('parent', { ensembl: {} }, ['ensembl']);
    expect(cache.has('parent', ['ensembl.transcript'])).toBe(true);
  });

  it('keeps coverage synchronized with eviction and does not evict on enrichment', () => {
    for (let i = 0; i < 500; i++) cache.set(String(i), {}, ['summary']);
    cache.set('499', { exons: [] }, ['exons']);
    expect(cache.has('0', ['summary'])).toBe(true);
    cache.set('500', {}, ['summary']);
    expect(cache.has('0', ['summary'])).toBe(false);
    expect(cache.missingFields('0', ['summary'])).toEqual(['summary']);
    expect(cache.size()).toBe(500);
  });

  it('preserves full and negative cache entries for projected reads', () => {
    cache.set('full', { name: 'test' });
    cache.set('full', { summary: 'text' }, ['summary']);
    expect(cache.get('full')).toEqual({ name: 'test', summary: 'text' });
    cache.set('all', { name: 'all' }, ['all']);
    expect(cache.has('all', ['exons'])).toBe(true);
    cache.set('missing', null, ['summary']);
    expect(cache.get('missing', ['exons'])).toBeNull();
  });

});
