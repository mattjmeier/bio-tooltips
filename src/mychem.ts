import { createTooltipEngine } from './core/engine.js';
import { mergeConfig, type MyChemTooltipConfig } from './providers/mychem/config.js';
import { findChemicalElements } from './providers/mychem/parser.js';
import { myChemProfile } from './providers/mychem/profile.js';
import { clear as clearTooltipCache, size as getTooltipCacheSize } from './core/cache.js';
import type { TooltipHandle } from './core/tooltip-handle.js';

export type {
  FixedPlacement,
  SectionVariant,
  TooltipOptions,
  TooltipPlacementOptions,
  TooltipPresentation,
  TooltipTriggerStyle,
  TooltipTriggerStylePreset,
  TooltipTimingEvent,
  TooltipTimingObserver,
} from './core/config.js';
export type { TooltipHandle, TooltipOpenOptions } from './core/tooltip-handle.js';

const chemicalTooltipEngine = createTooltipEngine({
  profile: myChemProfile,
  mergeConfig,
  findElements: findChemicalElements,
});

export function init(userConfig: Partial<MyChemTooltipConfig> = {}): () => void {
  return chemicalTooltipEngine.init(userConfig);
}

/** Attach a ChemicalTooltip to one element without querying the document. */
export function attach(
  anchor: HTMLElement,
  userConfig: Partial<MyChemTooltipConfig> = {}
): TooltipHandle {
  return chemicalTooltipEngine.attach(anchor, userConfig);
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
  attach,
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
  (window as any).ChemicalTooltip.attach = attach;
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
      attach: (anchor: HTMLElement, userConfig?: Partial<MyChemTooltipConfig>) => TooltipHandle;
      preload: () => Promise<unknown>;
      whenPrefetchReady: () => Promise<void>;
      clearCache: () => void;
      cacheSize: () => number;
    };
  }
}
