interface CacheEntry {
  data: unknown | null;
  fields?: Set<string>;
}
const cache = new Map<string, CacheEntry>();
const MAX_CACHE_SIZE = 500;

export function missingFields(cacheKey: string, fields: readonly string[]): string[] {
  const entry = cache.get(cacheKey);
  if (!entry) return [...fields];
  if (entry.data === null || !entry.fields) return [];
  return fields.filter(field => ![...entry.fields!].some(loaded =>
    loaded === 'all' || loaded === field || field.startsWith(`${loaded}.`)));
}

export function has(cacheKey: string, fields?: readonly string[]): boolean {
  const entry = cache.get(cacheKey);
  return Boolean(entry && (fields ? missingFields(cacheKey, fields).length === 0 : !entry.fields));
}

export function get<TData>(cacheKey: string, fields?: readonly string[]): TData | null | undefined {
  if (!has(cacheKey, fields)) return undefined;
  return cache.get(cacheKey)!.data as TData | null;
}

// Nested objects are enriched; arrays are atomic annotation values.
function merge(previous: unknown, next: unknown): unknown {
  if (!previous || !next || typeof previous !== 'object' || typeof next !== 'object'
      || Array.isArray(previous) || Array.isArray(next)) return next;
  const result: Record<string, unknown> = { ...previous };
  for (const [key, value] of Object.entries(next)) {
    if (value !== undefined) result[key] = merge(result[key], value);
  }
  return result;
}

export function set<TData>(cacheKey: string, data: TData | null, fields?: readonly string[]): void {
  const previous = cache.get(cacheKey);
  if (!previous && cache.size >= MAX_CACHE_SIZE) cache.delete(cache.keys().next().value!);
  cache.set(cacheKey, {
    data: fields && previous?.data ? merge(previous.data, data) : data,
    fields: data !== null && fields && !fields.includes('all') && (!previous || previous.fields)
      ? new Set([...(previous?.fields ?? []), ...fields]) : undefined,
  });
}

export function setBatch<TData>(resultsMap: Map<string, TData>): void {
  resultsMap.forEach((data, cacheKey) => set(cacheKey, data));
}
export function clear(): void { cache.clear(); }
export function size(): number { return cache.size; }
