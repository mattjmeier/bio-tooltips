import type { EntityRef } from '../../core/types.js';
import { normalizeMyChemScope } from './client.js';

export function findChemicalElements(selector: string): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(selector));
}

export function parseChemicalElement(el: HTMLElement): EntityRef | null {
  const query = el.textContent?.trim();
  if (!query) return null;

  return {
    query,
    context: {
      scope: normalizeMyChemScope(el.dataset.scope),
    },
  };
}
