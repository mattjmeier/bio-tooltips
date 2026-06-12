import type { TooltipDisplayConfig } from '../config.js';
import type { MyGeneInfoResult } from '../types.js';
import type { MyGeneSectionDefinition } from './types.js';

import NCBILogoText from '../../../assets/NLM-square-logo.svg';
const NCBILogo = `data:image/svg+xml,${encodeURIComponent(NCBILogoText)}`;
import EnsemblLogo from '../../../assets/ebang-400dpi.png';
import WikiLogoText from '../../../assets/Wikipedia-logo.svg';
const WikiLogo = `data:image/svg+xml,${encodeURIComponent(WikiLogoText)}`;

function renderLinksContent(data: MyGeneInfoResult, display: Partial<TooltipDisplayConfig>): string {
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

export const linksSection: MyGeneSectionDefinition = {
  key: 'linksSection',
  title: 'Links',
  render({ data, display }) {
    return renderLinksContent(data, display);
  },
};
