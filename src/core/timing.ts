import type { CoreTooltipConfig, TooltipTimingEvent } from './config.js';
import type { TooltipController } from './tooltip-controller.js';

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

export function startTooltipTiming(
  instance: TooltipController<any>,
  config: CoreTooltipConfig,
  label: string
): void {
  if (!config.debugTimings && !config.onTiming) return;

  instance._timingStart = now();
  logTooltipTiming(instance, config, label);
}

export function logTooltipTiming(
  instance: TooltipController<any> | undefined,
  config: CoreTooltipConfig,
  label: string,
  details?: Record<string, unknown>
): void {
  if (!config.debugTimings && !config.onTiming) return;

  const start = instance?._timingStart ?? now();
  const elapsed = now() - start;
  const tooltipId = instance?._uniqueId;
  const event: TooltipTimingEvent = {
    label,
    elapsedMs: elapsed,
    timestampMs: now(),
    ...(tooltipId ? { tooltipId } : {}),
    ...(details ? { details } : {}),
  };

  if (config.onTiming) {
    try {
      config.onTiming(event);
    } catch (error) {
      if (config.debugTimings) {
        console.warn('[BioTooltips timing] Timing observer threw an error.', error);
      }
    }
  }

  if (!config.debugTimings) return;

  const id = instance?._uniqueId ? ` ${instance._uniqueId}` : '';
  const suffix = details ? ` ${JSON.stringify(details)}` : '';

  console.info(`[BioTooltips timing${id}] +${elapsed.toFixed(1)}ms ${label}${suffix}`);
}
