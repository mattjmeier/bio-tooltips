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
    }
  };

  // --- Click Handler ---
  document.addEventListener("click", e => {
    handleSummaryToggle(e.target as HTMLElement);
  });

  // --- Keyboard Handler ---
  document.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      const target = e.target as HTMLElement;
      // Also update the keyboard handler to allow expanding via text focus
      if (target.matches('[id^="summary-more-"]') || target.matches('[id^="summary-less-"]') || target.matches('.gene-tooltip-summary')) {
        e.preventDefault();
        handleSummaryToggle(target);
      }
    }
  });
}
