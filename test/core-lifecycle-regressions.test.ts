import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTooltipEngine } from '../src/core/engine';
import { defaultCoreConfig } from '../src/core/config';
import { renderCollapsibleSection } from '../src/core/sections';
import * as cache from '../src/core/cache';
import type { CoreTooltipConfig, EntityRef, TooltipProfile } from '../src/core/types';

vi.mock('../src/core/positioning', () => ({
  getDefaultFallbackPlacements: () => ['left', 'bottom', 'top'],
  startPositioning: () => ({ update: async () => {}, destroy: () => {} }),
}));

type Data = { _id: string; name?: string; summary?: string };
const cleanups: Array<() => void> = [];
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function setup(overrides: Partial<TooltipProfile<Data>> = {}, configOverrides: Partial<CoreTooltipConfig> = {}) {
  const fetch = vi.fn(async (refs: EntityRef[], _fields?: readonly string[]) =>
    new Map<string, Data>(refs.map(ref => [`race:${ref.query}`, { _id: ref.query, name: ref.query }])));
  const visuals = vi.fn().mockResolvedValue(undefined);
  const profile: TooltipProfile<Data> = {
    id: 'race',
    provider: {
      id: 'race', parseElement: el => el.dataset.query ? { query: el.dataset.query } : null,
      getCacheKey: ref => `race:${ref.query}`, fetchBatch: fetch,
    },
    renderTooltipHTML: data => `<p>${data?.name ?? 'Missing record'}</p><button class="gt-pin-button">Pin</button>`,
    renderVisuals: visuals,
    ...overrides,
  };
  const config: CoreTooltipConfig = {
    ...defaultCoreConfig, prefetch: 'none', visualPreload: 'none', presentation: 'popover',
    tooltipOptions: { showDuration: 0, hideDuration: 0 }, display: { collapsible: true }, ...configOverrides,
  };
  const engine = createTooltipEngine({ profile, mergeConfig: () => config, findElements: () => [] });
  function attach(query = 'A') {
    const anchor = document.createElement('button');
    anchor.dataset.query = query;
    document.body.append(anchor);
    const handle = engine.attach(anchor);
    cleanups.push(() => handle.destroy());
    return { anchor, handle };
  }
  return { fetch, visuals, profile, attach };
}
const settle = () => vi.runAllTimersAsync();
const content = () => document.querySelector<HTMLElement>('.gt-tooltip-content')!;

beforeEach(() => {
  cache.clear();
  vi.useFakeTimers();
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0));
});
afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup());
  cache.clear();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe('core annotation lifecycle recovery', () => {
  it('renders invalid-element messages as text and recovers when the trigger becomes valid', async () => {
    const { attach, fetch } = setup({ invalidElementMessage: '<b>Invalid query</b>' });
    const { handle, anchor } = attach('');
    handle.open();
    await settle();
    expect(content().textContent).toContain('<b>Invalid query</b>');
    expect(content().querySelector('b')).toBeNull();
    expect(content().getAttribute('aria-busy')).toBe('false');
    expect(fetch).not.toHaveBeenCalled();
    content().querySelector<HTMLButtonElement>('.gt-close-button')!.click();
    anchor.dataset.query = 'RECOVERED';
    handle.open();
    await settle();
    expect(content().textContent).toContain('RECOVERED');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('negative-caches not-found results and renders them in another instance without another request', async () => {
    const { attach, fetch, visuals } = setup();
    fetch.mockResolvedValue(new Map());
    attach().handle.open();
    await settle();
    expect(content().textContent).toContain('Missing record');
    expect(document.querySelector('.gt-panel-status')?.textContent).toBe('race not found.');
    attach().handle.open();
    await settle();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(cache.get('race:A')).toBeNull();
    expect(visuals).not.toHaveBeenCalled();
  });

  it('retries annotation failures after closing and reopening without poisoning the cache', async () => {
    const { attach, fetch } = setup();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fetch.mockRejectedValueOnce(new Error('offline'));
    const { handle } = attach();
    handle.open();
    await settle();
    expect(content().textContent).toContain('Error loading data.');
    expect(content().getAttribute('aria-busy')).toBe('false');
    expect(cache.has('race:A')).toBe(false);
    handle.close();
    handle.open();
    await settle();
    expect(content().textContent).toContain('A');
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('caches an old query response without overwriting the newly opened query', async () => {
    const { attach, fetch } = setup();
    const old = deferred<Map<string, Data>>();
    fetch.mockReturnValueOnce(old.promise);
    const { handle, anchor } = attach('OLD');
    handle.open();
    await settle();
    handle.close();
    anchor.dataset.query = 'NEW';
    handle.open();
    await settle();
    expect(content().textContent).toContain('NEW');
    old.resolve(new Map([['race:OLD', { _id: 'OLD', name: 'Old response' }]]));
    await settle();
    expect(content().textContent).toContain('NEW');
    expect(content().textContent).not.toContain('Old response');
    expect(cache.get('race:OLD')).toEqual({ _id: 'OLD', name: 'Old response' });
    expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('race details for NEW');
  });

  it('ignores an annotation rejection after destruction', async () => {
    const pending = deferred<Map<string, Data>>();
    const { attach, fetch } = setup();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fetch.mockReturnValueOnce(pending.promise);
    const { handle } = attach();
    handle.open();
    handle.destroy();
    pending.reject(new Error('offline'));
    await settle();
    expect(document.querySelector('[data-gt-tooltip-root]')).toBeNull();
    expect(cache.has('race:A')).toBe(false);
  });

  it('keeps annotation content usable after visual failure and retries visuals on reopening', async () => {
    const { attach, visuals } = setup();
    visuals.mockRejectedValueOnce(new Error('visual failed'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { handle } = attach();
    handle.open();
    await settle();
    expect(content().textContent).toContain('A');
    expect(document.querySelector('.gt-panel-status')?.textContent).toBe('Some visual content could not be displayed.');
    handle.close();
    handle.open();
    await settle();
    expect(visuals).toHaveBeenCalledTimes(2);
    expect(content().querySelector('.gt-close-button')).not.toBeNull();
  });

  it('skips queued visual rendering if destroyed before the animation frame', async () => {
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => { frames.push(cb); return frames.length; });
    const { attach, visuals } = setup();
    const { handle } = attach();
    handle.open();
    await settle();
    expect(content().textContent).toContain('A');
    handle.destroy();
    frames.forEach(cb => cb(0));
    await settle();
    expect(visuals).not.toHaveBeenCalled();
    expect(document.querySelector('[data-gt-tooltip-root]')).toBeNull();
  });

  it('discards late visual completion after closing and rebuilds nested controls on reopening', async () => {
    const pending = deferred<void>();
    const { attach, visuals } = setup({
      renderTooltipHTML: () => '<button id="details">Details</button>',
      getNestedTooltipDefinitions: () => [{ selector: '#details', items: [{ name: 'Item' }], accessibleName: 'Annotations' }],
    });
    visuals.mockReturnValueOnce(pending.promise);
    const { handle } = attach();
    handle.open();
    await settle();
    const details = document.getElementById('details')!;
    expect(details.getAttribute('aria-haspopup')).toBe('dialog');
    handle.close();
    pending.resolve();
    await settle();
    expect(details.hasAttribute('aria-haspopup')).toBe(false);
    expect(document.querySelector('[data-gt-tooltip-root]')).toBeNull();
    handle.open();
    await settle();
    details.click();
    await settle();
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(2);
    expect(document.querySelector('[aria-label="Annotations"]')).not.toBeNull();
  });
});

describe('attached engine siblings and viewport cleanup', () => {
  it('dismisses an attached focus-owned sibling and restores its trigger focus', async () => {
    const { attach } = setup();
    const first = attach('FIRST');
    const second = attach('SECOND');
    first.handle.open({ focus: true });
    await settle();
    expect(document.activeElement?.getAttribute('role')).toBe('dialog');
    second.handle.open();
    await settle();
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);
    expect(content().textContent).toContain('SECOND');
    expect(document.activeElement).toBe(first.anchor);
  });

  it('preserves an explicitly pinned sibling when another attached tooltip opens', async () => {
    const { attach } = setup();
    attach('PINNED').handle.open();
    await settle();
    document.querySelector<HTMLButtonElement>('.gt-pin-button')!.click();
    attach('SECOND').handle.open();
    await settle();
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(2);
    expect(document.querySelector('.gt-pin-active')?.getAttribute('aria-pressed')).toBe('true');
  });

  it('updates the popover height on visual viewport resize and removes that subscription on close', async () => {
    const viewport = Object.assign(new EventTarget(), { width: 900, height: 500 });
    vi.stubGlobal('visualViewport', viewport);
    const { attach } = setup({}, { tooltipHeight: 400 });
    const { handle } = attach();
    handle.open();
    await settle();
    const panel = content();
    expect(panel.style.maxHeight).toBe('400px');
    viewport.height = 200;
    viewport.dispatchEvent(new Event('resize'));
    expect(panel.style.maxHeight).toBe('184px');
    handle.close();
    viewport.height = 100;
    viewport.dispatchEvent(new Event('resize'));
    expect(panel.style.maxHeight).toBe('184px');
  });
});

describe('deferred section state transitions', () => {
  it('supports legacy section keyboard controls while ignoring embedded actions and native-button keydown', async () => {
    const { attach } = setup({ renderTooltipHTML: (_data, options) =>
      renderCollapsibleSection('Summary', '<p>Annotation</p>', options.uniqueId, true, true)
        .replace('<button class=', '<div role="button" tabindex="0" class=')
        .replace('</button>', '<button id="embedded">Action</button></div>'),
    });
    attach().handle.open();
    await settle();
    const section = document.querySelector('[data-section="summary"]')!;
    const header = section.querySelector<HTMLElement>('.gt-collapsible-header')!;
    document.getElementById('embedded')!.click();
    expect(section.getAttribute('data-collapsed')).toBe('true');
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    header.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(section.getAttribute('data-collapsed')).toBe('false');
    document.getElementById('embedded')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(section.getAttribute('data-collapsed')).toBe('false');
    header.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    expect(section.getAttribute('data-collapsed')).toBe('true');
  });

  it('runs visual scheduling with a timer when requestAnimationFrame is unavailable', async () => {
    vi.stubGlobal('requestAnimationFrame', undefined);
    const { attach, visuals } = setup();
    attach().handle.open();
    await settle();
    expect(visuals).toHaveBeenCalledTimes(1);
    expect(content().textContent).toContain('A');
  });

  it('caches a collapsed in-flight section without rendering visuals, then reuses it on expansion', async () => {
    const pending = deferred<Map<string, Data>>();
    const { attach, fetch, visuals } = setup({
      getFieldPlan: () => ({ initial: ['name'], deferred: { summary: ['summary'] } }),
      renderTooltipHTML: (data, options) => renderCollapsibleSection(
        'Summary', `<p>${data?.summary ?? 'Not loaded'}</p>`, options.uniqueId, true, true,
        '', options.deferredSections?.includes('summary'),
      ),
    });
    fetch.mockImplementationOnce(async () => new Map([['race:A', { _id: 'A', name: 'A' }]]));
    fetch.mockReturnValueOnce(pending.promise);
    attach().handle.open();
    await settle();
    const header = document.querySelector<HTMLButtonElement>('.gt-collapsible-header')!;
    const section = document.querySelector('[data-section="summary"]')!;
    header.click();
    await settle();
    expect(section.querySelector('[aria-busy="true"]')).not.toBeNull();
    header.click();
    pending.resolve(new Map([['race:A', { _id: 'A', summary: 'Late annotation' }]]));
    await settle();
    expect(section.getAttribute('data-collapsed')).toBe('true');
    expect(section.hasAttribute('data-deferred')).toBe(false);
    expect(visuals.mock.calls.filter(([context]) => context.sectionKey === 'summary')).toHaveLength(0);
    header.click();
    await settle();
    expect(section.textContent).toContain('Late annotation');
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(visuals.mock.calls.filter(([context]) => context.sectionKey === 'summary')).toHaveLength(1);
  });

  it('retries failed section visuals and deduplicates rapid expansion while a retry is pending', async () => {
    const pending = deferred<void>();
    const { attach, visuals } = setup({ renderTooltipHTML: (_data, options) =>
      renderCollapsibleSection('Summary', '<p>Annotation</p>', options.uniqueId, true, true),
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const renderSection = vi.fn().mockRejectedValueOnce(new Error('render failed')).mockReturnValueOnce(pending.promise);
    visuals.mockImplementation(context => context.sectionKey ? renderSection() : Promise.resolve());
    attach().handle.open();
    await settle();
    const header = document.querySelector<HTMLButtonElement>('.gt-collapsible-header')!;
    header.click();
    await settle();
    expect(renderSection).toHaveBeenCalledTimes(1);
    header.click(); header.click();
    await settle();
    header.click(); header.click();
    await settle();
    expect(renderSection).toHaveBeenCalledTimes(2);
    pending.resolve();
    await settle();
    header.click(); header.click();
    await settle();
    expect(renderSection).toHaveBeenCalledTimes(2);
  });
});
