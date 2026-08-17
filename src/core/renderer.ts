import type { SectionVariant } from './config.js';

export type FormattedItem = { name: string; url?: string };

export const loaderHTML = `<div class="gt-loader-container"><div class="gt-spinner"></div><span>Loading...</span></div>`;

export function generateUniqueId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Wraps provider content in the standard shell markup (data attributes only).
 * Geometry and vertical scrolling are owned by the tooltip shell — the
 * positioning `size` middleware sets `max-width` on the box and `max-height`
 * on the content, and `.gt-tooltip-content` CSS provides `overflow-y`. No
 * inline sizing is applied here, so the inner wrapper never becomes a second
 * scroll container.
 */
export function renderTooltipShell(
  uniqueId: string,
  innerHTML: string,
  sectionVariant: SectionVariant = 'cards'
): string {
  const resolvedSectionVariant = sectionVariant === 'dividers' ? 'dividers' : 'cards';

  return `
    <div class="gene-tooltip-content" data-tooltip-id="${uniqueId}" data-section-variant="${resolvedSectionVariant}">
      ${innerHTML}
    </div>
  `;
}

export function renderTooltipHeader(titleHTML: string, actionHTML: string = ''): string {
  return `
      <div class="gene-tooltip-header">
        <div class="gene-tooltip-title">
          ${titleHTML}
        </div>
        ${actionHTML} 
      </div>
  `;
}

export function renderMoreButton(id: string, text: string): string {
  return `
    <span id="${id}" class="gene-tooltip-more-btn" role="button" tabindex="0">
      ${text}
    </span>
  `;
}

export function renderCollapseButton(id: string, text: string): string {
  return renderMoreButton(id, text);
}

/**
 * A small copy affordance for the summary. It is rendered inline at the end of
 * the `.gene-tooltip-summary` paragraph's text. The icon button carries no text
 * itself (accessibility is via aria-label/title); the click handler reads the
 * owning `.gene-tooltip-summary` paragraph's full text (truncation is CSS-only,
 * so `textContent` is always the complete value) after stripping the button. The
 * inline SVG follows the same convention as the pin button icon.
 */
export function renderSummaryCopyButton(uniqueId: string): string {
  return `
    <span id="summary-copy-${uniqueId}" class="gt-summary-copy-btn" role="button" tabindex="0" aria-label="Copy summary" title="Copy summary">
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg>
    </span>
  `;
}

export function renderParagraphContent(
  items: FormattedItem[],
  initialCount: number,
  moreButtonId: string
): string {
  if (!items || items.length === 0) {
    return '';
  }

  const visibleItems = items.slice(0, initialCount);
  const hiddenItemCount = items.length - initialCount;

  const itemLinks = visibleItems
    .map(item => `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}</a>`)
    .join(', ');

  const moreButton = hiddenItemCount > 0
    ? renderMoreButton(moreButtonId, `... and ${hiddenItemCount} more`)
    : '';

  return `
    <p class="gene-tooltip-p-content">
      ${itemLinks}${hiddenItemCount > 0 ? ',' : ''} ${moreButton}
    </p>
  `;
}

export function renderListContent(
  items: FormattedItem[],
  initialCount: number,
  moreButtonId: string
): string {
  if (!items || items.length === 0) {
    return '';
  }

  const visibleItems = items.slice(0, initialCount);
  const hiddenItemCount = items.length - initialCount;

  const itemLinks = visibleItems.map(item =>
    `<li>
       <a href="${item.url}" target="_blank" rel="noopener noreferrer" title="${item.name}">
          ${item.name}
       </a>
     </li>`
  ).join('');

  const moreButton = hiddenItemCount > 0
    ? renderMoreButton(moreButtonId, `... and ${hiddenItemCount} more`)
    : '';

  return `
    <div class="gene-tooltip-list-wrapper">
      <ul class="gene-tooltip-list-section">${itemLinks}</ul>
      ${moreButton}
    </div>
  `;
}
