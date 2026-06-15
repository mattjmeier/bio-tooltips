import { renderListContent } from '../../../core/renderer.js';
import { formatGeneRIFs } from '../formatters.js';
import type { MyGeneSectionDefinition } from './types.js';

export const generifsSection: MyGeneSectionDefinition = {
  key: 'generifs',
  title: 'GeneRIFs',
  render({ data, generifCount, uniqueId }) {
    const generifs = formatGeneRIFs(data.generif);
    return renderListContent(generifs, generifCount, `generifs-more-${uniqueId}`);
  },
  getNestedTooltipDefinition({ data, uniqueId }) {
    return {
      selector: `#generifs-more-${uniqueId}`,
      items: formatGeneRIFs(data.generif),
    };
  },
};
