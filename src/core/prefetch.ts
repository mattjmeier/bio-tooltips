import * as cache from './cache.js';
import type { DataProvider, EntityRef } from './types.js';

function getUncachedRefs<TData>(
  elements: HTMLElement[],
  provider: DataProvider<TData>,
  inFlightRequests: Map<string, Promise<Map<string, TData>>>
): EntityRef[] {
  const refs: EntityRef[] = [];
  const seenKeys = new Set<string>();

  elements.forEach(el => {
    const ref = provider.parseElement(el);
    if (!ref) return;

    const cacheKey = provider.getCacheKey(ref);
    if (cache.has(cacheKey) || inFlightRequests.has(cacheKey) || seenKeys.has(cacheKey)) {
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
  inFlightRequests: Map<string, Promise<Map<string, TData>>>
): Promise<void> {
  if (refs.length === 0) return;

  const fetchPromise = provider.fetchBatch(refs)
    .then(resultsMap => {
      resultsMap.forEach((data, cacheKey) => {
        cache.set(cacheKey, data);
      });
      return resultsMap;
    })
    .finally(() => {
      refs.forEach(ref => {
        inFlightRequests.delete(provider.getCacheKey(ref));
      });
    });

  refs.forEach(ref => {
    inFlightRequests.set(provider.getCacheKey(ref), fetchPromise);
  });

  await Promise.allSettled([fetchPromise]);
}

function prefetchAll<TData>(
  elements: HTMLElement[],
  provider: DataProvider<TData>,
  inFlightRequests: Map<string, Promise<Map<string, TData>>>
): void {
  const refs = getUncachedRefs(elements, provider, inFlightRequests);
  fetchAndCache(refs, provider, inFlightRequests);
}

function prefetchSmart<TData>(
  elements: HTMLElement[],
  provider: DataProvider<TData>,
  inFlightRequests: Map<string, Promise<Map<string, TData>>>
): void {
  const fetchQueue = new Set<Element>();
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const processQueue = () => {
    if (fetchQueue.size === 0) return;

    const refs = getUncachedRefs(Array.from(fetchQueue) as HTMLElement[], provider, inFlightRequests);
    fetchAndCache(refs, provider, inFlightRequests);
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
}

export function runPrefetch<TData>(
  strategy: 'smart' | 'all' | 'none',
  elements: HTMLElement[],
  threshold: number,
  inFlightRequests: Map<string, Promise<Map<string, TData>>>,
  provider: DataProvider<TData>
): void {
  const elementCount = elements.length;
  if (strategy === 'none') return;

  const shouldPrefetchAll = strategy === 'all' || (strategy === 'smart' && elementCount <= threshold);

  if (shouldPrefetchAll) {
    prefetchAll(elements, provider, inFlightRequests);
  } else if (strategy === 'smart' && elementCount > threshold) {
    prefetchSmart(elements, provider, inFlightRequests);
  }
}
