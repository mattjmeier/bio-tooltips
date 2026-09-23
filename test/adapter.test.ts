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

  it('applies composed trigger styles and restores author styling on destroy', () => {
    const geneAnchor = document.createElement('span');
    geneAnchor.textContent = 'TP53';
    geneAnchor.setAttribute('data-gt-trigger-style', 'author-value');
    document.body.append(geneAnchor);
    const geneHandle = GeneTooltip.attach(geneAnchor, {
      triggerStyle: ['bold', 'dotted'],
      prefetch: 'none',
      visualPreload: 'none',
      ideogram: { enabled: false },
    });

    expect(geneAnchor.getAttribute('data-gt-trigger-style')).toBe('dotted bold');
    geneHandle.destroy();
    expect(geneAnchor.getAttribute('data-gt-trigger-style')).toBe('author-value');
    expect(geneAnchor.hasAttribute('data-gt-tooltip-reference')).toBe(false);

    const chemicalAnchor = document.createElement('span');
    chemicalAnchor.textContent = 'aspirin';
    chemicalAnchor.setAttribute('data-gt-trigger-style', 'old-style');
    document.body.append(chemicalAnchor);
    const chemicalHandle = ChemicalTooltip.attach(chemicalAnchor, {
      triggerStyle: 'solid',
      prefetch: 'none',
      visualPreload: 'none',
    });

    expect(chemicalAnchor.getAttribute('data-gt-trigger-style')).toBe('solid');
    chemicalHandle.destroy();
    expect(chemicalAnchor.getAttribute('data-gt-trigger-style')).toBe('old-style');
  });

  it('applies an opt-in trigger style to initialized elements and restores attributes on cleanup', () => {
    const anchor = document.createElement('span');
    anchor.className = 'gene-tooltip';
    anchor.textContent = 'TP53';
    anchor.setAttribute('data-gt-trigger-style', 'author-value');
    document.body.append(anchor);

    const cleanup = GeneTooltip.init({
      selector: '.gene-tooltip',
      triggerStyle: 'bold',
      prefetch: 'none',
      visualPreload: 'none',
      ideogram: { enabled: false },
    });
    expect(anchor.getAttribute('data-gt-trigger-style')).toBe('bold');
    cleanup();
    expect(anchor.getAttribute('data-gt-trigger-style')).toBe('author-value');
    expect(anchor.hasAttribute('data-gt-tooltip-reference')).toBe(false);
  });

  it('rejects conflicting underline presets before modifying an attached trigger', () => {
    const anchor = document.createElement('span');
    anchor.textContent = 'TP53';
    document.body.append(anchor);
    expect(() => GeneTooltip.attach(anchor, {
      triggerStyle: ['dotted', 'solid'],
      prefetch: 'none',
      visualPreload: 'none',
    })).toThrow("Tooltip trigger styles 'dotted' and 'solid' cannot be combined.");
    expect(anchor.hasAttribute('data-gt-tooltip-reference')).toBe(false);
    expect(anchor.hasAttribute('data-gt-trigger-style')).toBe(false);
  });

  it('keeps the newest trigger style active until the final duplicate controller is destroyed', () => {
    const anchor = document.createElement('span');
    anchor.textContent = 'TP53';
    anchor.setAttribute('data-gt-trigger-style', 'author-value');
    document.body.append(anchor);
    const first = GeneTooltip.attach(anchor, {
      triggerStyle: 'dotted',
      prefetch: 'none',
      visualPreload: 'none',
    });
    const second = ChemicalTooltip.attach(anchor, {
      triggerStyle: ['solid', 'bold'],
      prefetch: 'none',
      visualPreload: 'none',
    });

    expect(anchor.getAttribute('data-gt-trigger-style')).toBe('solid bold');
    expect(anchor.hasAttribute('data-gt-trigger-style-active')).toBe(true);
    first.destroy();
    expect(anchor.getAttribute('data-gt-trigger-style')).toBe('solid bold');
    expect(anchor.hasAttribute('data-gt-trigger-style-active')).toBe(true);
    second.destroy();
    expect(anchor.getAttribute('data-gt-trigger-style')).toBe('author-value');
    expect(anchor.hasAttribute('data-gt-trigger-style-active')).toBe(false);
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
