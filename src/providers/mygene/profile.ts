import type { TooltipProfile, TippyInstanceWithCustoms } from '../../core/types.js';
import type { GeneTooltipConfig } from './config.js';
import type { MyGeneInfoResult } from './types.js';
import { fetchMyGeneRefs, getMyGeneCacheKey } from './client.js';
import { parseGeneElement } from './parser.js';
import { renderTooltipHTML } from './renderer.js';
import { renderIdeogram } from './visuals/ideogram.js';
import { renderGeneTrack } from './visuals/gene-track.js';
import { getIdeogram } from './visuals/ideogram.js';
import { getD3 } from './visuals/gene-track.js';
import { getMyGeneNestedTooltipDefinitions } from './sections/index.js';
import { logTooltipTiming } from '../../core/timing.js';

async function renderMyGeneVisuals(
  instance: TippyInstanceWithCustoms<MyGeneInfoResult>,
  data: MyGeneInfoResult,
  config: GeneTooltipConfig,
  uniqueId: string,
  sectionKey?: string
): Promise<void> {
  const renderPromises: Promise<void>[] = [];

  const locationSection = instance.popper.querySelector('[data-section="location"]');
  const isLocationCollapsed = locationSection?.getAttribute('data-collapsed') === 'true';

  const geneModelSection = instance.popper.querySelector('[data-section="gene-model"]');
  const isGeneModelCollapsed = geneModelSection?.getAttribute('data-collapsed') === 'true';

  const shouldRenderGeneTrack = sectionKey
    ? sectionKey === 'gene-model'
    : !isGeneModelCollapsed;

  const shouldRenderIdeogram = sectionKey
    ? sectionKey === 'location'
    : !isLocationCollapsed;

  if (config.display.geneTrack && data.exons && shouldRenderGeneTrack) {
    renderPromises.push(renderGeneTrack(instance, data, uniqueId, config));
  }

  if (config.ideogram?.enabled && data.genomic_pos && shouldRenderIdeogram) {
    renderPromises.push(renderIdeogram(instance, data, config.ideogram, uniqueId, config));
  }

  await Promise.allSettled(renderPromises);
  logTooltipTiming(instance, config, 'mygene visual promises settled', { count: renderPromises.length });
}

export const myGeneProfile: TooltipProfile<MyGeneInfoResult, GeneTooltipConfig> = {
  id: 'mygene',
  invalidElementMessage: 'Invalid gene element',
  notFoundHTML: '<p>Gene not found.</p>',
  provider: {
    id: 'mygene',
    parseElement: parseGeneElement,
    getCacheKey(ref) {
      return getMyGeneCacheKey(ref.query, Number(ref.context?.taxid));
    },
    fetchBatch: fetchMyGeneRefs,
  },
  renderTooltipHTML(data, options, config) {
    return renderTooltipHTML(data, {
      truncate: config.truncateSummary,
      display: config.display,
      pathwaySource: config.pathwaySource,
      pathwayCount: config.pathwayCount,
      domainCount: config.domainCount,
      transcriptCount: config.transcriptCount,
      structureCount: config.structureCount,
      generifCount: config.generifCount,
      tooltipHeight: config.tooltipHeight,
      sectionVariant: config.sectionVariant,
      uniqueId: options.uniqueId,
    });
  },
  renderVisuals({ instance, data, config, uniqueId, sectionKey }) {
    return renderMyGeneVisuals(instance, data, config, uniqueId, sectionKey);
  },
  getNestedTooltipDefinitions(data, config, uniqueId) {
    return getMyGeneNestedTooltipDefinitions(data, config, uniqueId);
  },
  preload() {
    return Promise.allSettled([
      getD3(),
      getIdeogram(),
    ]);
  },
};
