import type { Props } from 'tippy.js';

export interface GenomicPosition {
  chr: string;
  start: number;
  end: number;
  strand: number;
}

export interface MyGenePathway {
  name: string;
  id: string;
}

export interface MyGeneInterproDomain {
  desc: string;
  id: string;
  short_desc: string;
}

export interface GeneRIF {
  pubmed: number;
  text: string;
}

// Define the shape of the data we expect from mygene.info
export interface MyGeneInfoResult {
  _id: string;
  query: string;
  symbol: string;
  name: string;
  summary?: string;
  taxid: number;
  genomic_pos?: GenomicPosition | GenomicPosition[];
  pathway?: {
    reactome?: MyGenePathway[] | MyGenePathway;
    kegg?: MyGenePathway[] | MyGenePathway;
    wikipathways?: MyGenePathway[] | MyGenePathway;
  };
  interpro?: MyGeneInterproDomain[] | MyGeneInterproDomain;
  exons?: MyGeneExon[];
  ensembl?: {
    gene: string;
    protein?: string[] | string;
    transcript?: string[] | string;
  };
  pdb?: string[] | string;
  wikipedia?: {
    url_stub?: string;
  };
  generif?: GeneRIF[] | GeneRIF;
}

// Section visibility
export type SectionVisibility = boolean | 'expanded' | 'collapsed';

// Define the components that can be shown or hidden
export interface TooltipDisplayConfig {
  summary: SectionVisibility;
  species: boolean; // Species is usually just a header line, not a collapsible section
  location: SectionVisibility;
  ideogram: boolean; // Not a section
  pathways: SectionVisibility;
  domains: SectionVisibility;
  geneTrack: SectionVisibility;
  transcripts: SectionVisibility;
  structures: SectionVisibility;
  generifs: SectionVisibility;
  linksSection: SectionVisibility; // Added this to explicitly control the "Links" container state
  collapsible?: boolean;
  collapsedByDefault?: boolean;
  links: {
    ncbi?: boolean;
    ensembl?: boolean;
    wikipedia?: boolean;
  };
}

// Ideogram configuration
export interface IdeogramConfig {
  enabled: boolean;
  width: number;
  height: number;
  showLabels: boolean;
}

// Define the shape of the library's configuration object
export interface GeneTooltipConfig {
  selector: string;
  api: 'mygene';
  prefetch: 'smart' | 'all' | 'none';
  prefetchThreshold: number;
  truncateSummary: number;
  theme: 'light' | 'dark' | 'auto' | 'material' | 'translucent'| 'light-border' | undefined;
  display: Partial<TooltipDisplayConfig>;
  ideogram: Partial<IdeogramConfig>;
  tippyOptions: Partial<Props>;
  nestedTippyOptions: Partial<Props>;
  pathwaySource: 'reactome' | 'kegg' | 'wikipathways';
  pathwayCount: number;
  domainCount: number;
  transcriptCount: number;
  structureCount: number;
  generifCount: number;
  tooltipWidth?: number;
  tooltipHeight?: number; // This is an explicit max-height
  constrainToViewport: boolean;
}

export interface MyGeneExon {
  cdsend: number;
  cdsstart: number;
  chr: string;
  strand: number;
  txend: number;
  txstart: number;
  transcript: string;
  position?: [number, number][];
  start?: number;                 
  end?: number;                   
}

export const defaultConfig: GeneTooltipConfig = {
  selector: '.gene-tooltip',
  api: 'mygene',
  prefetch: 'smart',
  prefetchThreshold: 15,
  truncateSummary: 4,
  theme: 'auto',
  constrainToViewport: true,
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
  tippyOptions: {
    allowHTML: true,
    interactive: true,
    placement: 'bottom',
    appendTo: () => document.body,
    interactiveDebounce: 75,
    hideOnClick: false,
    trigger: 'mouseenter focus',
    zIndex: 9999,
    popperOptions: {
      strategy: 'absolute', 
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            boundary: 'viewport',
            padding: 8
          },
        },
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['top', 'right', 'left'],
            boundary: 'viewport',
            padding: 8
          },
        }
      ],
    }
  },
  nestedTippyOptions: {
    allowHTML: true,
    interactive: true,
    trigger: 'mouseenter focus',
    hideOnClick: false,
    interactiveBorder: 20,
    interactiveDebounce: 75,
    placement: 'right',
  }
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
