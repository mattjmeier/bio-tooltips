import type { MyGeneInfoResult } from './types.js';
import type { SectionVisibility, TooltipDisplayConfig } from './config.js';
import {
  generateUniqueId,
  renderCollapseButton,
  renderTooltipHeader,
  renderTooltipShell,
} from '../../core/renderer.js';
import { getSectionState, renderCollapsibleSection } from '../../core/sections.js';
import {
  renderDomains,
  renderGeneRIFs,
  renderGeneTrackContent,
  renderLinksContent,
  renderLocation,
  renderPathways,
  renderSpecies,
  renderStructures,
  renderTranscripts,
} from './sections/index.js';

interface RenderOptions {
  truncate?: number;
  display?: Partial<TooltipDisplayConfig>;
  pathwaySource?: 'reactome' | 'kegg' | 'wikipathways';
  pathwayCount?: number;
  domainCount?: number;
  transcriptCount?: number;
  structureCount?: number;
  generifCount?: number;
  tooltipWidth?: number;
  tooltipHeight?: number;
  uniqueId?: string;
}

function renderSummaryContent(summaryText: string | undefined, truncate: number, uniqueId: string): string {
  const summary = summaryText || "";

  if (!summary) {
    return '';
  }

  const summaryClass = 'gene-tooltip-summary';
  const summaryStyle = `style="--line-clamp: ${truncate};"`;
  const lessButton = renderCollapseButton(`summary-less-${uniqueId}`, 'Show less');

  return `
    <p class="${summaryClass}" ${summaryStyle}>${summary}</p>
    ${lessButton}
  `;
}

function renderPinButton(): string {
  return `
    <button class="gt-pin-button" aria-label="Pin tooltip" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354"/>
      </svg>
    </button>
  `;
}

export function renderTooltipHTML(
  data: MyGeneInfoResult | null | undefined,
  options: RenderOptions = {}
): string {
  if (!data) return '<p>Gene not found.</p>';

  const uniqueId = options.uniqueId || generateUniqueId();

  const {
    truncate = 4,
    display = {},
    pathwaySource = 'reactome',
    pathwayCount = 3,
    domainCount = 3,
    transcriptCount = 3,
    structureCount = 3,
    generifCount = 3,
    tooltipWidth,
    tooltipHeight,
  } = options;

  const collapsible = display.collapsible ?? false;
  const globalCollapsedByDefault = display.collapsedByDefault ?? false;

  const buildSection = (
    key: keyof TooltipDisplayConfig,
    title: string,
    content: string,
    extraHeaderHtml: string = ''
  ) => {
    if (!content) return '';

    const setting = display[key] as SectionVisibility | undefined;
    const { isVisible, startCollapsed } = getSectionState(setting, globalCollapsedByDefault);

    if (!isVisible) return '';

    return renderCollapsibleSection(
      title,
      content,
      uniqueId,
      collapsible,
      startCollapsed,
      extraHeaderHtml
    );
  };

  const styleParts: string[] = [];
  if (tooltipWidth) styleParts.push(`max-width: ${tooltipWidth}px`);
  if (tooltipHeight) styleParts.push(`max-height: ${tooltipHeight}px`, `overflow-y: auto`);
  const inlineStyle = styleParts.length > 0 ? `style="${styleParts.join('; ')}"` : '';

  const summaryContent = data.summary ? renderSummaryContent(data.summary, truncate, uniqueId) : '';
  const locationContent = renderLocation(data.genomic_pos, display.ideogram, uniqueId);
  const geneTrackContent = data.exons && data.exons.length > 0 ? renderGeneTrackContent(uniqueId) : '';
  const pathwayContent = renderPathways(data, pathwaySource, pathwayCount, uniqueId);
  const domainContent = renderDomains(data, domainCount, uniqueId);
  const transcriptContent = renderTranscripts(data, transcriptCount, uniqueId);
  const structureContent = renderStructures(data, structureCount, uniqueId);
  const generifContent = renderGeneRIFs(data, generifCount, uniqueId);
  const linksContent = renderLinksContent(data, display);

  const titleHTML = `
          <strong>${data.symbol}</strong>
          <span class="gene-tooltip-name">(${data.name})</span>
  `;

  return renderTooltipShell(
    uniqueId,
    `
      ${renderTooltipHeader(titleHTML, renderPinButton())}

      ${display.species !== false && data.taxid ? renderSpecies(data.taxid) : ''}

      ${buildSection('summary', 'Summary', summaryContent)}
      ${buildSection('location', 'Location', locationContent)}
      ${buildSection('geneTrack', 'Gene Model', geneTrackContent,
        `<div class="gene-tooltip-track-controls">
          <select class="gt-transcript-selector form-select-sm" id="transcript-selector-${uniqueId}"></select>
        </div>`
      )}
      ${buildSection('pathways', 'Pathways', pathwayContent)}
      ${buildSection('domains', 'Protein Domains', domainContent)}
      ${buildSection('transcripts', 'Transcripts', transcriptContent)}
      ${buildSection('structures', 'PDB Structures', structureContent)}
      ${buildSection('generifs', 'GeneRIFs', generifContent)}
      ${linksContent ? buildSection('linksSection', 'Links', linksContent) : ''}
    `,
    inlineStyle
  );
}
