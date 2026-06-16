import { loaderHTML } from '../../../core/renderer.js';
import type { MyGeneExon } from '../types.js';
import type { MyGeneSectionDefinition } from './types.js';

function renderGeneTrackContent(uniqueId: string): string {
  return `
    <div class="gene-tooltip-track" id="gene-tooltip-track-${uniqueId}">${loaderHTML}</div>
  `;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getLongestTranscript(transcripts: MyGeneExon[]): MyGeneExon {
  return transcripts.reduce((longest, current) => {
    return (current.position?.length || 0) > (longest.position?.length || 0) ? current : longest;
  }, transcripts[0]);
}

function renderGeneTrackControls(uniqueId: string, transcripts: MyGeneExon[] | undefined): string {
  if (!transcripts || transcripts.length <= 1) {
    return '';
  }

  const longestTranscript = getLongestTranscript(transcripts);
  const options = [...transcripts]
    .sort((a, b) => a.transcript.localeCompare(b.transcript))
    .map(tx => {
      const exonCount = tx.position?.length || 0;
      const value = escapeAttr(tx.transcript);
      const label = escapeAttr(`${tx.transcript} (${exonCount} exons)`);
      const selected = tx.transcript === longestTranscript.transcript ? ' selected' : '';

      return `<option value="${value}"${selected}>${label}</option>`;
    })
    .join('');

  return `
        <div class="gene-tooltip-track-controls">
          <select class="gt-transcript-selector form-select-sm" id="transcript-selector-${uniqueId}">${options}</select>
        </div>
      `;
}

export const geneModelSection: MyGeneSectionDefinition = {
  key: 'geneTrack',
  title: 'Gene Model',
  render({ data, uniqueId }) {
    return data.exons && data.exons.length > 0 ? renderGeneTrackContent(uniqueId) : '';
  },
  renderHeader({ data, uniqueId }) {
    return renderGeneTrackControls(uniqueId, data.exons);
  },
};
