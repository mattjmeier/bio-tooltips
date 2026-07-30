import { loaderHTML } from '../../../core/renderer.js';
import type { MyGeneSectionDefinition } from './types.js';
import { getUsableTranscripts } from '../visuals/transcript-selector.js';

function renderGeneTrackContent(uniqueId: string): string {
  return `
    <div class="gene-tooltip-track" id="gene-tooltip-track-${uniqueId}">${loaderHTML}</div>
  `;
}

function renderGeneTrackControls(uniqueId: string, transcripts: Parameters<typeof getUsableTranscripts>[0]): string {
  if (getUsableTranscripts(transcripts).length <= 1) {
    return '';
  }

  return `
        <div class="gene-tooltip-track-controls">
          <select class="gene-tooltip-transcript-selector" id="transcript-selector-${uniqueId}" aria-label="Select transcript"></select>
        </div>
      `;
}

export const geneModelSection: MyGeneSectionDefinition = {
  key: 'geneTrack',
  title: 'Gene Model',
  render({ data, uniqueId }) {
    return data.exons ? renderGeneTrackContent(uniqueId) : '';
  },
  renderHeader({ data, uniqueId }) {
    return renderGeneTrackControls(uniqueId, data.exons);
  },
};
