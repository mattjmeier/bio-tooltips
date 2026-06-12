import type { GenomicPosition, MyGeneInfoResult } from '../types.js';
import type { TooltipDisplayConfig } from '../config.js';
import { loaderHTML, renderListContent, renderParagraphContent } from '../../../core/renderer.js';
import { speciesMap } from '../species.js';
import {
  formatDomains,
  formatGeneRIFs,
  formatPathways,
  formatStructures,
  formatTranscripts,
} from '../formatters.js';

import NCBILogoText from '../../../assets/NLM-square-logo.svg';
const NCBILogo = `data:image/svg+xml,${encodeURIComponent(NCBILogoText)}`;
import EnsemblLogo from '../../../assets/ebang-400dpi.png';
import WikiLogoText from '../../../assets/Wikipedia-logo.svg';
const WikiLogo = `data:image/svg+xml,${encodeURIComponent(WikiLogoText)}`;

export function renderSpecies(taxid: number): string {
  const species = speciesMap[taxid] ?? { common: "Unknown", genus: "", icon: "?" };
  return `
    <div class="gene-tooltip-section gene-tooltip-species">
      <span class="gene-tooltip-species-icon">${species.icon}</span>
      <span>${species.common}, <em>${species.genus}</em></span>
    </div>
  `;
}

export function renderLocation(
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

export function renderGeneTrackContent(uniqueId: string): string {
  return `
    <div class="gene-tooltip-track-controls">
      <select class="gt-transcript-selector form-select-sm" id="transcript-selector-${uniqueId}"></select>
    </div>
    <div class="gene-tooltip-track" id="gene-tooltip-track-${uniqueId}">${loaderHTML}</div>
  `;
}

export function renderLinksContent(data: MyGeneInfoResult, display: Partial<TooltipDisplayConfig>): string {
  const linksToShow = [];

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

  if (linksToShow.length === 0) {
    return '';
  }

  return `
      <div class="gene-tooltip-links-container">
        ${linksToShow.join('')}
      </div>
    `;
}

export function renderPathways(
  data: MyGeneInfoResult,
  source: 'reactome' | 'kegg' | 'wikipathways',
  count: number,
  uniqueId: string
): string {
  const pathways = formatPathways(data.pathway?.[source], source);
  return renderParagraphContent(pathways, count, `pathways-more-${uniqueId}`);
}

export function renderDomains(data: MyGeneInfoResult, count: number, uniqueId: string): string {
  const domains = formatDomains(data.interpro);
  return renderParagraphContent(domains, count, `domains-more-${uniqueId}`);
}

export function renderTranscripts(data: MyGeneInfoResult, count: number, uniqueId: string): string {
  const transcripts = formatTranscripts(data.ensembl?.transcript);
  return renderParagraphContent(transcripts, count, `transcripts-more-${uniqueId}`);
}

export function renderStructures(data: MyGeneInfoResult, count: number, uniqueId: string): string {
  const structures = formatStructures(data.pdb);
  return renderParagraphContent(structures, count, `structures-more-${uniqueId}`);
}

export function renderGeneRIFs(data: MyGeneInfoResult, count: number, uniqueId: string): string {
  const generifs = formatGeneRIFs(data.generif);
  return renderListContent(generifs, count, `generifs-more-${uniqueId}`);
}
