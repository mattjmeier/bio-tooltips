import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTooltipEngine } from '../src/core/engine';
import { defaultCoreConfig } from '../src/core/config';
import type { CoreTooltipConfig, TooltipProfile } from '../src/core/types';
import { renderCollapsibleSection } from '../src/core/sections';
import { clear } from '../src/core/cache';

vi.mock('../src/core/positioning', () => ({
  getDefaultFallbackPlacements: () => ['left', 'bottom', 'top'],
  startPositioning: () => ({ update: async () => {}, destroy: () => {} }),
}));

type Data = { label: string };
let cleanup = () => {};
function mount(
  overrides: Partial<TooltipProfile<Data>> = {},
  presentation: CoreTooltipConfig['presentation'] = 'auto'
) {
  const profile: TooltipProfile<Data> = {
    id: 'mygene',
    provider: {
      id: 'test', parseElement: () => ({ query: 'TEST' }), getCacheKey: () => 'a11y-test',
      fetchBatch: async () => new Map([['a11y-test', { label: 'Loaded data' }]]),
    },
    renderTooltipHTML: () => renderCollapsibleSection('Pathways', '<button id="more">More pathways</button>', 'test', true, false),
    getNestedTooltipDefinitions: () => [{ selector: '#more', items: [{ name: 'First' }, { name: 'Second' }] }],
    ...overrides,
  };
  const config: CoreTooltipConfig = {
    ...defaultCoreConfig, selector: '.trigger', prefetch: 'none', visualPreload: 'none',
    presentation,
    display: { collapsible: true },
    tooltipOptions: { showDuration: 1000, hideDuration: 0 },
    nestedTooltipOptions: { showDuration: 0, hideDuration: 0 },
  };
  const engine = createTooltipEngine({
    profile, mergeConfig: () => config,
    findElements: () => [...document.querySelectorAll<HTMLElement>('.trigger')],
  });
  document.body.innerHTML = '<span class="trigger">TEST</span><button id="after">After</button>';
  cleanup = engine.init();
  document.querySelector<HTMLElement>('.trigger')!.click();
  return profile;
}

async function settleData() {
  // Resolve the data/render promise without advancing the 1-second animation.
  for (let index = 0; index < 8; index++) await Promise.resolve();
}

function dispatchPointer(target: EventTarget, type: string, clientY: number): void {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    clientX: { value: 20 },
    clientY: { value: clientY },
    button: { value: 0 },
    isPrimary: { value: true },
  });
  target.dispatchEvent(event);
}

describe('accessible data lifecycle', () => {
  beforeEach(() => {
    clear();
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0); return 1;
    });
  });
  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('opens and closes a child before optional visuals and the parent animation finish', async () => {
    let resolveVisuals!: () => void;
    const visuals = new Promise<void>(resolve => { resolveVisuals = resolve; });
    mount({ renderVisuals: () => visuals });
    await settleData();
    const parent = document.querySelector('[role="dialog"]')!;
    const more = document.querySelector<HTMLButtonElement>('#more')!;
    expect(more.getAttribute('aria-haspopup')).toBe('dialog');
    more.click();
    const panels = document.querySelectorAll('[role="dialog"]');
    expect(panels).toHaveLength(2);
    expect(panels[1].getAttribute('aria-label')).toBe('Pathways');
    expect(document.activeElement).toBe(panels[1]);
    resolveVisuals();
    await settleData();
    expect(document.activeElement).toBe(panels[1]);
    panels[1].querySelector<HTMLButtonElement>('.gt-close-button')!.click();
    expect(document.activeElement).toBe(more);
    expect(parent.getAttribute('data-state')).toBe('visible');
    vi.runAllTimers();
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);
  });

  it('retains the live region and focus when loading resolves', async () => {
    let resolveFetch!: (result: Map<string, Data>) => void;
    const pending = new Promise<Map<string, Data>>(resolve => { resolveFetch = resolve; });
    mount({ provider: {
      id: 'test', parseElement: () => ({ query: 'TEST' }), getCacheKey: () => 'a11y-test',
      fetchBatch: () => pending,
    } });
    const status = document.querySelector('.gt-panel-status')!;
    const content = document.querySelector('.gt-tooltip-content')!;
    expect(content.getAttribute('aria-busy')).toBe('true');
    expect(status.textContent).toContain('Loading');
    content.querySelector<HTMLButtonElement>('.gt-close-button')!.focus();
    resolveFetch(new Map([['a11y-test', { label: 'Loaded' }]]));
    await settleData();
    expect(document.querySelector('.gt-panel-status')).toBe(status);
    expect(status.textContent).toContain('loaded');
    expect(content.getAttribute('aria-busy')).toBe('false');
    expect(document.activeElement?.getAttribute('role')).toBe('dialog');
  });

  it('closes a drawer from its labelled handle and returns focus to the trigger', async () => {
    mount({}, 'drawer');
    await settleData();
    const trigger = document.querySelector<HTMLElement>('.trigger')!;
    const handle = document.querySelector<HTMLButtonElement>('.gt-drawer-handle')!;
    const closeButton = document.querySelector<HTMLButtonElement>('.gt-tooltip-content .gt-close-button')!;

    expect(handle.hidden).toBe(false);
    expect(handle.getAttribute('aria-label')).toBe('Close');
    expect(closeButton).not.toBe(handle);
    handle.focus();

    dispatchPointer(handle, 'pointerdown', 100);
    dispatchPointer(handle, 'pointermove', 180);
    dispatchPointer(handle, 'pointerup', 180);
    handle.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    handle.click();

    expect(document.activeElement).toBe(trigger);
    expect(document.querySelector('[data-gt-tooltip-root]')?.hasAttribute('inert')).toBe(true);
  });

  it('makes collapse immediately inert and restores focus, including during animation', async () => {
    mount();
    await settleData();
    const header = document.querySelector<HTMLButtonElement>('.gt-collapsible-header')!;
    const content = document.querySelector<HTMLElement>('.gt-collapsible-content')!;
    const more = document.querySelector<HTMLButtonElement>('#more')!;
    more.focus();
    header.click();
    expect(header.tagName).toBe('BUTTON');
    expect(header.getAttribute('aria-expanded')).toBe('false');
    expect(content.hasAttribute('inert')).toBe(true);
    expect(document.activeElement).toBe(header);
    vi.advanceTimersByTime(300);
    expect(content.hidden).toBe(true);
    header.click();
    expect(content.hidden).toBe(false);
    expect(content.hasAttribute('inert')).toBe(false);
    expect(header.getAttribute('aria-expanded')).toBe('true');
  });
});
