import { loaderHTML } from '../../../core/renderer.js';
import type { MyGeneSectionDefinition } from './types.js';

function renderGeneTrackContent(uniqueId: string): string {
  return `
    <div class="gene-tooltip-track" id="gene-tooltip-track-${uniqueId}">${loaderHTML}</div>
  `;
}

function renderGeneTrackControls(uniqueId: string): string {
  return `
        <div class="gene-tooltip-track-controls">
          <select class="gt-transcript-selector form-select-sm" id="transcript-selector-${uniqueId}"></select>
        </div>
      `;
}

export const geneModelSection: MyGeneSectionDefinition = {
  key: 'geneTrack',
  title: 'Gene Model',
  render({ data, uniqueId }) {
    return data.exons && data.exons.length > 0 ? renderGeneTrackContent(uniqueId) : '';
  },
  renderHeader({ uniqueId }) {
    return renderGeneTrackControls(uniqueId);
  },
};
