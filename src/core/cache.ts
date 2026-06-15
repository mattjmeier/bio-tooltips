const cache = new Map<string, unknown | null>();

const MAX_CACHE_SIZE = 500;

export function has(cacheKey: string): boolean {
  return cache.has(cacheKey);
}

export function get<TData>(cacheKey: string): TData | null | undefined {
  return cache.get(cacheKey) as TData | null | undefined;
}

export function set<TData>(cacheKey: string, data: TData | null): void {
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) {
      cache.delete(oldestKey);
    }
  }

  cache.set(cacheKey, data);
}

export function setBatch<TData>(resultsMap: Map<string, TData>): void {
  resultsMap.forEach((data, cacheKey) => {
    set(cacheKey, data);
  });
}
