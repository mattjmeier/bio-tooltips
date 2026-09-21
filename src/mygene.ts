import { createTooltipEngine } from './core/engine.js';
import { mergeConfig, type GeneTooltipConfig } from './providers/mygene/config.js';
import { findGeneElements } from './providers/mygene/parser.js';
import { myGeneProfile } from './providers/mygene/profile.js';
import { filterNestedList } from './utils.js';
import { clear as clearTooltipCache, size as getTooltipCacheSize } from './core/cache.js';
import type { TooltipHandle } from './core/tooltip-handle.js';

export { filterNestedList };
export type {
  FixedPlacement,
  SectionVariant,
  TooltipOptions,
  TooltipPlacementOptions,
  TooltipPresentation,
  TooltipTimingEvent,
  TooltipTimingObserver,
} from './core/config.js';
export type { TooltipHandle, TooltipOpenOptions } from './core/tooltip-handle.js';

const geneTooltipEngine = createTooltipEngine({
  profile: myGeneProfile,
  mergeConfig,
  findElements: findGeneElements,
});

export function init(userConfig: Partial<GeneTooltipConfig> = {}): () => void {
  return geneTooltipEngine.init(userConfig);
}

/** Attach a GeneTooltip to one element without querying the document. */
export function attach(
  anchor: HTMLElement,
  userConfig: Partial<GeneTooltipConfig> = {}
): TooltipHandle {
  return geneTooltipEngine.attach(anchor, userConfig);
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
  attach,
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
  (window as any).GeneTooltip.attach = attach;
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
      attach: (anchor: HTMLElement, userConfig?: Partial<GeneTooltipConfig>) => TooltipHandle;
      preload: () => Promise<unknown>;
      whenPrefetchReady: () => Promise<void>;
      clearCache: () => void;
      cacheSize: () => number;
      filterNestedList: (query: string, listId: string) => void;
    };
  }
}
