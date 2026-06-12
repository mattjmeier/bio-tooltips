import { renderParagraphContent } from '../../../core/renderer.js';
import { formatStructures } from '../formatters.js';
import type { MyGeneSectionDefinition } from './types.js';

export const structuresSection: MyGeneSectionDefinition = {
  key: 'structures',
  title: 'PDB Structures',
  render({ data, structureCount, uniqueId }) {
    const structures = formatStructures(data.pdb);
    return renderParagraphContent(structures, structureCount, `structures-more-${uniqueId}`);
  },
  getNestedTooltipDefinition({ data, uniqueId }) {
    return {
      selector: `#structures-more-${uniqueId}`,
      items: formatStructures(data.pdb),
    };
  },
};
