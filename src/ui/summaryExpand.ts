/**
 * Copies the full text of the summary paragraph that owns the given copy button.
 * Truncation is CSS-only, so `textContent` always holds the complete value. The
 * button is rendered inside the paragraph, so it is stripped from a clone before
 * reading text to keep its markup out of the copied value.
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

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for non-secure contexts where the async clipboard API is unavailable.
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
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
