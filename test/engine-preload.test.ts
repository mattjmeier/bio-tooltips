import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTooltipEngine } from '../src/core/engine';
import { defaultCoreConfig } from '../src/core/config';
import type { CoreTooltipConfig, TooltipProfile } from '../src/core/types';
import * as cache from '../src/core/cache';

vi.mock('../src/core/positioning', () => ({
  getDefaultFallbackPlacements: () => ['left', 'bottom', 'top'],
  startPositioning: () => ({ update: async () => {}, destroy: () => {} }),
}));

const cleanups: Array<() => void> = [];
function setup(preload?: () => Promise<unknown>) {
  const profile: TooltipProfile<{ name: string }> = {
    id: 'warmup-test', preload,
    provider: {
      id: 'warmup-test', parseElement: el => ({ query: el.textContent! }),
      getCacheKey: ref => `warmup:${ref.query}`,
      fetchBatch: vi.fn(async refs => new Map(refs.map(ref => [`warmup:${ref.query}`, { name: ref.query }]))),
    },
    renderTooltipHTML: data => `<p>${data?.name}</p>`,
  };
  const config: CoreTooltipConfig = {
    ...defaultCoreConfig, selector: '.warmup', prefetch: 'none',
    tooltipOptions: { showDuration: 0, hideDuration: 0, showDelay: 0, hideDelay: 0 },
  };
  const engine = createTooltipEngine({
    profile,
    mergeConfig: overrides => ({ ...config, ...overrides }),
    findElements: selector => [...document.querySelectorAll<HTMLElement>(selector)],
  });
  document.body.innerHTML = '<button class="warmup">ONE</button><button class="warmup">TWO</button>';
  const anchors = [...document.querySelectorAll<HTMLButtonElement>('.warmup')];
  return { engine, profile, anchors };
}

beforeEach(() => {
  cache.clear();
  vi.useFakeTimers();
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { callback(0); return 1; });
});
afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup());
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  cache.clear();
  document.body.replaceChildren();
});

describe('optional visual preload lifetime', () => {
  it('starts hover/focus warmup once across all triggers, even while the preload is pending', async () => {
    let finish!: () => void;
    const preload = vi.fn(() => new Promise<void>(resolve => { finish = resolve; }));
    const { engine, anchors } = setup(preload);
    const timings: string[] = [];
    cleanups.push(engine.init({ visualPreload: 'hover', onTiming: event => timings.push(event.label) }));
    expect(preload).not.toHaveBeenCalled();
    anchors[0].dispatchEvent(new MouseEvent('mouseenter'));
    anchors[0].dispatchEvent(new FocusEvent('focus'));
    anchors[1].dispatchEvent(new MouseEvent('mouseenter'));
    expect(preload).toHaveBeenCalledTimes(1);
    expect(timings.filter(label => label === 'visual preload start')).toHaveLength(1);
    expect(timings).not.toContain('visual preload complete');
    finish();
    await vi.advanceTimersByTimeAsync(0);
    expect(timings.filter(label => label === 'visual preload complete')).toHaveLength(1);
  });

  it('removes warmup listeners from every trigger on cleanup and installs fresh listeners on reinitialization', () => {
    const preload = vi.fn().mockResolvedValue(undefined);
    const { engine, anchors } = setup(preload);
    const cleanup = engine.init({ visualPreload: 'hover' });
    cleanups.push(cleanup);
    cleanup();
    for (const anchor of anchors) {
      anchor.dispatchEvent(new MouseEvent('mouseenter'));
      anchor.dispatchEvent(new FocusEvent('focus'));
    }
    expect(preload).not.toHaveBeenCalled();
    cleanups.push(engine.init({ visualPreload: 'hover' }));
    anchors[1].dispatchEvent(new FocusEvent('focus'));
    expect(preload).toHaveBeenCalledTimes(1);
  });

  it('reports initialization warmup failure without blocking annotation loading', async () => {
    const error = new Error('Visual dependency unavailable');
    const preload = vi.fn().mockRejectedValue(error);
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { engine, profile, anchors } = setup(preload);
    cleanups.push(engine.init({ visualPreload: 'init' }));
    expect(preload).toHaveBeenCalledTimes(1);
    anchors[0].click();
    await vi.advanceTimersByTimeAsync(0);
    expect(log).toHaveBeenCalledWith('[warmup-test] Failed to preload visual dependencies.', error);
    expect(profile.provider.fetchBatch).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.gt-tooltip-content')?.textContent).toContain('ONE');
    anchors[1].dispatchEvent(new FocusEvent('focus'));
    expect(preload).toHaveBeenCalledTimes(1);
  });

  it('leaves preloading under caller control when automatic warmup is disabled', async () => {
    const preload = vi.fn().mockResolvedValue('ready');
    const { engine, anchors } = setup(preload);
    cleanups.push(engine.init({ visualPreload: 'none' }));
    anchors[0].dispatchEvent(new MouseEvent('mouseenter'));
    anchors[1].dispatchEvent(new FocusEvent('focus'));
    expect(preload).not.toHaveBeenCalled();
    await expect(engine.preload()).resolves.toBe('ready');
    expect(preload).toHaveBeenCalledTimes(1);
  });

  it('supports profiles without preload and an empty initialization', async () => {
    const { engine, profile } = setup();
    document.body.replaceChildren();
    cleanups.push(engine.init({ visualPreload: 'init', prefetch: 'all' }));
    await expect(engine.whenPrefetchReady()).resolves.toBeUndefined();
    await expect(engine.preload()).resolves.toEqual([]);
    expect(profile.provider.fetchBatch).not.toHaveBeenCalled();
  });

  it('cleans up attached handles before hover and makes repeated destruction and later calls harmless', async () => {
    const preload = vi.fn().mockResolvedValue(undefined);
    const { engine, profile, anchors } = setup(preload);
    const handle = engine.attach(anchors[0], { visualPreload: 'hover' });
    cleanups.push(() => handle.destroy());
    handle.destroy();
    handle.destroy();
    handle.open();
    handle.close();
    anchors[0].dispatchEvent(new MouseEvent('mouseenter'));
    anchors[0].dispatchEvent(new FocusEvent('focus'));
    await vi.advanceTimersByTimeAsync(0);
    expect(preload).not.toHaveBeenCalled();
    expect(profile.provider.fetchBatch).not.toHaveBeenCalled();
    expect(document.querySelector('[data-gt-tooltip-root]')).toBeNull();
  });
});
