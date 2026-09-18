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
let listenerUsers = 0;
let removeListeners: (() => void) | undefined;

/**
 * Copies the full text of the summary paragraph that owns the given copy button.
 * Truncation is CSS-only, so `textContent` always holds the complete value. On
 * success the copy icon briefly swaps to a checkmark for visible confirmation.
 */
export async function copyTextToClipboard(value: string, status?: HTMLElement): Promise<boolean> {
  let copied = false;
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(value); copied = true; } catch { copied = false; }
  } else {
    const previousFocus = document.activeElement as HTMLElement | null;
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute'; textarea.style.left = '-9999px';
    document.body.appendChild(textarea); textarea.select();
    try { copied = document.execCommand('copy'); } catch { copied = false; }
    textarea.remove();
    if (previousFocus?.isConnected) previousFocus.focus();
  }
  if (status) status.textContent = copied ? 'Copied' : 'Unable to copy';
  return copied;
}

async function copySummaryText(button: HTMLElement): Promise<void> {
  const summaryP = button
    .closest('.gene-tooltip-section-container')
    ?.querySelector<HTMLElement>('.gene-tooltip-summary');
  if (!summaryP) return;

  const text = summaryP.textContent?.trim();
  if (!text) return;

  const status = button.closest('.gene-tooltip-section-container')?.querySelector<HTMLElement>('.gt-copy-status') ?? undefined;
  const copied = await copyTextToClipboard(text, status);
  if (copied) {
    flashCopySuccess(button);
    if (status) status.textContent = 'Summary copied';
  } else if (status) {
    status.textContent = 'Unable to copy summary';
  }
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
export function enableSummaryExpand(): () => void {
  listenerUsers++;
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    if (--listenerUsers === 0) {
      removeListeners?.();
      removeListeners = undefined;
    }
  };
  if (listenerUsers > 1) return release;
  const handleSummaryToggle = (target: HTMLElement) => {
    let summaryP: HTMLElement | null = null;
    let shouldExpand: boolean | null = null;

    if (target.matches('.gt-summary-toggle')) {
      summaryP = target.closest('.gt-summary-section')?.querySelector('.gene-tooltip-summary') as HTMLElement;
      shouldExpand = target.getAttribute('aria-expanded') !== 'true';
    } else if (target.matches('[id^="summary-more-"]')) {
      summaryP = target.closest('.gt-summary-section')?.querySelector('.gene-tooltip-summary') as HTMLElement;
      shouldExpand = true;
    }
    // Case 2: Clicked "Show less"
    else if (target.matches('[id^="summary-less-"]')) {
      summaryP = target.closest('.gene-tooltip-section-container')?.querySelector('.gene-tooltip-summary') as HTMLElement;
      shouldExpand = false;
    }
    // If a relevant element was clicked, perform the action
    if (summaryP && shouldExpand !== null) {
      summaryP.classList.toggle('expanded', shouldExpand);
      const section = summaryP.closest('.gt-summary-section');
      const toggle = section?.querySelector<HTMLButtonElement>('.gt-summary-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', String(shouldExpand));
        toggle.textContent = shouldExpand ? 'Show less' : 'Show more';
      }
      summaryP.dispatchEvent(new CustomEvent('gt:content-resize', { bubbles: true }));
    }
  };

  // --- Click Handler ---
  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // The copy button wraps an inline SVG, so a click lands on the icon rather
    // than the span itself; walk up with closest() to still resolve the button.
    const copyBtn = target.closest<HTMLElement>('[id^="summary-copy-"]');
    if (copyBtn) {
      void copySummaryText(copyBtn);
      return;
    }
    const identifierCopy = target.closest<HTMLButtonElement>('.gt-chem-id-row [data-copy]');
    if (identifierCopy) {
      const identifierStatus = identifierCopy.parentElement?.querySelector<HTMLElement>('.gt-copy-status') ?? undefined;
      void copyTextToClipboard(identifierCopy.dataset.copy ?? '', identifierStatus);
      return;
    }
    handleSummaryToggle(target);
  };

  // Retain support for legacy author supplied role=button markup. Generated
  // controls are native buttons and receive their activation from the browser.
  const onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const target = e.target as HTMLElement;
    if (target instanceof HTMLButtonElement) return;
    const copyBtn = target.closest<HTMLElement>('[id^="summary-copy-"]');
    if (copyBtn) {
      e.preventDefault();
      void copySummaryText(copyBtn);
      return;
    }
    if (target.matches('[id^="summary-more-"], [id^="summary-less-"]')) {
      e.preventDefault();
      handleSummaryToggle(target);
    }
  };
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeydown);
  removeListeners = () => {
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKeydown);
  };
  return release;
}
