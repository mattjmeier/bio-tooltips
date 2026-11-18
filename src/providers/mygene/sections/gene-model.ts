import { loaderHTML } from '../../../core/renderer.js';
import type { MyGeneSectionDefinition } from './types.js';
import { renderTranscriptPicker } from '../visuals/transcript-selector.js';

export const geneModelSection: MyGeneSectionDefinition = {
  key: 'geneTrack',
  title: 'Gene Model',
  render({ data, uniqueId }) {
    return data.exons
      ? `<div class="gene-tooltip-track" id="gene-tooltip-track-${uniqueId}">${loaderHTML}</div>`
      : '';
  },
  renderHeader({ data, uniqueId }) {
    return renderTranscriptPicker(uniqueId, data.exons, data.ensembl?.transcript);
  },
};
