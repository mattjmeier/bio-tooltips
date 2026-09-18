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

function escapeHTML(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character] ?? character));
}

let nextTextAlternativeId = 0;
const textAlternativeIds = new WeakMap<HTMLElement, string>();

function getTextAlternativeId(container: HTMLElement, uniqueId?: string): string {
  const existingId = textAlternativeIds.get(container);
  if (existingId) return existingId;
  const baseId = uniqueId || container.id.replace(/^gene-tooltip-track-/, '');
  const safeBaseId = baseId.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/^-+|-+$/g, '')
    || `track-${++nextTextAlternativeId}`;
  const id = `gene-text-alternative-${safeBaseId}`;
  textAlternativeIds.set(container, id);
  return id;
}

function renderTextAlternativeContent(transcript: MyGeneExon, symbol: string): string {
  const strand = transcript.strand === -1 ? 'reverse (−)' : 'forward (+)';
  const exons = transcript.position ?? [];
  const rows = exons.map((coordinates, index) => {
    const exonNumber = transcript.strand === -1 ? exons.length - index : index + 1;
    return `<tr><th scope="row">${exonNumber}</th><td>${coordinates[0].toLocaleString()}</td><td>${coordinates[1].toLocaleString()}</td></tr>`;
  }).join('');
  return `<p><strong>${escapeHTML(symbol)}</strong> transcript <span class="gt-transcript-id">${escapeHTML(transcript.transcript)}</span>; strand: ${strand}; ${exons.length} exon${exons.length === 1 ? '' : 's'}.</p>
      <table>
        <caption>Exon coordinates for ${escapeHTML(transcript.transcript)}</caption>
        <thead><tr><th scope="col">Exon</th><th scope="col">Start</th><th scope="col">End</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
}

export function setGeneTextAlternativeExpanded(container: HTMLElement, expanded: boolean): void {
  const toggle = container.querySelector<HTMLButtonElement>('.gt-gene-text-alternative-toggle');
  const panel = container.querySelector<HTMLElement>('.gt-gene-text-alternative');
  if (!toggle || !panel) return;
  const action = expanded ? 'Hide' : 'Show';
  const geneContext = toggle.dataset.geneSymbol ? ` for ${toggle.dataset.geneSymbol} gene model` : '';
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.setAttribute('aria-label', `${action} exon data${geneContext}`);
  toggle.textContent = `${action} exon data`;
  panel.hidden = !expanded;
}

/** Render a keyboard-readable equivalent of the exon SVG. */
export function renderGeneTextAlternative(
  container: HTMLElement,
  transcript: MyGeneExon,
  symbol: string,
  uniqueId?: string,
): HTMLDivElement {
  const alternativeId = getTextAlternativeId(container, uniqueId);
  let meta = container.querySelector<HTMLDivElement>('.gt-gene-track-meta');
  let toggle = container.querySelector<HTMLButtonElement>('.gt-gene-text-alternative-toggle');
  let alternative = container.querySelector<HTMLDivElement>('.gt-gene-text-alternative');

  if (!meta) {
    meta = document.createElement('div');
    meta.className = 'gt-gene-track-meta';
    container.prepend(meta);
  }
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'gt-gene-text-alternative-toggle';
    toggle.addEventListener('click', () => {
      const expanded = toggle!.getAttribute('aria-expanded') === 'true';
      setGeneTextAlternativeExpanded(container, !expanded);
    });
    meta.append(toggle);
  } else if (toggle.parentElement !== meta) {
    meta.append(toggle);
  }
  if (!alternative) {
    alternative = document.createElement('div');
    alternative.className = 'gt-gene-text-alternative';
    alternative.hidden = true;
    container.append(alternative);
  }

  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.dataset.geneSymbol = symbol;
  toggle.setAttribute('aria-controls', alternativeId);
  alternative.id = alternativeId;
  alternative.setAttribute('role', 'region');
  alternative.setAttribute('aria-label', `Exon data for ${symbol} gene model`);
  alternative.innerHTML = `<div class="gt-gene-text-alternative-content" data-transcript="${escapeHTML(transcript.transcript)}">${renderTextAlternativeContent(transcript, symbol)}</div>`;
  setGeneTextAlternativeExpanded(container, expanded);

  const label = meta.querySelector<HTMLElement>('.gt-gene-track-label') ?? document.createElement('div');
  label.className = 'gt-gene-track-label';
  label.innerHTML = `<strong>${escapeHTML(symbol)}</strong> <span aria-hidden="true">${transcript.strand === -1 ? '←' : '→'}</span><span class="gt-visually-hidden">${transcript.strand === -1 ? 'reverse strand' : 'forward strand'}</span>`;
  if (!label.parentElement) meta.prepend(label);

  const svg = container.querySelector('svg');
  if (svg && alternative.previousElementSibling !== svg) {
    svg.insertAdjacentElement('afterend', alternative);
  }
  return alternative;
}

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

  const sortedTranscripts = [...transcripts].sort((a, b) => a.transcript.localeCompare(b.transcript));
  const availableTranscriptIds = new Set(sortedTranscripts.map(transcript => transcript.transcript));
  const fallbackTranscriptId = getLongestTranscript(transcripts).transcript;
  const activeTranscriptId = availableTranscriptIds.has(selectedTranscriptId) ? selectedTranscriptId : fallbackTranscriptId;

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
