import { createTooltipEngine } from './core/engine.js';
import { mergeConfig, type GeneTooltipConfig } from './providers/mygene/config.js';
import { findGeneElements } from './providers/mygene/parser.js';
import { myGeneProfile } from './providers/mygene/profile.js';
import { filterNestedList } from './utils.js';
import { clear as clearTooltipCache, size as getTooltipCacheSize } from './core/cache.js';

export { filterNestedList };
export type {
  SectionVariant,
  TooltipTimingEvent,
  TooltipTimingObserver,
} from './core/config.js';

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

export function whenPrefetchReady(): Promise<void> {
  return geneTooltipEngine.whenPrefetchReady();
}

export function clearCache(): void {
  clearTooltipCache();
}

export function cacheSize(): number {
  return getTooltipCacheSize();
}

export const GeneTooltip = {
  init,
  preload,
  whenPrefetchReady,
  clearCache,
  cacheSize,
  filterNestedList,
};

if (typeof window !== 'undefined') {
  if (!(window as any).GeneTooltip) {
    (window as any).GeneTooltip = {};
  }
  (window as any).GeneTooltip.init = init;
  (window as any).GeneTooltip.preload = preload;
  (window as any).GeneTooltip.whenPrefetchReady = whenPrefetchReady;
  (window as any).GeneTooltip.clearCache = clearCache;
  (window as any).GeneTooltip.cacheSize = cacheSize;
  (window as any).GeneTooltip.filterNestedList = filterNestedList;
}

export * from './providers/mygene/index.js';
export default GeneTooltip;

declare global {
  interface Window {
    GeneTooltip: {
      init: (userConfig?: Partial<GeneTooltipConfig>) => void;
      preload: () => Promise<unknown>;
      whenPrefetchReady: () => Promise<void>;
      clearCache: () => void;
      cacheSize: () => number;
      filterNestedList: (query: string, listId: string) => void;
    };
  }
}
