import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  generateUniqueId, renderCloseButton, renderListContent, renderParagraphContent,
  renderSummaryActions, renderTooltipShell,
} from '../src/core/renderer';
import { enableSummaryExpand } from '../src/ui/summaryExpand';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('core content rendering', () => {
  it.each([
    { kind: 'paragraph', render: renderParagraphContent },
    { kind: 'list', render: renderListContent },
  ])('handles empty, truncated, and complete $kind content without changing input', ({ render }) => {
    const items = [{ name: 'One', url: 'https://example.org/one' }, { name: 'Two', url: 'https://example.org/two' }];
    expect(render([], 1, 'more')).toBe('');
    document.body.innerHTML = render(items, 1, 'more');
    const link = document.querySelector('a')!;
    expect(link.textContent?.trim()).toBe('One');
    expect(link.getAttribute('href')).toBe(items[0].url);
    expect(link.rel).toContain('noopener');
    expect(document.querySelector('button')?.textContent?.trim()).toBe('... and 1 more');
    expect(document.querySelector('button')?.type).toBe('button');
    expect(document.querySelector('button')?.id).toBe('more');
    document.body.innerHTML = render(items, 2, 'more');
    expect(document.querySelectorAll('a')).toHaveLength(2);
    expect(document.querySelector('button')).toBeNull();
    document.body.innerHTML = render(items, 0, 'more');
    expect(document.querySelector('a')).toBeNull();
    expect(document.querySelector('button')?.textContent?.trim()).toBe('... and 2 more');
    expect(items.map(item => item.name)).toEqual(['One', 'Two']);
  });

  it('renders expanded summary actions that control the matching summary and collapse correctly', () => {
    document.body.innerHTML = `<div class="gt-summary-section">
      <p id="summary-text-test" class="gene-tooltip-summary expanded">Summary</p>
      ${renderSummaryActions('test', true)}</div>`;
    const release = enableSummaryExpand();
    try {
      const toggle = document.querySelector<HTMLButtonElement>('.gt-summary-toggle')!;
      expect(toggle.getAttribute('aria-controls')).toBe('summary-text-test');
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(toggle.textContent).toBe('Show less');
      expect(document.querySelector('[role="status"]')?.getAttribute('aria-live')).toBe('polite');
      toggle.click();
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(document.querySelector('p')?.classList.contains('expanded')).toBe(false);
    } finally { release(); }
  });

  it('escapes custom close labels as a single accessible attribute', () => {
    const label = 'Close "details" & <return>';
    document.body.innerHTML = renderCloseButton(label);
    const button = document.querySelector('button')!;
    expect(button.getAttribute('aria-label')).toBe(label);
    expect(button.textContent).toBe('×');
    expect(button.type).toBe('button');
    expect(button.querySelector('*')).toBeNull();
  });

  it.each([undefined, {}])('generates distinct fallback shell IDs without randomUUID (%j)', crypto => {
    vi.stubGlobal('crypto', crypto);
    vi.spyOn(Date, 'now').mockReturnValue(1234);
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.123).mockReturnValueOnce(0.456);
    const first = generateUniqueId();
    const second = generateUniqueId();
    expect(first).not.toBe(second);
    document.body.innerHTML = renderTooltipShell(first, '<p>First</p>') + renderTooltipShell(second, '<p>Second</p>', 'dividers');
    const shells = document.querySelectorAll<HTMLElement>('[data-tooltip-id]');
    expect([...shells].map(el => el.dataset.tooltipId)).toEqual([first, second]);
    expect([...shells].map(el => el.dataset.sectionVariant)).toEqual(['cards', 'dividers']);
  });
});
