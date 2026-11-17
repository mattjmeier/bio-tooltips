import * as cache from './cache.js';
import { requestKey } from './requests.js';
import type { DataProvider, EntityRef } from './types.js';

function getUncachedRefs<TData>(
  elements: HTMLElement[],
  provider: DataProvider<TData>,
  inFlightRequests: Map<string, Promise<Map<string, TData>>>,
  fields?: readonly string[]
): EntityRef[] {
  const refs: EntityRef[] = [];
  const seenKeys = new Set<string>();

  elements.forEach(el => {
    const ref = provider.parseElement(el);
    if (!ref) return;

    const cacheKey = provider.getCacheKey(ref);
    if (cache.has(cacheKey, fields) || inFlightRequests.has(requestKey(cacheKey, fields)) || seenKeys.has(cacheKey)) {
      return;
    }

    seenKeys.add(cacheKey);
    refs.push(ref);
  });

  return refs;
}

async function fetchAndCache<TData>(
  refs: EntityRef[],
  provider: DataProvider<TData>,
  inFlightRequests: Map<string, Promise<Map<string, TData>>>,
  fields?: readonly string[]
): Promise<void> {
  if (refs.length === 0) return;

  const fetchRefs = fields ? refs.map(ref => {
    const data = cache.get<{ _id?: string }>(provider.getCacheKey(ref), []);
    return data?._id ? { ...ref, context: { ...ref.context, recordId: data._id } } : ref;
  }) : refs;
  const fetchPromise = (fields ? provider.fetchBatch(fetchRefs, fields) : provider.fetchBatch(fetchRefs))
    .then(resultsMap => {
      resultsMap.forEach((data, cacheKey) => {
        cache.set(cacheKey, data, fields);
      });
      return resultsMap;
    })
    .finally(() => {
      refs.forEach(ref => {
        inFlightRequests.delete(requestKey(provider.getCacheKey(ref), fields));
      });
    });

  refs.forEach(ref => {
    inFlightRequests.set(requestKey(provider.getCacheKey(ref), fields), fetchPromise);
  });

  await Promise.allSettled([fetchPromise]);
}

function prefetchAll<TData>(
  elements: HTMLElement[],
  provider: DataProvider<TData>,
  inFlightRequests: Map<string, Promise<Map<string, TData>>>,
  fields?: readonly string[]
): Promise<void> {
  const refs = getUncachedRefs(elements, provider, inFlightRequests, fields);
  return fetchAndCache(refs, provider, inFlightRequests, fields);
}

function prefetchSmart<TData>(
  elements: HTMLElement[],
  provider: DataProvider<TData>,
  inFlightRequests: Map<string, Promise<Map<string, TData>>>,
  fields?: readonly string[]
): Promise<void> {
  const fetchQueue = new Set<Element>();
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const processQueue = () => {
    if (fetchQueue.size === 0) return;

    const refs = getUncachedRefs(Array.from(fetchQueue) as HTMLElement[], provider, inFlightRequests, fields);
    fetchAndCache(refs, provider, inFlightRequests, fields);
    fetchQueue.clear();
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fetchQueue.add(entry.target);
        obs.unobserve(entry.target);
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(processQueue, 200);
      }
    });
  }, { rootMargin: '200px' });

  elements.forEach(el => observer.observe(el));
  return Promise.resolve();
}

export function runPrefetch<TData>(
  strategy: 'smart' | 'all' | 'none',
  elements: HTMLElement[],
  threshold: number,
  inFlightRequests: Map<string, Promise<Map<string, TData>>>,
  provider: DataProvider<TData>,
  fields?: readonly string[]
): Promise<void> {
  const elementCount = elements.length;
  if (strategy === 'none') return Promise.resolve();

  const shouldPrefetchAll = strategy === 'all' || (strategy === 'smart' && elementCount <= threshold);

  if (shouldPrefetchAll) {
    return prefetchAll(elements, provider, inFlightRequests, fields);
  } else if (strategy === 'smart' && elementCount > threshold) {
    return prefetchSmart(elements, provider, inFlightRequests, fields);
  }

  return Promise.resolve();
}
