import * as cache from './cache.js';
import type { DataProvider, EntityRef } from './types.js';

export function requestKey(key: string, fields?: readonly string[]): string {
  return fields ? `${key}:fields:${[...fields].sort().join(',')}` : key;
}

export async function fetchRecords<TData>(
  refs: EntityRef[], provider: DataProvider<TData>,
  inFlight: Map<string, Promise<Map<string, TData>>>, fields?: readonly string[]
): Promise<Map<string, TData>> {
  // Always return merged records, including when joining a prefetch request.
  const requests = refs.map(async ref => {
    const key = provider.getCacheKey(ref);
    if (cache.has(key, fields)) return [key, cache.get<TData>(key, fields)] as const;
    const missing = fields ? cache.missingFields(key, fields) : undefined;
    const pendingKey = requestKey(key, missing);
    let pending = inFlight.get(pendingKey);
    if (!pending) {
      const cached = cache.get<{ _id?: string }>(key, []);
      const fetchRef = cached?._id
        ? { ...ref, context: { ...ref.context, recordId: cached._id } } : ref;
      const fetchRefs = [fetchRef];
      pending = (missing ? provider.fetchBatch(fetchRefs, missing) : provider.fetchBatch(fetchRefs))
        .then(results => {
          const data = results.get(key);
          // An annotation disappearing must not erase an existing partial record.
          if (!data && cached) throw new Error('Record annotation is no longer available.');
          const id = (data as { _id?: string } | undefined)?._id;
          if (cached?._id && id && id !== cached._id) throw new Error('Record identity changed during enrichment.');
          cache.set(key, data ?? null, missing);
          return results;
        }).finally(() => { inFlight.delete(pendingKey); });
      inFlight.set(pendingKey, pending);
    }
    await pending;
    return [key, cache.get<TData>(key, fields)] as const;
  });
  const results = await Promise.all(requests);
  return new Map(results.filter((entry): entry is readonly [string, TData] => entry[1] != null));
}
