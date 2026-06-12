export type {
  CoreTooltipConfig,
  PrefetchMode,
  TooltipTheme,
} from './core/config.js';
export { defaultCoreConfig } from './core/config.js';

export type {
  GeneRIF,
  GenomicPosition,
  MyGeneExon,
  MyGeneInfoResult,
  MyGeneInterproDomain,
  MyGenePathway,
} from './providers/mygene/types.js';

export type {
  GeneTooltipConfig,
  IdeogramConfig,
  SectionVisibility,
  TooltipDisplayConfig,
} from './providers/mygene/config.js';
export { defaultConfig, mergeConfig } from './providers/mygene/config.js';
