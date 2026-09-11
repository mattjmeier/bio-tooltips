import { renderSummaryActions, renderSummaryToggle } from '../../../core/renderer.js';
import type { MyGeneSectionDefinition } from './types.js';

export const summarySection: MyGeneSectionDefinition = {
  key: 'summary',
  title: 'Summary',
  render({ data, truncate, uniqueId }) {
    const summary = data.summary || '';

    if (!summary) {
      return '';
    }

    return `<div class="gt-summary-section">
      <p id="summary-text-${uniqueId}" class="gene-tooltip-summary" style="--line-clamp: ${truncate};">${summary}</p>
      ${renderSummaryToggle(uniqueId)}
      ${renderSummaryActions(uniqueId)}
    </div>`;
  },
};
