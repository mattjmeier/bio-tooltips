import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as cache from '../src/core/cache';
import { createTooltipEngine } from '../src/core/engine';
import { myGeneProfile } from '../src/providers/mygene/profile';
import { mergeConfig } from '../src/providers/mygene/config';
import { getMyGeneFieldPlan } from '../src/providers/mygene/fields';
import { getMyChemFieldPlan } from '../src/providers/mychem/fields';
import { mergeConfig as mergeChem } from '../src/providers/mychem/config';
import { fetchMyChemRefs } from '../src/providers/mychem/client';
import { runPrefetch } from '../src/core/prefetch';
import { myChemProfile } from '../src/providers/mychem/profile';
import { fetchRecords } from '../src/core/requests';
import type { GeneTooltipConfig } from '../src/providers/mygene/config';
import type { TooltipHandle } from '../src/core/tooltip-handle';

vi.mock('../src/core/positioning', () => ({
  getDefaultFallbackPlacements: () => ['left', 'bottom', 'top'],
  startPositioning: () => ({ update: async () => {}, destroy: () => {} }),
}));

const gene = { _id: '7157', query: 'TP53', symbol: 'TP53', name: 'tumor protein p53', taxid: 9606 };
const display = {
  summary: false, location: false, geneTrack: false, pathways: false, domains: false,
  transcripts: false, structures: false, generifs: 'collapsed', linksSection: false,
} as const;
const handles: TooltipHandle[] = [];
async function settle() { for (let i = 0; i < 30; i++) await Promise.resolve(); }
function open(overrides: Partial<GeneTooltipConfig> = {}) {
  const profile = { ...myGeneProfile, renderVisuals: vi.fn() };
  const engine = createTooltipEngine({ profile, mergeConfig, findElements: () => [] });
  const anchor = document.createElement('span');
  anchor.textContent = 'TP53';
  anchor.setAttribute('data-gene', 'TP53');
  anchor.setAttribute('data-species', 'human');
  document.body.append(anchor);
  const handle = engine.attach(anchor, {
    visualPreload: 'none', prefetch: 'none', display,
    tooltipOptions: { showDuration: 0, hideDuration: 0 }, ...overrides,
  });
  handles.push(handle);
  handle.open();
  return { handle, profile };
}
function button() { return document.querySelector<HTMLButtonElement>('[data-section="generifs"] .gt-collapsible-header')!; }
function section() { return document.querySelector<HTMLElement>('[data-section="generifs"]')!; }

describe('projected records and lazy section loading', () => {
  beforeEach(() => {
    cache.clear(); document.body.replaceChildren(); vi.useFakeTimers();
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => { cb(0); return 1; });
  });
  afterEach(() => {
    handles.splice(0).forEach(handle => handle.destroy());
    vi.clearAllTimers(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals();
  });

  it('omits disabled fields, selects the configured pathway source, and eagerly loads noncollapsible sections', () => {
    const plan = getMyGeneFieldPlan(mergeConfig({ display: { ...display, pathways: 'expanded' }, pathwaySource: 'kegg' }));
    expect(plan.initial).toContain('pathway.kegg');
    expect(plan.initial).not.toContain('exons');
    expect(plan.initial).not.toContain('generif');
    expect(plan.deferred.generifs).toEqual(['generif']);
    const eager = getMyGeneFieldPlan(mergeConfig({ display: { ...display, collapsible: false } }));
    expect(eager.initial).toContain('generif');
    expect(eager.deferred).toEqual({});
  });

  it('loads a collapsed section by resolved ID, preserves focus, and reuses enriched data on reopening', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => [gene] } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ _id: '7157', generif: { text: 'A heavy annotation', pubmed: 123 } }) } as Response);
    const { handle } = open(); await settle();
    expect(new URLSearchParams(fetch.mock.calls[0][1]?.body as URLSearchParams).get('fields')).not.toContain('generif');
    expect(section().dataset.deferred).toBe('true');
    button().focus(); const focused = button(); button().click(); await settle();
    expect(String(fetch.mock.calls[1][0])).toContain('/gene/7157?fields=generif');
    expect(section().textContent).toContain('A heavy annotation');
    expect(document.activeElement).toBe(focused);
    button().click(); button().click(); await settle();
    handle.close(); handle.open(); await settle();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(section().textContent).toContain('A heavy annotation');
    expect(cache.get('mygene:TP53_9606', ['generif', 'name'])).toMatchObject({ name: gene.name });
  });

  it('marks missing annotations loaded, preventing repeated requests for empty sections', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => [gene] } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ _id: '7157' }) } as Response);
    open(); await settle(); button().click(); await settle();
    expect(section().textContent).toContain('No data available');
    button().click(); button().click(); await settle();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('retries failures without poisoning partial cache coverage', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetch = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => [gene] } as Response)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ _id: '7157', generif: { text: 'Recovered', pubmed: 123 } }) } as Response);
    open(); await settle(); button().click(); await settle();
    expect(section().textContent).toContain('Collapse and expand to retry');
    expect(cache.has('mygene:TP53_9606', ['generif'])).toBe(false);
    button().click(); button().click(); await settle();
    expect(section().textContent).toContain('Recovered');
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('caches a late section response without changing a destroyed tooltip', async () => {
    let resolve!: (value: Response) => void;
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => [gene] } as Response)
      .mockReturnValueOnce(new Promise<Response>(done => { resolve = done; }));
    const { handle } = open(); await settle(); button().click(); await settle();
    handle.destroy(); resolve({ ok: true, json: async () => ({ _id: '7157', generif: [] }) } as Response);
    await settle();
    expect(document.querySelector('[data-gt-tooltip-root]')).toBeNull();
    expect(cache.has('mygene:TP53_9606', ['generif'])).toBe(true);
  });

  it('enriches a cached record when another configuration enables more fields', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => [gene] } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ _id: '7157', summary: 'Newly enabled summary' }) } as Response);
    const first = open(); await settle(); first.handle.destroy();
    open({ display: { ...display, summary: 'expanded' } }); await settle();
    expect(String(fetch.mock.calls[1][0])).toContain('/gene/7157?fields=summary');
    expect(document.querySelector('[data-section="summary"]')?.textContent).toContain('Newly enabled summary');
  });

  it('deduplicates identical field requests while keeping disjoint enrichments', async () => {
    cache.set('mygene:TP53_9606', gene, ['name']);
    const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async url => ({
      ok: true, json: async () => String(url).includes('summary')
        ? { _id: '7157', summary: 'Summary' } : { _id: '7157', generif: [] },
    }) as Response);
    const pending = new Map(); const ref = { query: 'TP53', context: { taxid: 9606 } };
    await Promise.all([
      fetchRecords([ref], myGeneProfile.provider, pending, ['summary']),
      fetchRecords([ref], myGeneProfile.provider, pending, ['summary']),
      fetchRecords([ref], myGeneProfile.provider, pending, ['generif']),
    ]);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(cache.get('mygene:TP53_9606', ['summary', 'generif'])).toMatchObject({ summary: 'Summary', generif: [] });
  });

  it('shares projected prefetches with opening requests without marking the record complete', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => [gene] } as Response);
    const anchor = document.createElement('span'); anchor.textContent = 'TP53'; anchor.dataset.species = 'human';
    const pending = new Map(); const plan = getMyGeneFieldPlan(mergeConfig({ display }));
    const prefetch = runPrefetch('all', [anchor, anchor], 15, pending, myGeneProfile.provider, plan.initial);
    const opening = fetchRecords([{ query: 'TP53', context: { taxid: 9606 } }], myGeneProfile.provider, pending, plan.initial);
    await Promise.all([prefetch, opening]);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(cache.has('mygene:TP53_9606', plan.initial)).toBe(true);
    expect(cache.has('mygene:TP53_9606', ['generif'])).toBe(false);
    expect(pending.size).toBe(0);
  });

  it('retains instance identity and base data after shared cache eviction', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => [gene] } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ _id: '7157', generif: [] }) } as Response);
    open(); await settle(); cache.clear(); button().click(); await settle();
    expect(String(fetch.mock.calls[1][0])).toContain('/gene/7157?fields=generif');
    expect(cache.get('mygene:TP53_9606', ['name', 'generif'])).toMatchObject({ name: gene.name, generif: [] });
  });

  it('finishes enrichment while closed and shows it on reopening', async () => {
    let resolve!: (value: Response) => void;
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => [gene] } as Response)
      .mockReturnValueOnce(new Promise<Response>(done => { resolve = done; }));
    const { handle } = open(); await settle(); button().click(); await settle(); handle.close();
    resolve({ ok: true, json: async () => ({ _id: '7157', generif: { text: 'Loaded while closed', pubmed: 123 } }) } as Response);
    await settle(); handle.open(); await settle();
    expect(section().textContent).toContain('Loaded while closed');
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('loads chemical safety on expansion and merges nested source annotations', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => [{ _id: 'aspirin-id', name: 'Aspirin', drugbank: { name: 'Aspirin' } }] } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => [{ _id: 'aspirin-id', query: 'aspirin-id', drugbank: { toxicity: 'Reported toxicity' } }] } as Response);
    const engine = createTooltipEngine({ profile: myChemProfile, mergeConfig: mergeChem, findElements: () => [] });
    const anchor = document.createElement('button'); anchor.dataset.query = '2244'; anchor.dataset.scope = 'pubchem';
    document.body.append(anchor);
    const handle = engine.attach(anchor, {
      prefetch: 'none', visualPreload: 'none',
      display: { identity: false, structureProperties: false, detailedProperties: false, summary: false, synonyms: false,
        classes: false, pharmacology: false, regulatory: false, safety: 'collapsed', identifiers: false },
      tooltipOptions: { showDuration: 0, hideDuration: 0 },
    });
    handles.push(handle); handle.open(); await settle();
    const safety = document.querySelector('[data-section="safety-&-reported-effects"]')!;
    safety.querySelector<HTMLButtonElement>('.gt-collapsible-header')!.click(); await settle();
    expect(safety.textContent).toContain('Reported toxicity');
    const body = new URLSearchParams(fetch.mock.calls[1][1]?.body as URLSearchParams);
    expect(body.get('ids')).toBe('aspirin-id');
    expect(body.get('fields')).toContain('drugbank.toxicity');
    expect(cache.get('mychem:id:pubchem.cid:2244', ['drugbank.toxicity', 'drugbank.name'])).toMatchObject({
      drugbank: { name: 'Aspirin', toxicity: 'Reported toxicity' },
    });
  });

  it('projects chemical identifier lookups and preserves best-guess ranking fields', async () => {
    const plan = getMyChemFieldPlan(mergeChem({ display: { pharmacology: false, safety: 'collapsed' } }));
    expect(plan.initial).not.toContain('drugbank.targets');
    expect(plan.initial).not.toContain('aeolus.outcomes');
    expect(plan.deferred['safety-&-reported-effects']).toContain('aeolus.outcomes');
    const fetch = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => [{ _id: 'aspirin' }] } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ hits: [] }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ hits: [] }) } as Response);
    await fetchMyChemRefs([{ query: '2244', context: { scope: 'pubchem.cid', lookup: 'id' } }], plan.initial);
    const requested = new URLSearchParams(fetch.mock.calls[0][1]?.body as URLSearchParams).get('fields')!;
    expect(requested).not.toContain('drugbank.targets');
    await fetchMyChemRefs([{ query: 'aspirin' }], ['name']);
    const searchFields = new URL(String(fetch.mock.calls[1][0])).searchParams.get('fields')!;
    expect(searchFields).toContain('pubchem.cid');
    expect(searchFields).toContain('synonyms');
    expect(searchFields).not.toContain('aeolus');
  });
});
