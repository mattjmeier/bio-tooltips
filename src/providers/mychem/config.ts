import type { CoreTooltipConfig } from '../../core/config.js';
import { defaultCoreConfig } from '../../core/config.js';

export type MyChemSectionVisibility = boolean | 'expanded' | 'collapsed';

export interface MyChemDisplayConfig {
  identity: MyChemSectionVisibility;
  structureProperties: MyChemSectionVisibility;
  detailedProperties: MyChemSectionVisibility;
  summary: MyChemSectionVisibility;
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
