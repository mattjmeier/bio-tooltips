import { createTooltipEngine } from './core/engine.js';
import { mergeConfig, type MyChemTooltipConfig } from './providers/mychem/config.js';
import { findChemicalElements } from './providers/mychem/parser.js';
import { myChemProfile } from './providers/mychem/profile.js';

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

export const ChemicalTooltip = {
  init,
  preload,
};

if (typeof window !== 'undefined') {
  if (!(window as any).ChemicalTooltip) {
    (window as any).ChemicalTooltip = {};
  }
  (window as any).ChemicalTooltip.init = init;
  (window as any).ChemicalTooltip.preload = preload;
}

export * from './providers/mychem/index.js';
export default ChemicalTooltip;

declare global {
  interface Window {
    ChemicalTooltip: {
      init: (userConfig?: Partial<MyChemTooltipConfig>) => void;
      preload: () => Promise<unknown>;
    };
  }
}
