import { renderParagraphContent } from '../../../core/renderer.js';
import { formatTranscripts } from '../formatters.js';
import type { MyGeneSectionDefinition } from './types.js';

export const transcriptsSection: MyGeneSectionDefinition = {
  key: 'transcripts',
  title: 'Transcripts',
  render({ data, transcriptCount, uniqueId }) {
    const transcripts = formatTranscripts(data.ensembl?.transcript);
    return renderParagraphContent(transcripts, transcriptCount, `transcripts-more-${uniqueId}`);
  },
  getNestedTooltipDefinition({ data, uniqueId }) {
    return {
      selector: `#transcripts-more-${uniqueId}`,
      items: formatTranscripts(data.ensembl?.transcript),
    };
  },
};
