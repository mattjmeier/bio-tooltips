import { copyIconHTML } from '../../../core/renderer.js';
import { asArray } from '../formatters.js';
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

function escapeHTML(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character] ?? character));
}

function formatTranscriptSummary(transcript: MyGeneExon): string {
  const count = transcript.position?.length ?? 0;
  return `${transcript.transcript} · ${count} exon${count === 1 ? '' : 's'}`;
}

function renderTranscriptCopyButton(escapedId: string): string {
  return `<button type="button" class="gt-transcript-copy-btn" data-copy="${escapedId}" aria-label="Copy ${escapedId}" title="Copy ${escapedId}">${copyIconHTML}</button>`;
}

const transcriptCopyStatus = '<div class="gt-copy-status gt-sr-only" role="status"></div>';

export function renderTranscriptPicker(
  uniqueId: string,
  transcripts: MyGeneExon[] | undefined,
  linkedTranscriptIds: string | string[] | undefined,
): string {
  const models = getUsableTranscripts(transcripts);
  if (models.length === 0) return '';

  const withoutVersion = (id: string) => id.replace(/\.\d+$/, '');
  const modelIds = new Set(models.map(model => withoutVersion(model.transcript.trim())));
  const linkedIds = [...new Set(asArray(linkedTranscriptIds).map(id => id.trim()))]
    .filter(id => id && !modelIds.has(withoutVersion(id)))
    .sort((a, b) => a.localeCompare(b));
  const selected = getLongestTranscript(models);
  const summary = escapeHTML(formatTranscriptSummary(selected));

  if (models.length === 1 && linkedIds.length === 0) {
    return `<div class="gene-tooltip-track-controls gene-tooltip-track-controls--single">
      <span class="gene-tooltip-transcript-summary">${summary}</span>
      ${renderTranscriptCopyButton(escapeHTML(selected.transcript))}
      ${transcriptCopyStatus}
    </div>`;
  }

  const modelRows = [...models].sort((a, b) => a.transcript.localeCompare(b.transcript)).map(model => {
    const id = escapeHTML(model.transcript);
    return `<li><button type="button" data-transcript-model="${id}" aria-pressed="${model === selected}">${escapeHTML(formatTranscriptSummary(model))}</button>${renderTranscriptCopyButton(id)}</li>`;
  }).join('');
  const linkedRows = linkedIds.map(id => {
    const escapedId = escapeHTML(id);
    return `<li><span>${escapedId}</span>${renderTranscriptCopyButton(escapedId)}</li>`;
  }).join('');

  return `<details class="gene-tooltip-track-controls gene-tooltip-transcript-selector" id="transcript-selector-${uniqueId}">
    <summary aria-label="Select transcript, current: ${summary}"><span>${summary}</span></summary>
    <div class="gt-transcript-picker">
      <div id="transcript-models-${uniqueId}" class="gt-transcript-group-label">Available exon models</div>
      <ul role="list" aria-labelledby="transcript-models-${uniqueId}">${modelRows}</ul>
      ${linkedRows ? `<div id="transcript-linked-${uniqueId}" class="gt-transcript-group-label">Linked Ensembl transcripts · no exon coordinates</div>
      <ul role="list" aria-labelledby="transcript-linked-${uniqueId}">${linkedRows}</ul>` : ''}
      ${transcriptCopyStatus}
    </div>
  </details>`;
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

export function initializeTranscriptPicker(
  picker: HTMLDetailsElement,
  onChange?: (transcriptId: string) => void,
): void {
  const summary = picker.querySelector('summary');
  const label = summary?.querySelector('span');
  if (!summary || !label) return;

  picker.onclick = event => {
    const model = (event.target as Element).closest<HTMLButtonElement>('[data-transcript-model]');
    const id = model?.dataset.transcriptModel;
    if (!model || !id) return;

    picker.querySelector('[data-transcript-model][aria-pressed="true"]')?.setAttribute('aria-pressed', 'false');
    model.setAttribute('aria-pressed', 'true');
    label.textContent = model.textContent;
    summary.setAttribute('aria-label', `Select transcript, current: ${model.textContent}`);
    picker.open = false;
    summary.focus();
    onChange?.(id);
  };

  picker.onkeydown = event => {
    if (!picker.open || event.key !== 'Escape') return;
    event.stopPropagation();
    picker.open = false;
    summary.focus();
  };
}
