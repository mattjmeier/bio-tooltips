import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { enableSummaryExpand } from '../src/ui/summaryExpand';

describe('summary expansion', () => {
  const writeText = vi.fn().mockResolvedValue(undefined);

  beforeAll(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    // Document-level listeners are installed once; they read `e.target` at
    // dispatch time so an empty initial DOM is fine.
    enableSummaryExpand();
  });

  beforeEach(() => {
    writeText.mockClear();
    // Mirror production markup: explicit controls follow the summary text.
    document.body.innerHTML = `
      <div data-gt-tooltip-root>
        <div class="gene-tooltip-section-container">
          <div class="gt-summary-section">
            <p id="summary-text-test" class="gene-tooltip-summary">A long biological summary</p>
            <div class="gt-summary-actions">
              <button type="button" class="gt-summary-toggle" aria-expanded="false" aria-controls="summary-text-test">Show more</button>
              <button type="button" id="summary-copy-test" class="gt-summary-copy-btn" aria-label="Copy summary"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 16 16"><path d="M4 2h8v8H4z"/></svg></button>
              <span class="gt-copy-status" role="status" aria-live="polite"></span>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  it('uses the explicit toggle for expansion and collapse and announces both resizes', () => {
    const summary = document.querySelector<HTMLElement>('.gene-tooltip-summary')!;
    const toggle = document.querySelector<HTMLButtonElement>('.gt-summary-toggle')!;
    const onResize = vi.fn();
    document.querySelector('[data-gt-tooltip-root]')!.addEventListener('gt:content-resize', onResize);

    toggle.click();
    expect(summary.classList.contains('expanded')).toBe(true);
    expect(toggle.textContent).toBe('Show less');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    toggle.click();
    expect(summary.classList.contains('expanded')).toBe(false);
    expect(toggle.textContent).toBe('Show more');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(onResize).toHaveBeenCalledTimes(2);
  });

  it('leaves summary prose selectable and non-interactive', () => {
    const summary = document.querySelector<HTMLElement>('.gene-tooltip-summary')!;

    summary.click();

    expect(summary.classList.contains('expanded')).toBe(false);
  });

  it('copies the full summary text when the SVG icon is clicked, without toggling expansion', () => {
    // A real click lands on the inline SVG, not the button span, so this asserts
    // the handler resolves the button via closest() rather than a direct match.
    const icon = document.querySelector<SVGElement>('#summary-copy-test svg')!;
    const summary = document.querySelector<HTMLElement>('.gene-tooltip-summary')!;

    icon.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(writeText).toHaveBeenCalledWith('A long biological summary');
    expect(summary.classList.contains('expanded')).toBe(false);
  });

  it('copies the full summary text when the button is clicked directly', () => {
    const copy = document.querySelector<HTMLElement>('#summary-copy-test')!;

    copy.click();

    expect(writeText).toHaveBeenCalledWith('A long biological summary');
  });

  it('copies the summary text through native keyboard activation', () => {
    const copy = document.querySelector<HTMLElement>('#summary-copy-test')!;

    copy.click();

    expect(writeText).toHaveBeenCalledWith('A long biological summary');
  });

  it('swaps the copy icon to a checkmark on success, then restores it after 2s', async () => {
    vi.useFakeTimers();
    try {
      const copy = document.querySelector<HTMLElement>('#summary-copy-test')!;
      const path = copy.querySelector('svg path')!;
      const originalD = path.getAttribute('d')!;

      copy.click();
      // The icon swap happens on the microtask after the awaited clipboard write
      // resolves; flush those before asserting the checkmark is showing.
      await vi.advanceTimersByTimeAsync(0);

      expect(writeText).toHaveBeenCalledWith('A long biological summary');
      expect(path.getAttribute('d')).not.toBe(originalD);
      expect(copy.classList.contains('gt-summary-copy-btn--success')).toBe(true);

      await vi.advanceTimersByTimeAsync(2000);

      expect(path.getAttribute('d')).toBe(originalD);
      expect(copy.classList.contains('gt-summary-copy-btn--success')).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});
