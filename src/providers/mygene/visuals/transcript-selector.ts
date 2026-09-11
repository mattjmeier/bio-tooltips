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

/** Escape values inserted into the text alternative's small HTML table. */
function escapeHTML(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[character] ?? character));
}

/** Render a keyboard-readable equivalent of the exon SVG. */
export function renderGeneTextAlternative(
  container: HTMLElement,
  transcript: MyGeneExon,
  symbol: string,
): HTMLDetailsElement {
  const existing = container.querySelector<HTMLDetailsElement>('.gt-gene-text-alternative');
  const alternative = existing ?? document.createElement('details');
  alternative.className = 'gt-gene-text-alternative';
  alternative.setAttribute('aria-label', `Text alternative for ${symbol} gene model`);
  const strand = transcript.strand === -1 ? 'reverse (−)' : 'forward (+)';
  const exons = transcript.position ?? [];
  const rows = exons.map((coordinates, index) => {
    const exonNumber = transcript.strand === -1 ? exons.length - index : index + 1;
    return `<tr><th scope="row">${exonNumber}</th><td>${coordinates[0].toLocaleString()}</td><td>${coordinates[1].toLocaleString()}</td></tr>`;
  }).join('');
  alternative.innerHTML = `
    <summary>Text alternative</summary>
    <div class="gt-gene-text-alternative-content">
      <p><strong>${escapeHTML(symbol)}</strong> transcript <span class="gt-transcript-id">${escapeHTML(transcript.transcript)}</span>; strand: ${strand}; ${exons.length} exon${exons.length === 1 ? '' : 's'}.</p>
      <table>
        <caption>Exon coordinates for ${escapeHTML(transcript.transcript)}</caption>
        <thead><tr><th scope="col">Exon</th><th scope="col">Start</th><th scope="col">End</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  if (!existing) container.prepend(alternative);
  return alternative;
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
    option.textContent = `${transcript.transcript} · ${transcript.position!.length} exons`;
    return option;
  }));
  selectorEl.value = activeTranscriptId;
  selectorEl.hidden = false;
  selectorEl.onchange = () => onChange(selectorEl.value || fallbackTranscriptId);

  return activeTranscriptId;
}
