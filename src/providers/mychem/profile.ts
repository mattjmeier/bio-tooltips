import type { TooltipProfile } from '../../core/types.js';
import type { MyChemTooltipConfig } from './config.js';
import { fetchMyChemRefs, getMyChemCacheKey, normalizeMyChemScope } from './client.js';
import { parseChemicalElement } from './parser.js';
import type { MyChemInfoResult } from './types.js';
import { renderMyChemTooltipFromConfig } from './renderer.js';

export const myChemProfile: TooltipProfile<MyChemInfoResult, MyChemTooltipConfig> = {
  id: 'mychem',
  invalidElementMessage: 'Invalid chemical element',
  notFoundHTML: '<p>Chemical not found.</p>',
  provider: {
    id: 'mychem',
    parseElement: parseChemicalElement,
    getCacheKey(ref) {
      return getMyChemCacheKey(ref.query, normalizeMyChemScope(ref.context?.scope));
    },
    fetchBatch: fetchMyChemRefs,
  },
  renderTooltipHTML(data, options, config) {
    return renderMyChemTooltipFromConfig(data, options.uniqueId, config);
  },
};
