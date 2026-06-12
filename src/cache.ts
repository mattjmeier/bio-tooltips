import type { MyGeneInfoResult } from './config.js';
import * as coreCache from './core/cache.js';
import { getMyGeneCacheKey } from './providers/mygene/client.js';

export const getCacheKey = (symbol: string, taxid: number): string => getMyGeneCacheKey(symbol, taxid);

export const has = (symbol: string, taxid: number): boolean => coreCache.has(getCacheKey(symbol, taxid));

export const get = (symbol: string, taxid: number): MyGeneInfoResult | null | undefined => {
  return coreCache.get<MyGeneInfoResult>(getCacheKey(symbol, taxid));
};

export const set = (symbol: string, taxid: number, data: MyGeneInfoResult | null): void => {
  coreCache.set(getCacheKey(symbol, taxid), data);
};

export const setBatch = (resultsMap: Map<string, MyGeneInfoResult>): void => {
  resultsMap.forEach((data, symbol) => {
    if (data.taxid) {
      set(symbol, data.taxid, data);
    }
  });
};
