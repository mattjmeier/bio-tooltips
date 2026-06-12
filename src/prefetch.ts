import { runPrefetch as runCorePrefetch } from './core/prefetch.js';
import type { MyGeneInfoResult } from './config.js';
import { myGeneProfile } from './providers/mygene/profile.js';

export function runPrefetch(
  strategy: 'smart' | 'all' | 'none',
  elements: HTMLElement[],
  threshold: number,
  inFlightRequests: Map<string, Promise<Map<string, MyGeneInfoResult>>>
): void {
  runCorePrefetch(strategy, elements, threshold, inFlightRequests, myGeneProfile.provider);
}
