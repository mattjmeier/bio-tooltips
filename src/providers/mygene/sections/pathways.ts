import { renderParagraphContent } from '../../../core/renderer.js';
import { formatPathways } from '../formatters.js';
import type { MyGeneSectionDefinition } from './types.js';

export const pathwaysSection: MyGeneSectionDefinition = {
  key: 'pathways',
  title: 'Pathways',
  render({ data, pathwaySource, pathwayCount, uniqueId }) {
    const pathways = formatPathways(data.pathway?.[pathwaySource], pathwaySource);
    return renderParagraphContent(pathways, pathwayCount, `pathways-more-${uniqueId}`);
  },
  getNestedTooltipDefinition({ data, pathwaySource, uniqueId }) {
    return {
      selector: `#pathways-more-${uniqueId}`,
      items: formatPathways(data.pathway?.[pathwaySource], pathwaySource),
    };
  },
};
