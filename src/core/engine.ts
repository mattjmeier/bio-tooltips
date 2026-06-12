import tippy from 'tippy.js';
import type { CoreTooltipConfig, TippyInstanceWithCustoms, TooltipProfile } from './types.js';
import { createOnHideHandler, createOnShowHandler, createOnShownHandler } from './lifecycle.js';
import { runPrefetch } from './prefetch.js';
import { enableSummaryExpand } from '../ui/summaryExpand.js';
import { getEffectiveTheme, initializeThemeObserver } from '../ui/theme.js';

let isSummaryHandlerEnabled = false;

interface TooltipEngineOptions<TData, TConfig extends CoreTooltipConfig> {
  profile: TooltipProfile<TData, TConfig>;
  mergeConfig: (userConfig?: Partial<TConfig>) => TConfig;
  findElements: (selector: string) => HTMLElement[];
}

export function createTooltipEngine<TData, TConfig extends CoreTooltipConfig>(
  options: TooltipEngineOptions<TData, TConfig>
) {
  const inFlightRequests = new Map<string, Promise<Map<string, TData>>>();

  function init(userConfig: Partial<TConfig> = {}): () => void {
    const config = options.mergeConfig(userConfig);
    let instances: TippyInstanceWithCustoms<TData>[] = [];

    const elements = options.findElements(config.selector);
    if (elements.length === 0) {
      return () => {};
    }

    const effectiveTheme = getEffectiveTheme(config.theme);
    const isAutoTheme = config.theme === 'auto' || typeof config.theme === 'undefined';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    instances = tippy(elements, {
      ...config.tippyOptions,
      animation: prefersReducedMotion ? 'shift-away' : config.tippyOptions.animation,
      duration: prefersReducedMotion ? [0, 0] : config.tippyOptions.duration,
      theme: effectiveTheme,
      maxWidth: config.tooltipWidth ?? config.tippyOptions.maxWidth,
      onShow: createOnShowHandler(config, options.profile, inFlightRequests),
      onShown: createOnShownHandler(config, options.profile),
      onHide: createOnHideHandler(),
    }) as TippyInstanceWithCustoms<TData>[];

    instances.forEach(instance => {
      instance._themeIntent = isAutoTheme ? 'auto' : config.theme;
    });

    const disconnectThemeObserver = initializeThemeObserver(instances, isAutoTheme);

    runPrefetch(
      config.prefetch,
      elements,
      config.prefetchThreshold,
      inFlightRequests,
      options.profile.provider
    );

    if (!isSummaryHandlerEnabled) {
      enableSummaryExpand();
      isSummaryHandlerEnabled = true;
    }

    return () => {
      instances.forEach(instance => {
        if (instance && instance.destroy) {
          instance.destroy();
        }
      });
      disconnectThemeObserver();
      instances = [];
    };
  }

  function preload(): Promise<unknown> {
    return options.profile.preload?.() ?? Promise.resolve([]);
  }

  return {
    init,
    preload,
  };
}
