import type { CoreTooltipConfig, TooltipProfile } from './types.js';
import { TooltipController } from './tooltip-controller.js';
import { cleanupTooltipLifecycle, createHideHandler, createShowHandler, createShownHandler } from './lifecycle.js';
import { runPrefetch } from './prefetch.js';
import { enableSummaryExpand } from '../ui/summaryExpand.js';
import { getEffectiveTheme, initializeThemeObserver } from '../ui/theme.js';
import { installNestedListFilter } from '../utils.js';
import { logTooltipTiming } from './timing.js';

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
  let lastPrefetchPromise: Promise<void> = Promise.resolve();

  function init(userConfig: Partial<TConfig> = {}): () => void {
    const config = options.mergeConfig(userConfig);
    let instances: TooltipController<TData>[] = [];
    lastPrefetchPromise = Promise.resolve();

    const elements = options.findElements(config.selector);
    if (elements.length === 0) {
      return () => {};
    }

    const effectiveTheme = getEffectiveTheme(config.theme);
    const isAutoTheme = config.theme === 'auto' || typeof config.theme === 'undefined';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const showHandler = createShowHandler(config, options.profile, inFlightRequests);
    const shownHandler = createShownHandler(config, options.profile);
    const hideHandler = createHideHandler<TData>();
    const tooltipOptions = {
      ...config.tooltipOptions,
      ...(prefersReducedMotion ? { showDuration: 0, hideDuration: 0 } : {}),
    } as TConfig['tooltipOptions'];

    instances = elements.map(element => new TooltipController<TData>(element, {
      tooltip: tooltipOptions,
      theme: effectiveTheme,
      maxWidth: config.tooltipWidth,
      maxHeight: config.tooltipHeight,
      constrainToViewport: config.constrainToViewport,
      interactiveBorder: 2,
      interactiveDebounce: 75,
      hooks: {
        onShow: showHandler,
        onShown: shownHandler,
        onHide: hideHandler,
        onDestroy: cleanupTooltipLifecycle,
      },
    }));

    instances.forEach(instance => {
      instance._themeIntent = isAutoTheme ? 'auto' : config.theme;
    });

    const disconnectThemeObserver = initializeThemeObserver(instances, isAutoTheme);
    const disconnectVisualPreloadWarmup = initializeVisualPreloadWarmup(
      elements,
      config,
      options.profile
    );

    lastPrefetchPromise = runPrefetch(
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
    installNestedListFilter();

    return () => {
      instances.forEach(instance => {
        instance.destroy();
      });
      disconnectThemeObserver();
      disconnectVisualPreloadWarmup();
      instances = [];
    };
  }

  function preload(): Promise<unknown> {
    return options.profile.preload?.() ?? Promise.resolve([]);
  }

  function whenPrefetchReady(): Promise<void> {
    return lastPrefetchPromise;
  }

  return {
    init,
    preload,
    whenPrefetchReady,
  };
}

function initializeVisualPreloadWarmup<TData, TConfig extends CoreTooltipConfig>(
  elements: HTMLElement[],
  config: TConfig,
  profile: TooltipProfile<TData, TConfig>
): () => void {
  if (!profile.preload || config.visualPreload === 'none') {
    return () => {};
  }

  let hasStarted = false;
  const preloadOnce = () => {
    if (hasStarted) return;
    hasStarted = true;
    logTooltipTiming(undefined, config, 'visual preload start', { mode: config.visualPreload });
    profile.preload?.()
      .then(() => {
        logTooltipTiming(undefined, config, 'visual preload complete', { mode: config.visualPreload });
      })
      .catch(error => {
        console.error(`[${profile.id}] Failed to preload visual dependencies.`, error);
      });
  };

  if (config.visualPreload === 'init') {
    preloadOnce();
    return () => {};
  }

  elements.forEach(el => {
    el.addEventListener('mouseenter', preloadOnce, { capture: true, once: true });
    el.addEventListener('focus', preloadOnce, { capture: true, once: true });
  });

  return () => {
    elements.forEach(el => {
      el.removeEventListener('mouseenter', preloadOnce, true);
      el.removeEventListener('focus', preloadOnce, true);
    });
  };
}
