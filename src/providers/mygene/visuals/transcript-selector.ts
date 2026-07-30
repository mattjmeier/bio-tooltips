import type { MyGeneExon } from '../types.js';

export function getUsableTranscripts(transcripts: MyGeneExon[] | undefined): MyGeneExon[] {
  return (transcripts ?? []).filter(transcript => (
    transcript.transcript.trim().length > 0
    && Array.isArray(transcript.position)
    && transcript.position.length > 0
  ));
}

export function getLongestTranscript(transcripts: MyGeneExon[]): MyGeneExon {
  return transcripts.reduce((longest, current) => (
    current.position!.length > longest.position!.length ? current : longest
  ), transcripts[0]);
}

interface NativeTranscriptSelectorOptions {
  selectedTranscriptId: string;
  onChange: (transcriptId: string) => void;
}

/**
 * Rebuild the native transcript control before the gene track waits for D3.
 * Replacing `onchange` keeps repeated visual renders from accumulating handlers.
 */
export function initializeNativeTranscriptSelector(
  selectorEl: HTMLSelectElement,
  transcripts: MyGeneExon[],
  { selectedTranscriptId, onChange }: NativeTranscriptSelectorOptions,
): string | null {
  if (transcripts.length <= 1) {
    selectorEl.replaceChildren();
    selectorEl.onchange = null;
    selectorEl.hidden = true;
    return null;
  }

  const sortedTranscripts = [...transcripts]
    .sort((a, b) => a.transcript.localeCompare(b.transcript));
  const availableTranscriptIds = new Set(sortedTranscripts.map(transcript => transcript.transcript));
  const fallbackTranscriptId = getLongestTranscript(transcripts).transcript;
  const activeTranscriptId = availableTranscriptIds.has(selectedTranscriptId)
    ? selectedTranscriptId
    : fallbackTranscriptId;

  selectorEl.replaceChildren(...sortedTranscripts.map(transcript => {
    const option = document.createElement('option');
    option.value = transcript.transcript;
    option.textContent = `${transcript.transcript} (${transcript.position!.length} exons)`;
    return option;
  }));
  selectorEl.value = activeTranscriptId;
  selectorEl.hidden = false;
  selectorEl.onchange = () => onChange(selectorEl.value || fallbackTranscriptId);

  return activeTranscriptId;
}
