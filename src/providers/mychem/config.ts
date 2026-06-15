import type { CoreTooltipConfig } from '../../core/config.js';
import { defaultCoreConfig } from '../../core/config.js';
import type { MyChemInfoResult } from './types.js';

export type MyChemSectionVisibility = boolean | 'expanded' | 'collapsed';

export interface MyChemStructureRenderContext {
  structure: { kind: 'cid' | 'smiles' | 'inchi'; value: string };
  smiles?: string;
  data: MyChemInfoResult;
  alt: string;
}

export type MyChemStructureRenderer = (
  context: MyChemStructureRenderContext
) => string | null | undefined;

export interface MyChemDisplayConfig {
  identity: MyChemSectionVisibility;
  structureProperties: MyChemSectionVisibility;
  detailedProperties: MyChemSectionVisibility;
  summary: MyChemSectionVisibility;
  synonyms: MyChemSectionVisibility;
  classes: MyChemSectionVisibility;
  pharmacology: MyChemSectionVisibility;
  regulatory: MyChemSectionVisibility;
  safety: MyChemSectionVisibility;
  identifiers: MyChemSectionVisibility;
  footer: boolean;
  rawJson: boolean;
  sourcePaths: boolean;
  collapsible?: boolean;
  collapsedByDefault?: boolean;
}

export interface MyChemTooltipConfig extends CoreTooltipConfig {
  api: 'mychem';
  truncateSummary: number;
  synonymCount: number;
  listCount: number;
  display: Partial<MyChemDisplayConfig>;
  structureRenderer?: MyChemStructureRenderer;
}

export const defaultMyChemConfig: MyChemTooltipConfig = {
  ...defaultCoreConfig,
  api: 'mychem',
  selector: '.chemical-tooltip',
  tooltipWidth: 430,
  truncateSummary: 4,
  synonymCount: 6,
  listCount: 5,
  display: {
    identity: 'expanded',
    structureProperties: 'expanded',
    detailedProperties: true,
    summary: 'expanded',
    synonyms: 'expanded',
    classes: true,
    pharmacology: true,
    regulatory: true,
    safety: true,
    identifiers: true,
    footer: true,
    rawJson: false,
    sourcePaths: false,
    collapsible: true,
    collapsedByDefault: true,
  },
};

export function mergeConfig(userConfig: Partial<MyChemTooltipConfig> = {}): MyChemTooltipConfig {
  return {
    ...defaultMyChemConfig,
    ...userConfig,
    display: {
      ...defaultMyChemConfig.display,
      ...userConfig.display,
    },
    tippyOptions: { ...defaultMyChemConfig.tippyOptions, ...userConfig.tippyOptions },
    nestedTippyOptions: {
      ...defaultMyChemConfig.nestedTippyOptions,
      ...userConfig.nestedTippyOptions,
    },
  };
}
