import { afterEach, describe, expect, it, vi } from 'vitest';
import * as cache from '../src/core/cache';
import { defaultCoreConfig } from '../src/core/config';
import { runPrefetch } from '../src/core/prefetch';
import { logTooltipTiming, startTooltipTiming } from '../src/core/timing';
import { GeneTooltip } from '../src/mygene';
import type {
  DataProvider,
  TippyInstanceWithCustoms,
} from '../src/core/types';

interface TestRecord {
  query: string;
}

function createElement(query: string): HTMLElement {
  const element = document.createElement('span');
  element.textContent = query;
  return element;
}

function createProvider(): DataProvider<TestRecord> {
  return {
    id: 'benchmark-test',
    parseElement(element) {
      const query = element.textContent?.trim();
      return query ? { query } : null;
    },
    getCacheKey(ref) {
      return `benchmark:${ref.query}`;
    },
    fetchBatch: vi.fn(async refs =>
      new Map(refs.map(ref => [`benchmark:${ref.query}`, { query: ref.query }]))
    ),
  };
}

afterEach(() => {
  cache.clear();
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('structured timing events', () => {
  it('emits events without requiring console timing logs', () => {
    const events: Array<{ label: string; elapsedMs: number; tooltipId?: string }> = [];
    const config = {
      ...defaultCoreConfig,
      debugTimings: false,
      onTiming: event => events.push(event),
    };
    const instance = {
      _uniqueId: 'timing-test',
    } as TippyInstanceWithCustoms;

    startTooltipTiming(instance, config, 'onShow');
    logTooltipTiming(instance, config, 'content set', { source: 'cache' });

    expect(events.map(event => event.label)).toEqual(['onShow', 'content set']);
    expect(events[1].tooltipId).toBe('timing-test');
    expect(events[1].elapsedMs).toBeGreaterThanOrEqual(0);
  });

  it('does not let a timing observer interrupt tooltip behavior', () => {
    const config = {
      ...defaultCoreConfig,
      onTiming: () => {
        throw new Error('observer failure');
      },
    };

    expect(() => logTooltipTiming(undefined, config, 'test')).not.toThrow();
  });
});

describe('awaitable prefetch', () => {
  it('resolves after all unique records have been cached', async () => {
    const provider = createProvider();
    const inFlight = new Map<string, Promise<Map<string, TestRecord>>>();
    const elements = [createElement('TP53'), createElement('BRCA1'), createElement('TP53')];

    await runPrefetch('all', elements, 15, inFlight, provider);

    expect(provider.fetchBatch).toHaveBeenCalledTimes(1);
    expect(provider.fetchBatch).toHaveBeenCalledWith([
      { query: 'TP53' },
      { query: 'BRCA1' },
    ]);
    expect(cache.get<TestRecord>('benchmark:TP53')?.query).toBe('TP53');
    expect(cache.get<TestRecord>('benchmark:BRCA1')?.query).toBe('BRCA1');
    expect(inFlight.size).toBe(0);
  });

  it('resolves without fetching when prefetch is disabled', async () => {
    const provider = createProvider();

    await runPrefetch('none', [createElement('TP53')], 15, new Map(), provider);

    expect(provider.fetchBatch).not.toHaveBeenCalled();
    expect(cache.size()).toBe(0);
  });

  it('is exposed by the public engine and waits for eager provider data', async () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [{
        _id: '7157',
        query: 'TP53',
        symbol: 'TP53',
        name: 'tumor protein p53',
        taxid: 9606,
      }],
    } as Response);
    document.body.innerHTML = '<span class="gene-tooltip" data-species="human">TP53</span>';

    const cleanup = GeneTooltip.init({
      prefetch: 'all',
      visualPreload: 'none',
    });
    await GeneTooltip.whenPrefetchReady();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(GeneTooltip.cacheSize()).toBe(1);

    cleanup();
    GeneTooltip.clearCache();
    expect(GeneTooltip.cacheSize()).toBe(0);
  });
});
