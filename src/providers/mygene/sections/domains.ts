import { renderParagraphContent } from '../../../core/renderer.js';
import { formatDomains } from '../formatters.js';
import type { MyGeneSectionDefinition } from './types.js';

export const domainsSection: MyGeneSectionDefinition = {
  key: 'domains',
  title: 'Protein Domains',
  render({ data, domainCount, uniqueId }) {
    const domains = formatDomains(data.interpro);
    return renderParagraphContent(domains, domainCount, `domains-more-${uniqueId}`);
  },
  getNestedTooltipDefinition({ data, uniqueId }) {
    return {
      selector: `#domains-more-${uniqueId}`,
      items: formatDomains(data.interpro),
    };
  },
};
