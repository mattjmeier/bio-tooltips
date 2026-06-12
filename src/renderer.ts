import type { MyGeneInfoResult, GenomicPosition, TooltipDisplayConfig, SectionVisibility  } from './config';
import { speciesMap } from './constants';
import { formatPathways, formatDomains, formatTranscripts, formatStructures, formatGeneRIFs } from './formatters';
export type FormattedItem = { name: string; url: string };

import NCBILogoText from "./assets/NLM-square-logo.svg";
const NCBILogo = `data:image/svg+xml,${encodeURIComponent(NCBILogoText)}`;
import EnsemblLogo from "./assets/ebang-400dpi.png";
import WikiLogoText from "./assets/Wikipedia-logo.svg";
const WikiLogo = `data:image/svg+xml,${encodeURIComponent(WikiLogoText)}`;

function getSectionState(
  setting: SectionVisibility | undefined, 
  globalCollapsedByDefault: boolean
): { isVisible: boolean; startCollapsed: boolean } {
  // Handle explicit boolean false
  if (setting === false) {
    return { isVisible: false, startCollapsed: true };
  }

  // Handle explicit states
  if (setting === 'expanded') {
    return { isVisible: true, startCollapsed: false };
  }
  
  if (setting === 'collapsed') {
    return { isVisible: true, startCollapsed: true };
  }

  // Handle true or undefined (default behavior)
  return { 
    isVisible: true, 
    startCollapsed: globalCollapsedByDefault 
  };
}


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
  uniqueId?: string; // Add this parameter
}

const loaderHTML = `<div class="gt-loader-container"><div class="gt-spinner"></div><span>Loading...</span></div>`;

function renderCollapsibleSection(
  title: string,
  innerHTML: string,
  uniqueId: string,
  collapsible: boolean,
  isCollapsed: boolean, // Changed from collapsedByDefault
  headerRightHTML: string = ''
): string {
  // Use the passed-in state, but force false if functionality is disabled globally
  const collapsedState = collapsible ? isCollapsed : false;
  
  const arrow = collapsible
    ? `<span class="gt-section-arrow ${collapsedState ? 'collapsed' : ''}" aria-hidden="true"></span>`
    : '';

  const contentId = `gt-content-${uniqueId}-${title.replace(/\s+/g, '-').toLowerCase()}`;
  let headerClasses = 'gene-tooltip-section-header gt-collapsible-header';
  if (collapsible) {
    headerClasses += ' gt-is-collapsible';
  }

  return `
    <div class="gene-tooltip-section-container ${collapsible ? 'gt-collapsible' : ''}" 
        data-collapsed="${collapsedState ? 'true' : 'false'}"
        data-section="${title.replace(/\s+/g, '-').toLowerCase()}">

      <div class="${headerClasses}" 
          role="${collapsible ? 'button' : 'heading'}"
          tabindex="${collapsible ? '0' : '-1'}"
          aria-expanded="${collapsible ? !collapsedState : 'true'}"
          aria-controls="${contentId}">
        <div class="gt-section-left">
          ${arrow}
          <span class="gt-section-title">${title}</span>
        </div>
          ${headerRightHTML}
        </div>

        <div class="gt-collapsible-content" id="${contentId}">
          ${innerHTML}
        </div>
      </div>
  `;
}


// Generate a unique ID for this tooltip instance
function generateUniqueId(): string {
  // Use crypto.randomUUID() if available (modern browsers), fallback for older browsers
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers or environments without crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function renderSpecies(taxid: number): string {
  const species = speciesMap[taxid] ?? { common: "Unknown", genus: "", icon: "❓" };
  return `
    <div class="gene-tooltip-section gene-tooltip-species">
      <span class="gene-tooltip-species-icon">${species.icon}</span>
      <span>${species.common}, <em>${species.genus}</em></span>
    </div>
  `;
}

function renderLocation(
  genomic_pos: GenomicPosition | GenomicPosition[] | undefined, 
  showIdeogram: boolean = false, 
  uniqueId: string = ''
): string {
  if (!genomic_pos) return '';

  const pos = Array.isArray(genomic_pos) ? genomic_pos[0] : genomic_pos;
  if (!pos) return '';
  
  const start = pos.start.toLocaleString();
  const end = pos.end.toLocaleString();

  return `
    <div class="gene-tooltip-location">
      <div class="gene-tooltip-location-coords">
        <span class="gene-tooltip-location-chr">chr${pos.chr}</span>
        <span class="gene-tooltip-location-pos">${start}-${end}</span>
      </div>
      ${showIdeogram ? `<div class="gene-tooltip-ideo" id="gene-tooltip-ideo-${uniqueId}">${loaderHTML}</div>` : ""}
    </div>
  `;
}

// Gene Track
function renderGeneTrackContent(uniqueId: string): string {
  return `
    <div class="gene-tooltip-track-controls">
      <select class="gt-transcript-selector form-select-sm" id="transcript-selector-${uniqueId}"></select>
    </div>
    <div class="gene-tooltip-track" id="gene-tooltip-track-${uniqueId}">${loaderHTML}</div>
  `;
}

function renderSummaryContent(summaryText: string | undefined, truncate: number, uniqueId: string): string {
  const summary = summaryText || "";

  if (!summary) {
    return '';
  }

  // Case 2: Truncation is active
  const summaryClass = 'gene-tooltip-summary';
  const summaryStyle = `style="--line-clamp: ${truncate};"`;
  
  const lessButtonId = `summary-less-${uniqueId}`;
  const lessButton = renderCollapseButton(lessButtonId, 'Show less');

  // Return *only* the inner content
  return `
    <p class="${summaryClass}" ${summaryStyle}>${summary}</p>
    ${lessButton}
  `;
}

// Rendering external links
function renderLinksContent(data: MyGeneInfoResult, display: Partial<TooltipDisplayConfig>): string {
    const linksToShow = [];
    
    // Build NCBI links
    if (display.links?.ncbi !== false) {
      linksToShow.push(`
        <a href="https://www.ncbi.nlm.nih.gov/gene/${data._id}"
           target="_blank" rel="noopener noreferrer" title="View on NCBI Gene">
          <span class="gene-tooltip-link-icon-wrapper">
            <img src="${NCBILogo}" alt="NCBI Gene link" class="gene-tooltip-link-icon" />
          </span>
          <span>NCBI</span>
        </a>
      `);
    }

    // Build Ensembl ID links
    if (display.links?.ensembl !== false && data.ensembl?.gene) {
      linksToShow.push(`
        <a href="https://www.ensembl.org/id/${data.ensembl.gene}"
           target="_blank" rel="noopener noreferrer" title="View on Ensembl">
          <span class="gene-tooltip-link-icon-wrapper">
            <img src="${EnsemblLogo}" alt="Ensembl link" class="gene-tooltip-link-icon" />
          </span>
          <span>Ensembl</span>
        </a>
      `);
    }

    // Build Wikipedia links
    if (display.links?.wikipedia !== false && data.wikipedia?.url_stub) {
      const wikiStub = data.wikipedia.url_stub.replace(/\s+/g, '_');
      linksToShow.push(`
        <a href="https://en.wikipedia.org/wiki/${wikiStub}"
           target="_blank" rel="noopener noreferrer" title="View on Wikipedia">
          <span class="gene-tooltip-link-icon-wrapper">
            <img src="${WikiLogo}" alt="Wikipedia link" class="gene-tooltip-link-icon" />
          </span>
          <span>Wikipedia</span>
        </a>
      `);
    }

    // If no links, return "Not available" for consistency
    if (linksToShow.length === 0) {
      return '';
    }

    // Return *only* the inner content wrapper
    return `
      <div class="gene-tooltip-links-container">
        ${linksToShow.join('')}
      </div>
    `;
}

function renderParagraphContent(
  items: { name: string; url: string }[],
  initialCount: number,
  moreButtonId: string
): string {
  if (!items || items.length === 0) {
    return '';
  }

  const visibleItems = items.slice(0, initialCount);
  const hiddenItemCount = items.length - initialCount;

  const itemLinks = visibleItems
    .map(item => `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}</a>`)
    .join(', ');

  const moreButton = hiddenItemCount > 0
    ? renderMoreButton(moreButtonId, `... and ${hiddenItemCount} more`)
    : '';

  return `
    <p class="gene-tooltip-p-content">
      ${itemLinks}${hiddenItemCount > 0 ? ',' : ''} ${moreButton}
    </p>
  `;
}


function renderMoreButton(id: string, text: string): string {
  // We can add accessibility attributes here too
  return `
    <span id="${id}" class="gene-tooltip-more-btn" role="button" tabindex="0">
      ${text}
    </span>
  `;
}

function renderCollapseButton(id: string, text: string): string {
  return `
    <span id="${id}" class="gene-tooltip-more-btn" role="button" tabindex="0">
      ${text}
    </span>
  `;
}

function renderListContent(
  items: FormattedItem[],
  initialCount: number,
  moreButtonId: string
): string {
  if (!items || items.length === 0) {
    return '';
  }

  const visibleItems = items.slice(0, initialCount);
  const hiddenItemCount = items.length - initialCount;

  const itemLinks = visibleItems.map(item =>
    `<li>
       <a href="${item.url}" target="_blank" rel="noopener noreferrer" title="${item.name}">
          ${item.name}
       </a>
     </li>`
  ).join('');

  const moreButton = hiddenItemCount > 0
    ? renderMoreButton(moreButtonId, `... and ${hiddenItemCount} more`)
    : '';

  return `
    <div class="gene-tooltip-list-wrapper">
      <ul class="gene-tooltip-list-section">${itemLinks}</ul>
      ${moreButton}
    </div>
  `;
}

function renderPathways(data: MyGeneInfoResult, source: 'reactome' | 'kegg' | 'wikipathways', count: number, uniqueId: string): string {
    const pathways = formatPathways(data.pathway?.[source], source);
    // Use the new content function
    return renderParagraphContent(pathways, count, `pathways-more-${uniqueId}`);
}

function renderDomains(data: MyGeneInfoResult, count: number, uniqueId: string): string {
  const domains = formatDomains(data.interpro);
  return renderParagraphContent(domains, count, `domains-more-${uniqueId}`);
}

function renderTranscripts(data: MyGeneInfoResult, count: number, uniqueId: string): string {
  const transcripts = formatTranscripts(data.ensembl?.transcript);
  return renderParagraphContent(transcripts, count, `transcripts-more-${uniqueId}`);
}

function renderStructures(data: MyGeneInfoResult, count: number, uniqueId: string): string {
  const structures = formatStructures(data.pdb);
  return renderParagraphContent(structures, count, `structures-more-${uniqueId}`);
}

function renderGeneRIFs(data: MyGeneInfoResult, count: number, uniqueId: string): string {
  const generifs = formatGeneRIFs(data.generif);
  const moreButtonId = `generifs-more-${uniqueId}`;
  // Use the new content function
  return renderListContent(generifs, count, moreButtonId);
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
    tooltipHeight
  } = options;

  // These flags will be passed to renderCollapsibleSection
  const collapsible = display.collapsible ?? false;
  const globalCollapsedByDefault = display.collapsedByDefault ?? false;
  
  // Helper to generate the section HTML only if visible, calculating state
  const buildSection = (
    key: keyof TooltipDisplayConfig, 
    title: string, 
    content: string, 
    extraHeaderHtml: string = ''
  ) => {
    if (!content) return '';
    
    // Type assertion because display[key] can be complex types not just SectionVisibility
    const setting = display[key] as SectionVisibility | undefined;
    
    const { isVisible, startCollapsed } = getSectionState(setting, globalCollapsedByDefault);

    if (!isVisible) return '';
    
    return renderCollapsibleSection(
      title,
      content,
      uniqueId,
      collapsible,
      startCollapsed, // Pass the specific state
      extraHeaderHtml
    );
  };

  const styleParts: string[] = [];
  if (tooltipWidth) styleParts.push(`max-width: ${tooltipWidth}px`);
  if (tooltipHeight) styleParts.push(`max-height: ${tooltipHeight}px`, `overflow-y: auto`);
  const inlineStyle = styleParts.length > 0 ? `style="${styleParts.join('; ')}"` : '';

  // Content generation (Logic remains similar, just decoupled rendering from wrapping)
  const summaryContent = data.summary ? renderSummaryContent(data.summary, truncate, uniqueId) : '';
  const locationContent = renderLocation(data.genomic_pos, display.ideogram, uniqueId);
  const geneTrackContent = data.exons && data.exons.length > 0 ? renderGeneTrackContent(uniqueId) : '';
  const pathwayContent = renderPathways(data, pathwaySource, pathwayCount, uniqueId);
  const domainContent = renderDomains(data, domainCount, uniqueId);
  const transcriptContent = renderTranscripts(data, transcriptCount, uniqueId);
  const structureContent = renderStructures(data, structureCount, uniqueId);
  const generifContent = renderGeneRIFs(data, generifCount, uniqueId);
  const linksContent = renderLinksContent(data, display);
  
  // Header HTML generation (unchanged)
  const pinButtonHTML = `
    <button class="gt-pin-button" aria-label="Pin tooltip" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354"/>
      </svg>
    </button>
  `;

  return `
    <div class="gene-tooltip-content" ${inlineStyle} data-tooltip-id="${uniqueId}">
      <div class="gene-tooltip-header">
        <div class="gene-tooltip-title">
          <strong>${data.symbol}</strong>
          <span class="gene-tooltip-name">(${data.name})</span>
        </div>
        ${pinButtonHTML} 
      </div>

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
      
      ${/* Note: We use the new linksSection key for the container state, but check content existence too */ 
        linksContent ? buildSection('linksSection', 'Links', linksContent) : ''
      }
    </div>
  `;
}
