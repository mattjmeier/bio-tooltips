import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as cache from '../src/core/cache';
import { runPrefetch } from '../src/core/prefetch';
import { requestKey } from '../src/core/requests';
import type { DataProvider, EntityRef } from '../src/core/types';

interface RecordData { _id?: string; name?: string; summary?: string; generif?: unknown[] }
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function element(query: string) {
  const el = document.createElement('span');
  el.dataset.query = query;
  return el;
}
function setup() {
  const provider: DataProvider<RecordData> = {
    id: 'prefetch-test',
    parseElement: el => el.dataset.query ? { query: el.dataset.query, context: { taxid: 9606 } } : null,
    getCacheKey: ref => `test:${ref.query}`,
    fetchBatch: vi.fn(async () => new Map<string, RecordData>()),
  };
  const inFlight = new Map<string, Promise<Map<string, RecordData>>>();
  return { provider, fetch: vi.mocked(provider.fetchBatch), inFlight };
}

beforeEach(() => cache.clear());
afterEach(() => {
  cache.clear();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('projected prefetch state', () => {
  it('enriches cached IDs without mutating parsed refs and skips cached, invalid, and duplicate elements', async () => {
    const { provider, fetch, inFlight } = setup();
    const ref: EntityRef = { query: 'TP53', context: { taxid: 9606 } };
    const parse = provider.parseElement;
    provider.parseElement = el => el.dataset.query === 'TP53' ? ref : parse(el);
    cache.set('test:TP53', { _id: '7157', name: 'p53' }, ['name']);
    cache.set('test:BRCA1', { summary: 'Already loaded' }, ['summary']);
    fetch.mockResolvedValue(new Map([
      ['test:TP53', { _id: '7157', summary: 'New annotation' }],
      ['test:NEW', { summary: 'New record' }],
    ]));

    await runPrefetch('all', [element(''), element('TP53'), element('TP53'), element('BRCA1'), element('NEW')], 0, inFlight, provider, ['summary']);

    expect(fetch).toHaveBeenCalledExactlyOnceWith([
      { query: 'TP53', context: { taxid: 9606, recordId: '7157' } },
      { query: 'NEW', context: { taxid: 9606 } },
    ], ['summary']);
    expect(ref).toEqual({ query: 'TP53', context: { taxid: 9606 } });
    expect(cache.get('test:TP53', ['name', 'summary'])).toEqual({ _id: '7157', name: 'p53', summary: 'New annotation' });
    expect(cache.has('test:TP53')).toBe(false);
    expect(inFlight.size).toBe(0);
  });

  it('deduplicates reordered field sets while allowing concurrent disjoint enrichments', async () => {
    const { provider, fetch, inFlight } = setup();
    const summary = deferred<Map<string, RecordData>>();
    const generif = deferred<Map<string, RecordData>>();
    fetch.mockReturnValueOnce(summary.promise).mockReturnValueOnce(generif.promise);
    const el = element('TP53');
    const first = runPrefetch('all', [el], 0, inFlight, provider, ['summary', 'name']);
    await runPrefetch('all', [el], 0, inFlight, provider, ['name', 'summary']);
    const second = runPrefetch('all', [el], 0, inFlight, provider, ['generif']);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(inFlight.size).toBe(2);

    generif.resolve(new Map([['test:TP53', { generif: [] }]]));
    await second;
    expect(inFlight.has(requestKey('test:TP53', ['summary', 'name']))).toBe(true);
    expect(inFlight.has(requestKey('test:TP53', ['generif']))).toBe(false);
    summary.resolve(new Map([['test:TP53', { name: 'p53', summary: 'Summary' }]]));
    await first;
    expect(cache.get('test:TP53', ['summary', 'name', 'generif'])).toEqual({ name: 'p53', summary: 'Summary', generif: [] });
    expect(inFlight.size).toBe(0);
  });

  it('settles failed batches, preserves partial data, clears every pending key, and permits retry', async () => {
    const { provider, fetch, inFlight } = setup();
    cache.set('test:TP53', { _id: '7157', name: 'p53' }, ['name']);
    const failed = deferred<Map<string, RecordData>>();
    fetch.mockReturnValueOnce(failed.promise);
    const elements = [element('TP53'), element('BRCA1')];
    const pending = runPrefetch('all', elements, 0, inFlight, provider, ['summary']);
    expect(inFlight.size).toBe(2);
    failed.reject(new Error('offline'));
    await expect(pending).resolves.toBeUndefined();
    expect(inFlight.size).toBe(0);
    expect(cache.get('test:TP53', ['name'])).toEqual({ _id: '7157', name: 'p53' });
    expect(cache.has('test:TP53', ['summary'])).toBe(false);
    expect(cache.has('test:BRCA1', ['summary'])).toBe(false);

    fetch.mockResolvedValueOnce(new Map([['test:TP53', { summary: 'Recovered' }]]));
    await runPrefetch('all', elements, 0, inFlight, provider, ['summary']);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(cache.get('test:TP53', ['name', 'summary'])).toMatchObject({ name: 'p53', summary: 'Recovered' });
    // An omitted record is not negatively cached by speculative prefetching.
    expect(cache.has('test:BRCA1', ['summary'])).toBe(false);
  });

  it('uses eager fetching at the smart threshold and skips subsequent fully cached batches', async () => {
    const { provider, fetch, inFlight } = setup();
    const observer = vi.fn();
    vi.stubGlobal('IntersectionObserver', observer);
    fetch.mockResolvedValueOnce(new Map([['test:TP53', { name: 'p53' }]]));
    await runPrefetch('smart', [element('TP53')], 1, inFlight, provider);
    await runPrefetch('all', [element('TP53')], 0, inFlight, provider, ['summary']);
    expect(observer).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledExactlyOnceWith([{ query: 'TP53', context: { taxid: 9606 } }]);
    expect(cache.get('test:TP53')).toEqual({ name: 'p53' });
  });
});

describe('viewport prefetch scheduling', () => {
  it('debounces visible entries, waits for intersection, and shares projected in-flight work across flushes', async () => {
    vi.useFakeTimers();
    const { provider, fetch, inFlight } = setup();
    let callback!: IntersectionObserverCallback;
    const observer = { observe: vi.fn(), unobserve: vi.fn() };
    const Observer = vi.fn(function (cb: IntersectionObserverCallback) { callback = cb; return observer; });
    vi.stubGlobal('IntersectionObserver', Observer);
    const visible = (target: HTMLElement, isIntersecting = true) => {
      callback([{ target, isIntersecting } as IntersectionObserverEntry], observer as unknown as IntersectionObserver);
    };
    const tp53 = element('TP53');
    const brca1 = element('BRCA1');
    const batch = deferred<Map<string, RecordData>>();
    fetch.mockReturnValueOnce(batch.promise);

    await runPrefetch('smart', [tp53, brca1], 1, inFlight, provider, ['summary']);
    expect(Observer).toHaveBeenCalledWith(expect.any(Function), { rootMargin: '200px' });
    expect(observer.observe.mock.calls).toEqual([[tp53], [brca1]]);
    visible(tp53, false);
    await vi.advanceTimersByTimeAsync(250);
    expect(observer.unobserve).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();

    visible(tp53);
    await vi.advanceTimersByTimeAsync(150);
    visible(brca1);
    await vi.advanceTimersByTimeAsync(199);
    expect(fetch).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(fetch).toHaveBeenCalledExactlyOnceWith([
      { query: 'TP53', context: { taxid: 9606 } },
      { query: 'BRCA1', context: { taxid: 9606 } },
    ], ['summary']);
    expect(observer.unobserve.mock.calls).toEqual([[tp53], [brca1]]);
    expect(inFlight.size).toBe(2);

    visible(tp53);
    await vi.advanceTimersByTimeAsync(200);
    expect(fetch).toHaveBeenCalledTimes(1);
    batch.resolve(new Map([['test:TP53', { summary: 'Loaded' }]]));
    await vi.runAllTimersAsync();
    expect(inFlight.size).toBe(0);
    expect(cache.has('test:TP53', ['summary'])).toBe(true);
    expect(cache.has('test:TP53')).toBe(false);
    expect(cache.has('test:BRCA1', ['summary'])).toBe(false);
  });
});
