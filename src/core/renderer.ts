export type FormattedItem = { name: string; url: string };

export const loaderHTML = `<div class="gt-loader-container"><div class="gt-spinner"></div><span>Loading...</span></div>`;

export function generateUniqueId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function renderTooltipShell(
  uniqueId: string,
  innerHTML: string,
  inlineStyle: string = ''
): string {
  return `
    <div class="gene-tooltip-content" ${inlineStyle} data-tooltip-id="${uniqueId}">
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
