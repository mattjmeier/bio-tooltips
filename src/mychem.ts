import { createTooltipEngine } from './core/engine.js';
import { mergeConfig, type MyChemTooltipConfig } from './providers/mychem/config.js';
import { findChemicalElements } from './providers/mychem/parser.js';
import { myChemProfile } from './providers/mychem/profile.js';
import { clear as clearTooltipCache, size as getTooltipCacheSize } from './core/cache.js';

export type {
  FixedPlacement,
  SectionVariant,
  TooltipOptions,
  TooltipPlacementOptions,
  TooltipTimingEvent,
  TooltipTimingObserver,
} from './core/config.js';

const chemicalTooltipEngine = createTooltipEngine({
  profile: myChemProfile,
  mergeConfig,
  findElements: findChemicalElements,
});

export function init(userConfig: Partial<MyChemTooltipConfig> = {}): () => void {
  return chemicalTooltipEngine.init(userConfig);
}

export function preload(): Promise<unknown> {
  return chemicalTooltipEngine.preload();
}

export function whenPrefetchReady(): Promise<void> {
  return chemicalTooltipEngine.whenPrefetchReady();
}

export function clearCache(): void {
  clearTooltipCache();
}

export function cacheSize(): number {
  return getTooltipCacheSize();
}

export const ChemicalTooltip = {
  init,
  preload,
  whenPrefetchReady,
  clearCache,
  cacheSize,
};

if (typeof window !== 'undefined') {
  if (!(window as any).ChemicalTooltip) {
    (window as any).ChemicalTooltip = {};
  }
  (window as any).ChemicalTooltip.init = init;
  (window as any).ChemicalTooltip.preload = preload;
  (window as any).ChemicalTooltip.whenPrefetchReady = whenPrefetchReady;
  (window as any).ChemicalTooltip.clearCache = clearCache;
  (window as any).ChemicalTooltip.cacheSize = cacheSize;
}

export * from './providers/mychem/index.js';
export default ChemicalTooltip;

declare global {
  interface Window {
    ChemicalTooltip: {
      init: (userConfig?: Partial<MyChemTooltipConfig>) => void;
      preload: () => Promise<unknown>;
      whenPrefetchReady: () => Promise<void>;
      clearCache: () => void;
      cacheSize: () => number;
    };
  }
}
