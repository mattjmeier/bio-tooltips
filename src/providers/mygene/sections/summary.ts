import { renderCollapseButton } from '../../../core/renderer.js';
import type { MyGeneSectionDefinition } from './types.js';

export const summarySection: MyGeneSectionDefinition = {
  key: 'summary',
  title: 'Summary',
  render({ data, truncate, uniqueId }) {
    const summary = data.summary || '';

    if (!summary) {
      return '';
    }

    return `
    <p class="gene-tooltip-summary" style="--line-clamp: ${truncate};">${summary}</p>
    ${renderCollapseButton(`summary-less-${uniqueId}`, 'Show less')}
  `;
  },
};
