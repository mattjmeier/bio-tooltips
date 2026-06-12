import type { TooltipProfile } from '../../core/types.js';
import type { MyChemTooltipConfig } from './config.js';
import {
  fetchMyChemRefs,
  getMyChemCacheKey,
  normalizeMyChemLookupMode,
  normalizeMyChemScope,
} from './client.js';
import { parseChemicalElement } from './parser.js';
import type { MyChemInfoResult } from './types.js';
import { getMyChemNestedTooltipDefinitions, renderMyChemTooltipFromConfig } from './renderer.js';

export const myChemProfile: TooltipProfile<MyChemInfoResult, MyChemTooltipConfig> = {
  id: 'mychem',
  invalidElementMessage: 'Invalid chemical element',
  notFoundHTML: '<p>Chemical not found.</p>',
  provider: {
    id: 'mychem',
    parseElement: parseChemicalElement,
    getCacheKey(ref) {
      const scope = normalizeMyChemScope(ref.context?.scope);
      return getMyChemCacheKey(ref.query, scope, normalizeMyChemLookupMode(ref.context?.lookup, scope));
    },
    fetchBatch: fetchMyChemRefs,
  },
  renderTooltipHTML(data, options, config) {
    return renderMyChemTooltipFromConfig(data, options.uniqueId, config);
  },
  getNestedTooltipDefinitions(data, config, uniqueId) {
    return getMyChemNestedTooltipDefinitions(data, config, uniqueId);
  },
};
