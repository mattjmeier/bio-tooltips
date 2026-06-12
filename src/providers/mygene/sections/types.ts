import type { NestedTooltipDefinition } from '../../../core/types.js';
import type { TooltipDisplayConfig } from '../config.js';
import type { MyGeneInfoResult } from '../types.js';

export interface MyGeneSectionContext {
  data: MyGeneInfoResult;
  uniqueId: string;
  display: Partial<TooltipDisplayConfig>;
  truncate: number;
  pathwaySource: 'reactome' | 'kegg' | 'wikipathways';
  pathwayCount: number;
  domainCount: number;
  transcriptCount: number;
  structureCount: number;
  generifCount: number;
}

export interface MyGeneSectionDefinition {
  key: keyof TooltipDisplayConfig;
  title: string;
  render: (context: MyGeneSectionContext) => string;
  renderHeader?: (context: MyGeneSectionContext) => string;
  getNestedTooltipDefinition?: (context: MyGeneSectionContext) => NestedTooltipDefinition;
}
