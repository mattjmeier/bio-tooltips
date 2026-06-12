import { describe, it, expect } from 'vitest';
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

    cache.set(mouseKey, mockGeneData); // mouse version
    expect(cache.has(humanKey)).toBe(true); // From previous test
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
});
