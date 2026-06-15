import type { GeneTooltipConfig } from '../config.js';
import type { MyGeneInfoResult } from '../types.js';
import type { MyGeneSectionContext, MyGeneSectionDefinition } from './types.js';
import { domainsSection } from './domains.js';
import { generifsSection } from './generifs.js';
import { geneModelSection } from './gene-model.js';
import { linksSection } from './links.js';
import { locationSection } from './location.js';
import { pathwaysSection } from './pathways.js';
import { structuresSection } from './structures.js';
import { summarySection } from './summary.js';
import { transcriptsSection } from './transcripts.js';

export type { MyGeneSectionContext, MyGeneSectionDefinition } from './types.js';
export { renderSpecies } from './species.js';

export const myGeneSections: MyGeneSectionDefinition[] = [
  summarySection,
  locationSection,
  geneModelSection,
  pathwaysSection,
  domainsSection,
  transcriptsSection,
  structuresSection,
  generifsSection,
  linksSection,
];

export function createMyGeneSectionContext(
  data: MyGeneInfoResult,
  config: Pick<
    GeneTooltipConfig,
    | 'display'
    | 'truncateSummary'
    | 'pathwaySource'
    | 'pathwayCount'
    | 'domainCount'
    | 'transcriptCount'
    | 'structureCount'
    | 'generifCount'
  >,
  uniqueId: string
): MyGeneSectionContext {
  return {
    data,
    uniqueId,
    display: config.display,
    truncate: config.truncateSummary,
    pathwaySource: config.pathwaySource,
    pathwayCount: config.pathwayCount,
    domainCount: config.domainCount,
    transcriptCount: config.transcriptCount,
    structureCount: config.structureCount,
    generifCount: config.generifCount,
  };
}

export function getMyGeneNestedTooltipDefinitions(
  data: MyGeneInfoResult,
  config: GeneTooltipConfig,
  uniqueId: string
) {
  const context = createMyGeneSectionContext(data, config, uniqueId);

  return myGeneSections
    .map(section => section.getNestedTooltipDefinition?.(context))
    .filter(definition => definition !== undefined);
}
