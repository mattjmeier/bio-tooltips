import type { EntityRef } from '../../core/types.js';
import { normalizeMyChemLookupMode, normalizeMyChemScope } from './client.js';

export function findChemicalElements(selector: string): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(selector));
}

export function parseChemicalElement(el: HTMLElement): EntityRef | null {
  const scope = normalizeMyChemScope(el.dataset.scope);
  const query = el.dataset.query?.trim() || el.textContent?.trim();
  if (!query) return null;

  return {
    query,
    context: {
      lookup: normalizeMyChemLookupMode(el.dataset.lookup, scope),
      scope,
    },
  };
}
