import { afterEach, describe, expect, it, vi } from 'vitest';
import { logTooltipTiming, startTooltipTiming } from '../src/core/timing';
import { defaultCoreConfig } from '../src/core/config';
import type { TooltipController } from '../src/core/tooltip-controller';

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('tooltip timing diagnostics', () => {
  it.each([false, true])('measures from the latest start with debug logging enabled=%s', debugTimings => {
    let clock = 10;
    vi.stubGlobal('performance', { now: () => clock });
    const onTiming = vi.fn();
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const config = { ...defaultCoreConfig, debugTimings, onTiming };
    const controller = { _uniqueId: 'test' } as TooltipController;
    startTooltipTiming(controller, config, 'start');
    clock = 27.5;
    logTooltipTiming(controller, config, 'loaded', { source: 'cache' });
    expect(onTiming.mock.calls.map(([event]) => event)).toEqual([
      { label: 'start', tooltipId: 'test', elapsedMs: 0, timestampMs: 10 },
      { label: 'loaded', tooltipId: 'test', elapsedMs: 17.5, timestampMs: 27.5, details: { source: 'cache' } },
    ]);
    clock = 50;
    startTooltipTiming(controller, config, 'reopened');
    expect(onTiming).toHaveBeenLastCalledWith({ label: 'reopened', tooltipId: 'test', elapsedMs: 0, timestampMs: 50 });
    if (debugTimings) {
      expect(info).toHaveBeenCalledWith('[BioTooltips timing test] +17.5ms loaded {"source":"cache"}');
    } else expect(info).not.toHaveBeenCalled();
  });

  it('uses the wall clock when performance is unavailable and supports events without a tooltip instance', () => {
    vi.stubGlobal('performance', undefined);
    vi.spyOn(Date, 'now').mockReturnValue(1234);
    const onTiming = vi.fn();
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    logTooltipTiming(undefined, { ...defaultCoreConfig, onTiming, debugTimings: true }, 'preload');
    expect(onTiming).toHaveBeenCalledExactlyOnceWith({ label: 'preload', elapsedMs: 0, timestampMs: 1234 });
    expect(info).toHaveBeenCalledWith('[BioTooltips timing] +0.0ms preload');
  });

  it('does no clock or observer work when timing is disabled', () => {
    const now = vi.fn();
    vi.stubGlobal('performance', { now });
    const controller = { _timingStart: 1 } as TooltipController;
    startTooltipTiming(controller, defaultCoreConfig, 'start');
    logTooltipTiming(controller, defaultCoreConfig, 'loaded');
    expect(controller._timingStart).toBe(1);
    expect(now).not.toHaveBeenCalled();
  });

  it('warns about observer errors in debug mode and still emits the diagnostic log', () => {
    const error = new Error('Observer failed');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.stubGlobal('performance', { now: () => 10 });
    expect(() => logTooltipTiming(undefined, {
      ...defaultCoreConfig, debugTimings: true, onTiming: () => { throw error; },
    }, 'loaded')).not.toThrow();
    expect(warn).toHaveBeenCalledWith('[BioTooltips timing] Timing observer threw an error.', error);
    expect(info).toHaveBeenCalledWith('[BioTooltips timing] +0.0ms loaded');
  });
});
