import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/core/positioning', () => ({
  getDefaultFallbackPlacements: vi.fn(() => ['left', 'bottom', 'top']),
  startPositioning: vi.fn(() => ({
    update: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn(),
  })),
}));

import { ChemicalTooltip } from '../src/mychem';
import { GeneTooltip } from '../src/mygene';

function setupBrowser(isMobile = false): void {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: query === '(max-width: 600px)' && isMobile,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })));
}

async function flushAsync(): Promise<void> {
  for (let turn = 0; turn < 10; turn++) await Promise.resolve();
  vi.runAllTimers();
  for (let turn = 0; turn < 10; turn++) await Promise.resolve();
}

function response(json: unknown): Response {
  return { ok: true, json: async () => json } as Response;
}

describe('single-element tooltip adapters', () => {
  beforeEach(() => {
    document.body.replaceChildren();
    document.documentElement.classList.remove('dark');
    vi.useFakeTimers();
    setupBrowser();
    GeneTooltip.clearCache();
    ChemicalTooltip.clearCache();
  });

  afterEach(() => {
    GeneTooltip.clearCache();
    ChemicalTooltip.clearCache();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  it('re-reads gene query and species on every open and tears down idempotently', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async (_input, init) => {
      const params = new URLSearchParams(String(init?.body ?? ''));
      const query = params.get('q') ?? '';
      const taxid = Number(params.get('species'));
      return response(query.split(',').map(symbol => ({
        _id: symbol,
        query: symbol,
        symbol,
        name: `Name for ${symbol}`,
        summary: `Summary for ${symbol}`,
        taxid,
      })));
    });
    const anchor = document.createElement('span');
    anchor.textContent = 'TP53';
    anchor.dataset.species = 'human';
    document.body.append(anchor);

    const handle = GeneTooltip.attach(anchor, {
      visualPreload: 'none',
      prefetch: 'none',
      ideogram: { enabled: false },
      tooltipOptions: { showDuration: 0, hideDuration: 0 },
    });
    anchor.focus();
    handle.open();
    await flushAsync();
    expect(document.querySelector('.gt-tooltip-content')?.textContent).toContain('Name for TP53');
    expect(document.activeElement).toBe(anchor);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(new URLSearchParams(String(fetch.mock.calls[0][1]?.body)).get('species')).toBe('9606');

    handle.close();
    vi.runAllTimers();
    anchor.dataset.species = 'mouse';
    handle.open({ focus: true });
    await flushAsync();
    expect(document.querySelector('.gt-tooltip-content')?.textContent).toContain('Name for TP53');
    expect(document.activeElement?.getAttribute('role')).toBe('dialog');
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(new URLSearchParams(String(fetch.mock.calls[1][1]?.body)).get('species')).toBe('10090');

    handle.close();
    vi.runAllTimers();
    anchor.textContent = 'Trp53';
    handle.open();
    await flushAsync();
    expect(document.querySelector('.gt-tooltip-content')?.textContent).toContain('Name for Trp53');
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(new URLSearchParams(String(fetch.mock.calls[2][1]?.body)).get('q')).toBe('Trp53');

    handle.close();
    vi.runAllTimers();
    handle.open();
    await flushAsync();
    expect(fetch).toHaveBeenCalledTimes(3);

    handle.destroy();
    handle.destroy();
    handle.open();
    expect(document.querySelector('[data-gt-tooltip-root]')).toBeNull();
    expect(anchor.hasAttribute('data-gt-tooltip-reference')).toBe(false);
    expect(anchor.hasAttribute('aria-controls')).toBe(false);
  });

  it('re-reads chemical query and lookup scope for an attached element', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      const params = new URLSearchParams(String(init?.body ?? ''));
      const ids = params.get('ids') ?? '';
      const queries = ids.split(',').filter(Boolean);
      return response(queries.map(query => ({
        query,
        _id: query,
        name: `Chemical ${query}`,
        pubchem: { cid: query },
        chembl: { molecule_chembl_id: query },
      })));
    });
    const anchor = document.createElement('button');
    anchor.type = 'button';
    anchor.textContent = 'aspirin';
    anchor.dataset.query = '2244';
    anchor.dataset.scope = 'pubchem';
    document.body.append(anchor);

    const handle = ChemicalTooltip.attach(anchor, {
      visualPreload: 'none',
      prefetch: 'none',
      tooltipOptions: { showDuration: 0, hideDuration: 0 },
    });
    handle.open();
    await flushAsync();
    expect(document.querySelector('.gt-tooltip-content')?.textContent).toContain('Chemical 2244');
    expect(String(fetch.mock.calls[0][0])).toContain('/v1/chem');

    handle.close();
    vi.runAllTimers();
    anchor.dataset.scope = 'chembl';
    handle.open();
    await flushAsync();
    expect(fetch).toHaveBeenCalledTimes(2);

    handle.close();
    vi.runAllTimers();
    anchor.dataset.query = 'CHEMBL25';
    anchor.textContent = 'Aspirin';
    handle.open();
    await flushAsync();
    expect(document.querySelector('.gt-tooltip-content')?.textContent).toContain('Chemical CHEMBL25');
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(new URLSearchParams(String(fetch.mock.calls[2][1]?.body)).get('ids')).toBe('CHEMBL25');

    handle.destroy();
    expect(anchor.getAttribute('aria-haspopup')).toBeNull();
  });

  it('uses the automatic mobile drawer presentation for an attached tooltip', async () => {
    setupBrowser(true);
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response([]));
    const anchor = document.createElement('span');
    anchor.textContent = 'TP53';
    anchor.dataset.species = 'human';
    document.body.append(anchor);

    const handle = GeneTooltip.attach(anchor, {
      prefetch: 'none',
      visualPreload: 'none',
      presentation: 'auto',
      tooltipOptions: { showDuration: 0, hideDuration: 0 },
    });
    handle.open();
    await flushAsync();
    const root = document.querySelector<HTMLElement>('[data-gt-tooltip-root]');
    expect(root?.dataset.presentation).toBe('drawer');
    expect(root?.querySelector<HTMLButtonElement>('.gt-drawer-handle')?.hidden).toBe(false);

    handle.destroy();
    expect(document.querySelector('[data-gt-tooltip-root]')).toBeNull();
  });
});
