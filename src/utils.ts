import type { Instance } from 'tippy.js';

// Generate a unique ID for each tooltip instance
export function generateUniqueTooltipId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `tooltip-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function escapeHTML(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value: unknown): string {
  return escapeHTML(value);
}

export function filterNestedList(query: string, listId: string): void {
  const list = document.getElementById(listId);
  if (!list) return;

  const items = list.getElementsByTagName('li');
  const normalizedQuery = query.toLowerCase();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const text = item.textContent || '';
    item.style.display = text.toLowerCase().includes(normalizedQuery) ? '' : 'none';
  }
}

export function installNestedListFilter(): void {
  if (typeof window === 'undefined') return;

  const tooltipNamespace = ((window as any).GeneTooltipRuntime ??= {});
  tooltipNamespace.filterNestedList = filterNestedList;
}

// Helper to create list items with a search box
export function createNestedContent(items: { name: string; url?: string }[]): string {
  const listId = `nested-list-${generateUniqueTooltipId()}`;
  
  const listItems = items
    .map(item => item.url
      ? `<li><a href="${escapeAttr(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.name)}</a></li>`
      : `<li>${escapeHTML(item.name)}</li>`)
    .join('');

  // The 'oninput' handler directly calls our filtering function, passing the input's value and the target list's ID.
  return `
    <div class="gene-tooltip-nested-container">
      <input 
        type="search" 
        class="gene-tooltip-nested-search" 
        placeholder="Filter..." 
        oninput="window.GeneTooltipRuntime.filterNestedList(this.value, '${listId}')"
      />
      <ul id="${listId}" class="gene-tooltip-nested-list">${listItems}</ul>
    </div>
  `;
}

/**
 * Gets the computed background color from a Tippy instance's popper.
 * @param instance The Tippy instance to inspect.
 * @returns The background color string (e.g., 'rgb(255, 255, 255)') or null if not found.
 */
export function getSectionBackgroundColor(instance: Instance): string | null {
  const section = instance.popper.querySelector<HTMLElement>('.gene-tooltip-section-container');
  if (section) {
    return window.getComputedStyle(section).backgroundColor;
  }
  return null;
}
