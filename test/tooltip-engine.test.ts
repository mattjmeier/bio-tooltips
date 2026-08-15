import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/core/positioning', () => ({
  getDefaultFallbackPlacements: vi.fn(() => ['left', 'bottom', 'top']),
  startPositioning: vi.fn(() => ({
    update: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn(),
  })),
}));

import { defaultCoreConfig, type CoreTooltipConfig } from '../src/core/config';
import { createTooltipEngine } from '../src/core/engine';
import type { TooltipProfile } from '../src/core/types';

interface TestData {
  label: string;
}

function createHarness(fetchBatch: TooltipProfile<TestData>['provider']['fetchBatch']) {
  const profile: TooltipProfile<TestData, CoreTooltipConfig> = {
    id: 'test',
    provider: {
      id: 'test',
      parseElement: element => ({ query: element.textContent ?? '' }),
      getCacheKey: reference => `test:${reference.query}`,
      fetchBatch,
    },
    renderTooltipHTML: data => `<button class="gt-pin-button">Pin</button><p>${data?.label ?? 'missing'}</p>`,
  };
  const config: CoreTooltipConfig = {
    ...defaultCoreConfig,
    selector: '.test-tooltip',
    prefetch: 'none',
    visualPreload: 'none',
    tooltipOptions: {
      ...defaultCoreConfig.tooltipOptions,
      showDuration: 0,
      hideDuration: 0,
    },
  };
  const engine = createTooltipEngine({
    profile,
    mergeConfig: userConfig => ({
      ...config,
      ...userConfig,
      tooltipOptions: { ...config.tooltipOptions, ...userConfig?.tooltipOptions } as CoreTooltipConfig['tooltipOptions'],
      nestedTooltipOptions: { ...config.nestedTooltipOptions, ...userConfig?.nestedTooltipOptions } as CoreTooltipConfig['nestedTooltipOptions'],
    }),
    findElements: selector => Array.from(document.querySelectorAll<HTMLElement>(selector)),
  });
  return engine;
}

async function flushAsync(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  vi.runAllTimers();
  await Promise.resolve();
}

describe('tooltip engine lifecycle', () => {
  beforeEach(() => {
    document.body.replaceChildren();
    document.documentElement.classList.remove('dark');
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));
  });

  it('does not remount or mutate detached UI when a fetch resolves after cleanup', async () => {
    let resolveFetch!: (value: Map<string, TestData>) => void;
    const fetchPromise = new Promise<Map<string, TestData>>(resolve => {
      resolveFetch = resolve;
    });
    const engine = createHarness(vi.fn(() => fetchPromise));
    const reference = document.createElement('span');
    reference.className = 'test-tooltip';
    reference.textContent = 'TP53';
    document.body.append(reference);

    const cleanup = engine.init();
    reference.dispatchEvent(new MouseEvent('mouseenter'));
    vi.runAllTimers();
    expect(document.querySelector('.gt-tooltip-content')?.textContent).toContain('Loading');

    cleanup();
    resolveFetch(new Map([['test:TP53', { label: 'Tumor protein p53' }]]));
    await flushAsync();

    expect(document.querySelector('[data-gt-tooltip-root]')).toBeNull();
    expect(reference.hasAttribute('aria-expanded')).toBe(false);
  });

  it('reuses loaded data when a tooltip is hidden and reopened', async () => {
    const fetchBatch = vi.fn().mockResolvedValue(new Map([
      ['test:BRCA1', { label: 'Breast cancer type 1 susceptibility protein' }],
    ]));
    const engine = createHarness(fetchBatch);
    const reference = document.createElement('span');
    reference.className = 'test-tooltip';
    reference.textContent = 'BRCA1';
    document.body.append(reference);
    const cleanup = engine.init();

    reference.dispatchEvent(new MouseEvent('mouseenter'));
    vi.runAllTimers();
    await flushAsync();
    expect(document.querySelector('.gt-tooltip-content')?.textContent).toContain('Breast cancer');

    reference.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }));
    vi.runAllTimers();
    reference.dispatchEvent(new MouseEvent('mouseenter'));
    vi.runAllTimers();
    await flushAsync();

    expect(fetchBatch).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.gt-tooltip-content')?.textContent).toContain('Breast cancer');
    cleanup();
  });

  it('keeps a rendered tooltip open while pinned and closes it when unpinned', async () => {
    const engine = createHarness(vi.fn().mockResolvedValue(new Map([
      ['test:TP53', { label: 'Tumor protein p53' }],
    ])));
    const reference = document.createElement('span');
    reference.className = 'test-tooltip';
    reference.textContent = 'TP53';
    document.body.append(reference);
    const cleanup = engine.init();

    reference.dispatchEvent(new MouseEvent('mouseenter'));
    vi.runAllTimers();
    await flushAsync();
    const pin = document.querySelector<HTMLButtonElement>('.gt-pin-button')!;
    pin.click();
    reference.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }));
    vi.runAllTimers();
    expect(document.querySelector('[data-gt-tooltip-root]')).not.toBeNull();
    expect(pin.getAttribute('aria-label')).toBe('Unpin tooltip');

    pin.click();
    vi.runAllTimers();
    expect(document.querySelector('[data-gt-tooltip-root]')).toBeNull();
    cleanup();
  });
});
