const COPY_SUCCESS_DURATION_MS = 2000;

// Bootstrap `bi-check` icon path. It shares the copy icon's `0 0 16 16` viewBox,
// so it can replace the copy `<path>` in place without changing the SVG geometry.
const CHECKMARK_PATH =
  'M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z';

// Per-button success state so a rapid re-click restarts the countdown instead of
// stacking timers, and the original icon can be restored exactly.
interface CopySuccessState {
  timer: number;
  originalD: string;
  originalFillRule: string | null;
}

const copySuccessStates = new WeakMap<HTMLElement, CopySuccessState>();

/**
 * Copies the full text of the summary paragraph that owns the given copy button.
 * Truncation is CSS-only, so `textContent` always holds the complete value. The
 * button is rendered inside the paragraph, so it is stripped from a clone before
 * reading text to keep its markup out of the copied value. On success the copy
 * icon briefly swaps to a checkmark so the user can tell the copy went through.
 */
async function copySummaryText(button: HTMLElement): Promise<void> {
  const summaryP = button
    .closest('.gene-tooltip-section-container')
    ?.querySelector<HTMLElement>('.gene-tooltip-summary');
  if (!summaryP) return;

  const clone = summaryP.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.gt-summary-copy-btn').forEach(node => node.remove());

  const text = clone.textContent?.trim();
  if (!text) return;

  let copied = false;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      copied = false;
    }
  } else {
    // Fallback for non-secure contexts where the async clipboard API is unavailable.
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    copied = document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  if (copied) flashCopySuccess(button);
}

/**
 * Briefly swaps the copy icon for a checkmark to confirm the copy succeeded, then
 * restores the original icon. Re-invoking while already shown just extends the
 * countdown rather than resetting the icon.
 */
function flashCopySuccess(button: HTMLElement): void {
  const path = button.querySelector('svg path');
  if (!path) return;

  const existing = copySuccessStates.get(button);
  if (existing) {
    window.clearTimeout(existing.timer);
    existing.timer = window.setTimeout(
      () => revertCopyIcon(button, existing),
      COPY_SUCCESS_DURATION_MS
    );
    return;
  }

  const state: CopySuccessState = {
    timer: 0,
    originalD: path.getAttribute('d') ?? '',
    originalFillRule: path.getAttribute('fill-rule'),
  };
  path.setAttribute('d', CHECKMARK_PATH);
  if (state.originalFillRule !== null) path.removeAttribute('fill-rule');
  button.classList.add('gt-summary-copy-btn--success');

  state.timer = window.setTimeout(
    () => revertCopyIcon(button, state),
    COPY_SUCCESS_DURATION_MS
  );
  copySuccessStates.set(button, state);
}

function revertCopyIcon(button: HTMLElement, state: CopySuccessState): void {
  const path = button.querySelector('svg path');
  if (path) {
    path.setAttribute('d', state.originalD);
    if (state.originalFillRule !== null) path.setAttribute('fill-rule', state.originalFillRule);
  }
  button.classList.remove('gt-summary-copy-btn--success');
  copySuccessStates.delete(button);
}

/**
 * Enables click/keyboard expand/collapse for summary sections in Bio Tooltips.
 * It listens for events on the document and targets the specific 'Show more' button.
 */
export function enableSummaryExpand(): void {
  const handleSummaryToggle = (target: HTMLElement) => {
    let summaryP: HTMLElement | null = null;
    let shouldExpand: boolean | null = null;

    // Case 1: Clicked "Show more"
    if (target.matches('[id^="summary-more-"]')) {
      summaryP = target.previousElementSibling as HTMLElement;
      shouldExpand = true;
    }
    // Case 2: Clicked "Show less"
    else if (target.matches('[id^="summary-less-"]')) {
      summaryP = target.closest('.gene-tooltip-section-container')?.querySelector('.gene-tooltip-summary') as HTMLElement;
      shouldExpand = false;
    }

    // Case 3: Clicked the truncated summary paragraph itself
    else if (target.matches('.gene-tooltip-summary:not(.expanded)')) {
      summaryP = target;
      shouldExpand = true; // Tell it to expand
    }
    // Case 4: Clicked the expanded summary paragraph itself
    else if (target.matches('.gene-tooltip-summary.expanded')) {
      summaryP = target;
      shouldExpand = false;
    }
    
    // If a relevant element was clicked, perform the action
    if (summaryP && shouldExpand !== null) {
      summaryP.classList.toggle('expanded', shouldExpand);
      summaryP.dispatchEvent(new CustomEvent('gt:content-resize', { bubbles: true }));
    }
  };

  // --- Click Handler ---
  document.addEventListener("click", e => {
    const target = e.target as HTMLElement;
    // The copy button wraps an inline SVG, so a click lands on the icon rather
    // than the span itself; walk up with closest() to still resolve the button.
    const copyBtn = target.closest<HTMLElement>('[id^="summary-copy-"]');
    if (copyBtn) {
      void copySummaryText(copyBtn);
      return;
    }
    handleSummaryToggle(target);
  });

  // --- Keyboard Handler ---
  document.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      const target = e.target as HTMLElement;
      const copyBtn = target.closest<HTMLElement>('[id^="summary-copy-"]');
      if (copyBtn) {
        e.preventDefault();
        void copySummaryText(copyBtn);
        return;
      }
      // Also update the keyboard handler to allow expanding via text focus
      if (target.matches('[id^="summary-more-"]') || target.matches('[id^="summary-less-"]') || target.matches('.gene-tooltip-summary')) {
        e.preventDefault();
        handleSummaryToggle(target);
      }
    }
  });
}
