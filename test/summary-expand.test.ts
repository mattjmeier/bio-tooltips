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
    // Mirror production markup: the copy button is an inline SVG icon rendered
    // at the end of the summary text, inside the paragraph.
    document.body.innerHTML = `
      <div data-gt-tooltip-root>
        <div class="gene-tooltip-section-container">
          <p class="gene-tooltip-summary">A long biological summary<span id="summary-copy-test" class="gt-summary-copy-btn" role="button" tabindex="0" aria-label="Copy summary"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 16 16"><path d="M4 2h8v8H4z"/></svg></span></p>
        </div>
      </div>
    `;
  });

  it('announces both expansion and collapse so the controller can reposition', () => {
    const summary = document.querySelector<HTMLElement>('.gene-tooltip-summary')!;
    const onResize = vi.fn();
    document.querySelector('[data-gt-tooltip-root]')!.addEventListener('gt:content-resize', onResize);

    summary.click();
    expect(summary.classList.contains('expanded')).toBe(true);

    summary.click();
    expect(summary.classList.contains('expanded')).toBe(false);
    expect(onResize).toHaveBeenCalledTimes(2);
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

  it('copies the full summary text when the button span is clicked directly', () => {
    const copy = document.querySelector<HTMLElement>('#summary-copy-test')!;

    copy.click();

    expect(writeText).toHaveBeenCalledWith('A long biological summary');
  });

  it('copies the summary text from keyboard activation', () => {
    const copy = document.querySelector<HTMLElement>('#summary-copy-test')!;

    copy.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

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
