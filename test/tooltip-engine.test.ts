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

function createHarness(
  fetchBatch: TooltipProfile<TestData>['provider']['fetchBatch'],
  selector = '.test-tooltip'
) {
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
    selector,
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

  it('dismisses the previously open top-level tooltip when a new one opens', async () => {
    const engine = createHarness(vi.fn().mockResolvedValue(new Map([
      ['test:GENE1', { label: 'First gene label' }],
      ['test:GENE2', { label: 'Second gene label' }],
    ])));
    const first = document.createElement('span');
    first.className = 'test-tooltip';
    first.textContent = 'GENE1';
    const second = document.createElement('span');
    second.className = 'test-tooltip';
    second.textContent = 'GENE2';
    document.body.append(first, second);
    const cleanup = engine.init();

    first.dispatchEvent(new MouseEvent('mouseenter'));
    vi.runAllTimers();
    await flushAsync();
    expect(document.querySelectorAll('[data-gt-tooltip-root]')).toHaveLength(1);
    expect(document.querySelector('.gt-tooltip-content')?.textContent).toContain('First gene label');

    // Opening the second trigger dismisses the first, so sweeping across a list
    // of triggers does not leave a trail of stacked panels.
    second.dispatchEvent(new MouseEvent('mouseenter'));
    vi.runAllTimers();
    await flushAsync();
    expect(document.querySelectorAll('[data-gt-tooltip-root]')).toHaveLength(1);
    expect(document.querySelector('.gt-tooltip-content')?.textContent).toContain('Second gene label');
    cleanup();
  });

  it('dismisses an open tooltip owned by a DIFFERENT engine when a new one opens', async () => {
    // Each docs demo calls init() with its own selector, so it is its own
    // single-controller engine. A per-engine sibling list can never see a
    // tooltip from another engine, so the "only one at a time" rule must span
    // engines via the shared open-tooltip registry.
    const fetchBatch = vi.fn().mockResolvedValue(new Map([
      ['test:GENE1', { label: 'First gene label' }],
      ['test:GENE2', { label: 'Second gene label' }],
    ]));
    const engineA = createHarness(fetchBatch, '.tip-a');
    const engineB = createHarness(fetchBatch, '.tip-b');

    const first = document.createElement('span');
    first.className = 'tip-a';
    first.textContent = 'GENE1';
    const second = document.createElement('span');
    second.className = 'tip-b';
    second.textContent = 'GENE2';
    document.body.append(first, second);
    const cleanupA = engineA.init();
    const cleanupB = engineB.init();

    first.dispatchEvent(new MouseEvent('mouseenter'));
    vi.runAllTimers();
    await flushAsync();
    expect(document.querySelectorAll('[data-gt-tooltip-root]')).toHaveLength(1);
    expect(document.querySelector('.gt-tooltip-content')?.textContent).toContain('First gene label');

    // GENE2 lives in a separate engine. Opening it must dismiss GENE1, which
    // engine B has no direct reference to.
    second.dispatchEvent(new MouseEvent('mouseenter'));
    vi.runAllTimers();
    await flushAsync();
    expect(document.querySelectorAll('[data-gt-tooltip-root]')).toHaveLength(1);
    expect(document.querySelector('.gt-tooltip-content')?.textContent).toContain('Second gene label');
    cleanupA();
    cleanupB();
  });
});
