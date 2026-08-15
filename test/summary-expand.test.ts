import { beforeEach, describe, expect, it, vi } from 'vitest';
import { enableSummaryExpand } from '../src/ui/summaryExpand';

describe('summary expansion', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-gt-tooltip-root>
        <div class="gene-tooltip-section-container">
          <p class="gene-tooltip-summary">A long biological summary</p>
          <span id="summary-less-test">Show less</span>
        </div>
      </div>
    `;
  });

  it('announces both expansion and collapse so the controller can reposition', () => {
    enableSummaryExpand();
    const summary = document.querySelector<HTMLElement>('.gene-tooltip-summary')!;
    const onResize = vi.fn();
    document.querySelector('[data-gt-tooltip-root]')!.addEventListener('gt:content-resize', onResize);

    summary.click();
    expect(summary.classList.contains('expanded')).toBe(true);

    summary.click();
    expect(summary.classList.contains('expanded')).toBe(false);
    expect(onResize).toHaveBeenCalledTimes(2);
  });
});
