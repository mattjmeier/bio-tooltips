import { loaderHTML } from '../../../core/renderer.js';
import type { GenomicPosition } from '../types.js';
import type { MyGeneSectionDefinition } from './types.js';

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

export const locationSection: MyGeneSectionDefinition = {
  key: 'location',
  title: 'Location',
  render({ data, display, uniqueId }) {
    return renderLocation(data.genomic_pos, display.ideogram, uniqueId);
  },
};
