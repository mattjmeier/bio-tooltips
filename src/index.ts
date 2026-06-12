import { type GeneTooltipConfig, mergeConfig } from './config.js';
import { findGeneElements } from './parser.js';
import { createTooltipEngine } from './core/engine.js';
import { myGeneProfile } from './providers/mygene/profile.js';

const geneTooltipEngine = createTooltipEngine({
  profile: myGeneProfile,
  mergeConfig,
  findElements: findGeneElements,
});

function init(userConfig: Partial<GeneTooltipConfig> = {}): () => void {
  return geneTooltipEngine.init(userConfig);
}

/**
 * Preloads the optional heavy dependencies (d3, ideogram) so they
 * are ready when tooltips are first shown.
 */
function preload(): Promise<unknown> {
  return geneTooltipEngine.preload();
}

function filterNestedList(query: string, listId: string): void {
  const list = document.getElementById(listId);
  if (!list) return;

  const items = list.getElementsByTagName('li');
  const normalizedQuery = query.toLowerCase();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const text = item.textContent || '';
    if (text.toLowerCase().includes(normalizedQuery)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  }
}

// Attach it to the window object so the inline oninput handler can find it.
// We do this inside an if-check to avoid errors in non-browser environments (like testing).
if (typeof window !== 'undefined') {
  if (!(window as any).GeneTooltip) {
    (window as any).GeneTooltip = {};
  }
  (window as any).GeneTooltip.filterNestedList = filterNestedList;
}

export default {
  init,
  preload,
};

declare global {
  interface Window {
    GeneTooltip: {
      init: (userConfig?: Partial<GeneTooltipConfig>) => void;
      preload: () => Promise<unknown>;
      filterNestedList: (query: string, listId: string) => void;
    };
  }
}
