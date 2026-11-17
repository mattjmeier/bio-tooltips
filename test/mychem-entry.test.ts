import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/core/positioning', () => ({
  getDefaultFallbackPlacements: () => ['left', 'bottom', 'top'],
  startPositioning: () => ({ update: async () => {}, destroy: () => {} }),
}));

const cleanups: Array<() => void> = [];
const response = (payload: unknown) => ({ ok: true, json: async () => payload }) as Response;
const options = {
  selector: '.test-chemical', prefetch: 'all', visualPreload: 'none',
  tooltipOptions: { showDuration: 0, hideDuration: 0 },
} as const;

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  document.body.replaceChildren();
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { callback(0); return 1; });
});
afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup());
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe('ChemicalTooltip public entry', () => {
  it('awaits selector-based prefetch, reuses cached records on open, and exposes cache controls', async () => {
    const entry = await import('../src/mychem');
    let resolve!: (value: Response) => void;
    const fetch = vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise<Response>(done => { resolve = done; }));
    document.body.innerHTML = `
      <button class="test-chemical" data-query="2244" data-scope="pubchem">Aspirin</button>
      <button class="test-chemical" data-query="2519" data-scope="pubchem">Caffeine</button>
      <button class="chemical-tooltip" data-query="ignored">Ignored</button>`;
    const anchors = [...document.querySelectorAll<HTMLElement>('.test-chemical')];
    const cleanup = entry.ChemicalTooltip.init(options);
    cleanups.push(cleanup);
    let ready = false;
    const pending = entry.whenPrefetchReady().then(() => { ready = true; });
    await Promise.resolve();
    expect(ready).toBe(false);
    expect(entry.cacheSize()).toBe(0);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect((fetch.mock.calls[0][1]?.body as URLSearchParams).get('ids')).toBe('2244,2519');
    expect(document.querySelector('.chemical-tooltip')?.hasAttribute('data-gt-tooltip-reference')).toBe(false);

    resolve(response([
      { _id: 'aspirin', query: '2244', name: 'Aspirin' },
      { _id: 'caffeine', query: '2519', name: 'Caffeine' },
    ]));
    await pending;
    expect(entry.ChemicalTooltip.cacheSize()).toBe(2);
    anchors[0].click();
    await vi.advanceTimersByTimeAsync(0);
    expect(document.querySelector('.gt-tooltip-content')?.textContent).toContain('Aspirin');
    expect(fetch).toHaveBeenCalledTimes(1);
    cleanup();
    expect(document.querySelector('[data-gt-tooltip-root]')).toBeNull();
    expect(anchors.every(anchor => !anchor.hasAttribute('data-gt-tooltip-reference'))).toBe(true);
    // Destroying UI retains records until the caller explicitly clears the cache.
    expect(entry.cacheSize()).toBe(2);
    entry.ChemicalTooltip.clearCache();
    expect(entry.cacheSize()).toBe(0);
  });

  it('settles failed prefetch without caching not-found, then retries on a later initialization', async () => {
    const entry = await import('../src/mychem');
    const fetch = vi.spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(response([{ _id: 'aspirin', query: '2244', name: 'Aspirin' }]));
    document.body.innerHTML = '<span class="test-chemical" data-query="2244" data-scope="pubchem">Aspirin</span>';
    const first = entry.init(options);
    cleanups.push(first);
    await expect(entry.ChemicalTooltip.whenPrefetchReady()).resolves.toBeUndefined();
    expect(entry.cacheSize()).toBe(0);
    first();
    cleanups.push(entry.init(options));
    await entry.whenPrefetchReady();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(entry.cacheSize()).toBe(1);
    entry.clearCache();
    expect(entry.ChemicalTooltip.cacheSize()).toBe(0);
  });

  it('allows preloading without a visual dependency and initialization with no matching elements', async () => {
    const entry = await import('../src/mychem');
    const fetch = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unexpected fetch'));
    await expect(entry.ChemicalTooltip.preload()).resolves.toEqual([]);
    cleanups.push(entry.init(options));
    await expect(entry.whenPrefetchReady()).resolves.toBeUndefined();
    expect(fetch).not.toHaveBeenCalled();
    expect(document.querySelector('[data-gt-tooltip-root]')).toBeNull();
  });

  it.each([false, true])('installs the browser API while preserving an existing namespace: %s', async existing => {
    const extension = vi.fn();
    const namespace = existing ? { extension } : undefined;
    vi.stubGlobal('ChemicalTooltip', namespace);
    const entry = await import('../src/mychem');
    const globalApi = window.ChemicalTooltip;
    expect(entry.default).toBe(entry.ChemicalTooltip);
    if (existing) {
      expect(globalApi).toBe(namespace);
      expect((globalApi as unknown as { extension: () => void }).extension).toBe(extension);
    }
    for (const key of ['init', 'attach', 'preload', 'whenPrefetchReady', 'clearCache', 'cacheSize'] as const) {
      expect(globalApi[key]).toBe(entry[key]);
    }
  });

  it('can be imported without window and used for non-DOM operations', async () => {
    vi.stubGlobal('window', undefined);
    const entry = await import('../src/mychem');
    expect(entry.default).toBe(entry.ChemicalTooltip);
    entry.clearCache();
    expect(entry.cacheSize()).toBe(0);
    await expect(entry.preload()).resolves.toEqual([]);
    await expect(entry.whenPrefetchReady()).resolves.toBeUndefined();
  });
});
