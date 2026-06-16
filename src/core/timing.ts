import type { CoreTooltipConfig } from './config.js';
import type { TippyInstanceWithCustoms } from './types.js';

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

export function startTooltipTiming(
  instance: TippyInstanceWithCustoms,
  config: CoreTooltipConfig,
  label: string
): void {
  if (!config.debugTimings) return;

  instance._timingStart = now();
  logTooltipTiming(instance, config, label);
}

export function logTooltipTiming(
  instance: TippyInstanceWithCustoms | undefined,
  config: CoreTooltipConfig,
  label: string,
  details?: Record<string, unknown>
): void {
  if (!config.debugTimings) return;

  const start = instance?._timingStart ?? now();
  const elapsed = now() - start;
  const id = instance?._uniqueId ? ` ${instance._uniqueId}` : '';
  const suffix = details ? ` ${JSON.stringify(details)}` : '';

  console.info(`[BioTooltips timing${id}] +${elapsed.toFixed(1)}ms ${label}${suffix}`);
}
