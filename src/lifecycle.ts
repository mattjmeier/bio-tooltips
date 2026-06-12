import type { GeneTooltipConfig, MyGeneInfoResult } from './config.js';
import {
  createOnHideHandler,
  createOnShowHandler as createCoreOnShowHandler,
  createOnShownHandler as createCoreOnShownHandler,
} from './core/lifecycle.js';
import type { TippyInstanceWithCustoms } from './core/types.js';
import { myGeneProfile } from './providers/mygene/profile.js';

export type { TippyInstanceWithCustoms };

export function createOnShowHandler(
  config: GeneTooltipConfig,
  inFlightRequests: Map<string, Promise<Map<string, MyGeneInfoResult>>>
) {
  return createCoreOnShowHandler(config, myGeneProfile, inFlightRequests);
}

export function createOnShownHandler(config: GeneTooltipConfig) {
  return createCoreOnShownHandler(config, myGeneProfile);
}

export { createOnHideHandler };
