import type { CoreTooltipConfig } from '../../core/config.js';
import { defaultCoreConfig } from '../../core/config.js';

export type SectionVisibility = boolean | 'expanded' | 'collapsed';

export interface TooltipDisplayConfig {
  summary: SectionVisibility;
  species: boolean;
  location: SectionVisibility;
  ideogram: boolean;
  pathways: SectionVisibility;
  domains: SectionVisibility;
  geneTrack: SectionVisibility;
  transcripts: SectionVisibility;
  structures: SectionVisibility;
  generifs: SectionVisibility;
  linksSection: SectionVisibility;
  collapsible?: boolean;
  collapsedByDefault?: boolean;
  links: {
    ncbi?: boolean;
    ensembl?: boolean;
    wikipedia?: boolean;
  };
}

export interface IdeogramConfig {
  enabled: boolean;
  width: number;
  height: number;
  showLabels: boolean;
}

export interface GeneTooltipConfig extends CoreTooltipConfig {
  api: 'mygene';
  truncateSummary: number;
  display: Partial<TooltipDisplayConfig>;
  ideogram: Partial<IdeogramConfig>;
  pathwaySource: 'reactome' | 'kegg' | 'wikipathways';
  pathwayCount: number;
  domainCount: number;
  transcriptCount: number;
  structureCount: number;
  generifCount: number;
}

export const defaultConfig: GeneTooltipConfig = {
  ...defaultCoreConfig,
  api: 'mygene',
  truncateSummary: 4,
  display: {
    summary: 'expanded',
    species: true,
    location: 'expanded',
    ideogram: true,
    pathways: true,
    domains: true,
    geneTrack: 'expanded',
    transcripts: true,
    structures: true,
    generifs: true,
    linksSection: true,
    collapsible: true,
    collapsedByDefault: true,
    links: {
      ncbi: true,
      ensembl: true,
      wikipedia: true,
    },
  },
  ideogram: {
    enabled: true,
    height: 100,
    showLabels: false,
  },
  pathwaySource: 'kegg',
  pathwayCount: 3,
  domainCount: 3,
  transcriptCount: 3,
  structureCount: 3,
  generifCount: 3,
};

export function mergeConfig(userConfig: Partial<GeneTooltipConfig> = {}): GeneTooltipConfig {
  return {
    ...defaultConfig,
    ...userConfig,
    display: {
      ...defaultConfig.display,
      ...userConfig.display,
      links: { ...defaultConfig.display.links, ...userConfig.display?.links },
    },
    ideogram: { ...defaultConfig.ideogram, ...userConfig.ideogram },
    tippyOptions: { ...defaultConfig.tippyOptions, ...userConfig.tippyOptions },
    nestedTippyOptions: { ...defaultConfig.nestedTippyOptions, ...userConfig.nestedTippyOptions },
  };
}
