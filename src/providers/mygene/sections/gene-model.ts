import { loaderHTML } from '../../../core/renderer.js';
import type { MyGeneSectionDefinition } from './types.js';
import { getLinkedTranscriptsWithoutExons, getUsableTranscripts, renderSingleTranscriptSummary } from '../visuals/transcript-selector.js';

function renderGeneTrackContent(uniqueId: string, hasUnavailableTranscripts: boolean): string {
  const availabilityNote = hasUnavailableTranscripts
    ? `<p class="gt-transcript-availability" id="transcript-availability-${uniqueId}">Only transcripts with exon coordinates from MyGene can be drawn. Linked Ensembl IDs may refer to the same transcript as a displayed RefSeq model.</p>`
    : '';
  return `
    ${availabilityNote}
    <div class="gene-tooltip-track" id="gene-tooltip-track-${uniqueId}">${loaderHTML}</div>
  `;
}

function renderGeneTrackControls(
  uniqueId: string,
  transcripts: Parameters<typeof getUsableTranscripts>[0],
  linkedTranscriptIds: string | string[] | undefined,
): string {
  const usableTranscripts = getUsableTranscripts(transcripts);
  if (usableTranscripts.length === 0) {
    return '';
  }

  const unavailable = getLinkedTranscriptsWithoutExons(usableTranscripts, linkedTranscriptIds);
  if (usableTranscripts.length === 1 && unavailable.length === 0) {
    return `<div class="gene-tooltip-track-controls gene-tooltip-track-controls--single">${renderSingleTranscriptSummary(usableTranscripts[0])}</div>`;
  }

  return `
        <div class="gene-tooltip-track-controls">
          <select class="gene-tooltip-transcript-selector" id="transcript-selector-${uniqueId}" aria-label="Select transcript"${unavailable.length ? ` aria-describedby="transcript-availability-${uniqueId}"` : ''}></select>
        </div>
      `;
}

export const geneModelSection: MyGeneSectionDefinition = {
  key: 'geneTrack',
  title: 'Gene Model',
  render({ data, uniqueId }) {
    const unavailable = getLinkedTranscriptsWithoutExons(getUsableTranscripts(data.exons), data.ensembl?.transcript);
    return data.exons ? renderGeneTrackContent(uniqueId, unavailable.length > 0) : '';
  },
  renderHeader({ data, uniqueId }) {
    return renderGeneTrackControls(uniqueId, data.exons, data.ensembl?.transcript);
  },
};
