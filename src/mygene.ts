import { createTooltipEngine } from './core/engine.js';
import { mergeConfig, type GeneTooltipConfig } from './providers/mygene/config.js';
import { findGeneElements } from './providers/mygene/parser.js';
import { myGeneProfile } from './providers/mygene/profile.js';
import { filterNestedList } from './utils.js';

export { filterNestedList };

const geneTooltipEngine = createTooltipEngine({
  profile: myGeneProfile,
  mergeConfig,
  findElements: findGeneElements,
});

export function init(userConfig: Partial<GeneTooltipConfig> = {}): () => void {
  return geneTooltipEngine.init(userConfig);
}

/**
 * Preloads the optional heavy dependencies (d3, ideogram) so they
 * are ready when tooltips are first shown.
 */
export function preload(): Promise<unknown> {
  return geneTooltipEngine.preload();
}

export const GeneTooltip = {
  init,
  preload,
  filterNestedList,
};

if (typeof window !== 'undefined') {
  if (!(window as any).GeneTooltip) {
    (window as any).GeneTooltip = {};
  }
  (window as any).GeneTooltip.init = init;
  (window as any).GeneTooltip.preload = preload;
  (window as any).GeneTooltip.filterNestedList = filterNestedList;
}

export * from './providers/mygene/index.js';
export default GeneTooltip;

declare global {
  interface Window {
    GeneTooltip: {
      init: (userConfig?: Partial<GeneTooltipConfig>) => void;
      preload: () => Promise<unknown>;
      filterNestedList: (query: string, listId: string) => void;
    };
  }
}
