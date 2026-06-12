import type { EntityRef } from '../../core/types.js';
import { findSpecies } from '../../constants.js';

export interface GeneInfo {
  symbol: string;
  taxid: number;
}

export function findGeneElements(selector: string): HTMLElement[] {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
  const finalElements: HTMLElement[] = [];
  const listDelimiterRegex = /[,\s;]+/;

  elements.forEach(el => {
    const textContent = el.textContent || '';
    const geneSymbols = textContent.trim().split(listDelimiterRegex).filter(Boolean);

    if (geneSymbols.length > 1) {
      const species = el.dataset.species;
      if (!species) {
        console.warn('Gene list container found without a data-species attribute. Skipping.', el);
        return;
      }

      el.innerHTML = '';

      geneSymbols.forEach((symbol, index) => {
        const newSpan = document.createElement('span');
        newSpan.textContent = symbol;
        newSpan.dataset.species = species;

        const className = selector.startsWith('.') ? selector.substring(1) : selector;
        newSpan.classList.add(className);

        el.appendChild(newSpan);
        finalElements.push(newSpan);

        if (index < geneSymbols.length - 1) {
          el.appendChild(document.createTextNode(', '));
        }
      });
    } else if (geneSymbols.length === 1) {
      el.textContent = geneSymbols[0];
      finalElements.push(el);
    }
  });

  return finalElements;
}

export function getGeneInfoFromElement(el: HTMLElement): GeneInfo | null {
  const symbol = el.textContent?.trim();
  const speciesIdentifier = el.dataset.species;

  if (!symbol || !speciesIdentifier) {
    return null;
  }

  const speciesData = findSpecies(speciesIdentifier);
  if (!speciesData) {
    console.warn(`[GeneTooltip] Unknown species identifier: "${speciesIdentifier}"`, el);
    return null;
  }

  return { symbol, taxid: speciesData.taxid };
}

export function parseGeneElement(el: HTMLElement): EntityRef | null {
  const info = getGeneInfoFromElement(el);
  if (!info) return null;

  return {
    query: info.symbol,
    context: {
      taxid: info.taxid,
    },
  };
}
