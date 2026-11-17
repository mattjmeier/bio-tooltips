import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createNestedContent, filterNestedList, getSectionBackgroundColor, installNestedListFilter,
} from '../src/utils';
import type { TooltipController } from '../src/core/tooltip-controller';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('nested list filtering', () => {
  it('renders a compact toolbar with a persistent search label and live result count', () => {
    document.body.innerHTML = createNestedContent([
      { name: 'Apoptosis' },
      { name: 'DNA repair' },
    ]);

    const toolbar = document.querySelector('.gt-nested-toolbar')!;
    const input = toolbar.querySelector<HTMLInputElement>('input[type="search"]')!;
    const label = toolbar.querySelector<HTMLLabelElement>('label')!;
    const status = toolbar.querySelector<HTMLElement>('[role="status"]')!;

    expect(label.textContent).toBe('Filter');
    expect(label.htmlFor).toBe(input.id);
    expect(input.placeholder).toBe('Search...');
    expect(status.textContent).toBe('2 results');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(Array.from(toolbar.children).map(child => child.className)).toEqual([
      'gt-nested-filter-meta',
      'gene-tooltip-nested-search',
      'gt-close-button',
    ]);
  });

  it('updates the toolbar count while filtering list items', () => {
    document.body.innerHTML = createNestedContent([
      { name: 'Apoptosis' },
      { name: 'DNA repair' },
    ]);
    const list = document.querySelector<HTMLUListElement>('.gene-tooltip-nested-list')!;

    filterNestedList('apop', list.id);

    expect(document.querySelector('.gt-nested-status')?.textContent).toBe('1 result');
    expect(Array.from(list.children).map(item => (item as HTMLElement).style.display)).toEqual(['', 'none']);
  });

  it('filters case-insensitively, announces zero matches, and restores every item when cleared', () => {
    document.body.innerHTML = createNestedContent([
      { name: 'DNA repair' }, { name: 'DNA replication' }, { name: '' },
    ]);
    const list = document.querySelector<HTMLUListElement>('ul')!;
    const status = document.querySelector('[role="status"]')!;
    const visibility = () => [...list.children].map(el => (el as HTMLElement).style.display);
    filterNestedList('dNa', list.id);
    expect(visibility()).toEqual(['', '', 'none']);
    expect(status.textContent).toBe('2 results');
    filterNestedList('no such pathway', list.id);
    expect(visibility()).toEqual(['none', 'none', 'none']);
    expect(status.textContent).toBe('0 results');
    filterNestedList('', list.id);
    expect(visibility()).toEqual(['', '', '']);
    expect(status.textContent).toBe('3 results');
  });

  it('leaves other nested lists and their live counts unchanged', () => {
    document.body.innerHTML = createNestedContent([{ name: 'First' }]) + createNestedContent([{ name: 'Second' }]);
    const lists = [...document.querySelectorAll('ul')];
    filterNestedList('missing', lists[0].id);
    expect(lists[0].querySelector('li')!.style.display).toBe('none');
    expect(lists[1].querySelector('li')!.style.display).toBe('');
    expect([...document.querySelectorAll('[role="status"]')].map(el => el.textContent)).toEqual(['0 results', '1 result']);
  });

  it('tolerates a removed list and author-provided markup without a status element', () => {
    document.body.innerHTML = '<ul id="custom"><li>Match</li><li>Other</li></ul>';
    filterNestedList('match', 'custom');
    expect([...document.querySelectorAll('li')].map(el => el.style.display)).toEqual(['', 'none']);
    document.querySelector('ul')!.remove();
    expect(() => filterNestedList('match', 'custom')).not.toThrow();
  });

  it('renders names as text and escapes link attributes while retaining safe external-link attributes', () => {
    const name = '<img src=x onerror="bad()"> & \'quoted\'';
    const url = 'https://example.org/?q="<tag>"&label=\'x\'';
    document.body.innerHTML = createNestedContent([{ name, url }, { name }]);
    const link = document.querySelector('a')!;
    expect(link.textContent).toBe(name);
    expect(link.getAttribute('href')).toBe(url);
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.rel.split(' ')).toEqual(expect.arrayContaining(['noopener', 'noreferrer']));
    expect([...document.querySelectorAll('li')].map(el => el.textContent)).toEqual([name, name]);
    expect(document.querySelector('img, [onerror]')).toBeNull();
  });

  it.each([undefined, {}])('keeps fallback list IDs and label targets independent without randomUUID (%j)', crypto => {
    vi.stubGlobal('crypto', crypto);
    vi.spyOn(Date, 'now').mockReturnValue(123456);
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.123).mockReturnValueOnce(0.456);
    document.body.innerHTML = createNestedContent([{ name: 'First' }]) + createNestedContent([]);
    const lists = [...document.querySelectorAll('ul')];
    const inputs = [...document.querySelectorAll('input')];
    const labels = [...document.querySelectorAll('label')];
    expect(lists[0].id).not.toBe(lists[1].id);
    for (let index = 0; index < lists.length; index++) {
      expect(labels[index].control).toBe(inputs[index]);
      expect(inputs[index].getAttribute('oninput')).toContain(`'${lists[index].id}'`);
    }
    expect([...document.querySelectorAll('[role="status"]')].map(el => el.textContent)).toEqual(['1 result', '0 results']);
  });

  it('installs a reusable filtering callback without replacing other runtime extensions', () => {
    const runtime = { extension: vi.fn() };
    vi.stubGlobal('GeneTooltipRuntime', runtime);
    installNestedListFilter();
    installNestedListFilter();
    expect((window as any).GeneTooltipRuntime).toBe(runtime);
    expect((window as any).GeneTooltipRuntime.extension).toBe(runtime.extension);
    document.body.innerHTML = createNestedContent([{ name: 'Match' }, { name: 'Other' }]);
    const list = document.querySelector('ul')!;
    (window as any).GeneTooltipRuntime.filterNestedList('match', list.id);
    expect([...list.children].map(el => (el as HTMLElement).style.display)).toEqual(['', 'none']);
  });

  it('allows runtime setup in an environment without window', () => {
    vi.stubGlobal('window', undefined);
    expect(() => installNestedListFilter()).not.toThrow();
  });
});

describe('section background lookup', () => {
  it('uses the first section within the supplied tooltip root', () => {
    document.body.innerHTML = `
      <div class="gene-tooltip-section-container" style="background-color: red"></div>
      <div id="root"><div class="gene-tooltip-section-container" style="background-color: rgb(1, 2, 3)"></div></div>`;
    const instance = { root: document.getElementById('root')! } as TooltipController;
    expect(getSectionBackgroundColor(instance)).toBe('rgb(1, 2, 3)');
  });

  it('returns null when the tooltip has no section yet', () => {
    expect(getSectionBackgroundColor({ root: document.createElement('div') } as TooltipController)).toBeNull();
  });
});
