import { describe, expect, it } from 'vitest';
import { createNestedContent, filterNestedList } from '../src/utils';

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
});
