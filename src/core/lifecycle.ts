import * as cache from './cache.js';
import type {
  CoreTooltipConfig,
  EntityRef,
  FormattedItem,
  TooltipProfile,
} from './types.js';
import type { TooltipOptions } from './config.js';
import { TooltipController } from './tooltip-controller.js';
import { getDefaultFallbackPlacements } from './positioning.js';
import { generateUniqueTooltipId, createNestedContent } from '../utils.js';
import { attachPushpin } from '../ui/pushpin.js';
import { logTooltipTiming, startTooltipTiming } from './timing.js';

const COLLAPSIBLE_HEIGHT_CLEANUP_DELAY = 300;
const pendingCollapsibleHeightCleanups = new WeakMap<HTMLElement, () => void>();

async function renderVisualsAndNestedTooltips<TData, TConfig extends CoreTooltipConfig>(
  instance: TooltipController<TData>,
  config: TConfig,
  profile: TooltipProfile<TData, TConfig>
): Promise<void> {
  try {
    const data = instance._entityData;
    if (!data || !instance._uniqueId) return;

    logTooltipTiming(instance, config, 'visuals render start');

    instance.destroyNestedTooltips();

    await profile.renderVisuals?.({
      instance,
      data,
      config,
      uniqueId: instance._uniqueId,
    });

    if (instance.state.isDestroyed || !instance.state.isMounted) {
      logTooltipTiming(instance, config, 'visuals completion skipped', {
        reason: 'not-mounted',
        isDestroyed: instance.state.isDestroyed,
        isMounted: instance.state.isMounted,
        isShown: instance.state.isShown,
        isVisible: instance.state.isVisible,
      });
      instance.destroyNestedTooltips();
      return;
    }

    instance._visualsRendered = true;
    logTooltipTiming(instance, config, 'visuals render complete');

    const baseNestedOptions = { ...config.nestedTooltipOptions } as TooltipOptions;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const defaultPlacement = isMobile ? 'bottom' : 'right';

    const resolvedPlacement = baseNestedOptions.placement ?? defaultPlacement;
    const finalNestedTooltipOptions = ({
      ...baseNestedOptions,
      placement: resolvedPlacement,
      ...(
        resolvedPlacement !== 'auto' && !baseNestedOptions.fallbackPlacements
          ? { fallbackPlacements: getDefaultFallbackPlacements(resolvedPlacement) }
          : {}
      ),
      appendTo: instance.root,
      zIndex: baseNestedOptions.zIndex ?? ((config.tooltipOptions.zIndex ?? 9999) + 1),
    } as TooltipOptions);

    const nestedDefinitions = profile.getNestedTooltipDefinitions?.(
      data,
      config,
      instance._uniqueId
    ) ?? [];

    nestedDefinitions.forEach(definition => {
      createNestedTooltip(instance, finalNestedTooltipOptions, definition.selector, definition.items, config);
    });
    logTooltipTiming(instance, config, 'nested tooltips attached', { count: nestedDefinitions.length });
  } catch (error) {
    console.error(`[${profile.id}] A critical error occurred during post-render lifecycle.`, error);
    if (instance.state.isShown) {
      instance.setContent('An error occurred rendering this tooltip.');
    }
  }
}

function scheduleVisualsAndNestedTooltips<TData, TConfig extends CoreTooltipConfig>(
  instance: TooltipController<TData>,
  config: TConfig,
  profile: TooltipProfile<TData, TConfig>,
  reason: string
): void {
  if (instance._visualsRendered || instance._visualRenderPromise) {
    logTooltipTiming(instance, config, 'visuals schedule skipped', {
      reason,
      rendered: Boolean(instance._visualsRendered),
      pending: Boolean(instance._visualRenderPromise),
    });
    return;
  }

  logTooltipTiming(instance, config, 'visuals scheduled', { reason });

  const run = () => {
    if (instance.state.isDestroyed || !instance.state.isMounted) {
      logTooltipTiming(instance, config, 'visuals skipped before run', {
        reason: 'not-mounted',
        isDestroyed: instance.state.isDestroyed,
        isMounted: instance.state.isMounted,
        isShown: instance.state.isShown,
        isVisible: instance.state.isVisible,
      });
      return;
    }

    instance._visualRenderPromise = renderVisualsAndNestedTooltips(instance, config, profile)
      .finally(() => {
        instance._visualRenderPromise = undefined;
      });
  };

  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(run);
  } else {
    setTimeout(run, 0);
  }
}

function createNestedTooltip<TData>(
  instance: TooltipController<TData>,
  options: TooltipOptions,
  selector: string,
  items: FormattedItem[],
  config: CoreTooltipConfig
): void {
  const button = instance.root.querySelector<HTMLElement>(selector);
  if (!button || items.length === 0) return;

  const nestedInstance = new TooltipController(button, {
    tooltip: options,
    content: createNestedContent(items),
    theme: instance.theme,
    constrainToViewport: config.constrainToViewport,
    interactiveBorder: 20,
    interactiveDebounce: 75,
    parent: instance,
  });
  instance.addNestedTooltip(nestedInstance);
}

export function createShowHandler<TData, TConfig extends CoreTooltipConfig>(
  config: TConfig,
  profile: TooltipProfile<TData, TConfig>,
  inFlightRequests: Map<string, Promise<Map<string, TData>>>
) {
  return function onShow(instance: TooltipController<TData>) {
    instance._visualsRendered = false;
    startTooltipTiming(instance, config, 'onShow');

    constrainTooltipHeight(instance, config);

    const resizeHandler = () => constrainTooltipHeight(instance, config);
    instance._visualViewportResizeHandler = resizeHandler;

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', resizeHandler);
    } else {
      window.addEventListener('resize', resizeHandler);
    }

    (async () => {
      if (!instance._uniqueId) {
        instance._uniqueId = generateUniqueTooltipId();
        logTooltipTiming(instance, config, 'unique id assigned');
      }
      if (instance._entityData !== undefined) {
        logTooltipTiming(instance, config, 'instance data already available');
        scheduleVisualsAndNestedTooltips(instance, config, profile, 'existing-instance-data');
        return;
      }

      const ref = profile.provider.parseElement(instance.reference as HTMLElement);
      if (!ref) {
        instance.setContent(profile.invalidElementMessage ?? 'Invalid tooltip element');
        return;
      }

      const cacheKey = profile.provider.getCacheKey(ref);

      const renderContent = (data: TData | null) => {
        if (instance.state.isDestroyed) return;
        instance._entityData = data;
        instance._renderedVisualSections = new Set();
        instance._renderingVisualSections = new Set();
        logTooltipTiming(instance, config, 'content render start');
        instance.setContent(profile.renderTooltipHTML(data, { uniqueId: instance._uniqueId! }, config));
        attachPushpin(instance);
        logTooltipTiming(instance, config, 'content set');
        scheduleVisualsAndNestedTooltips(instance, config, profile, 'content-set');
      };

      const cachedData = cache.get<TData>(cacheKey);
      if (typeof cachedData !== 'undefined') {
        logTooltipTiming(instance, config, 'cache hit');
        renderContent(cachedData);
        return;
      }

      instance.setContent('Loading...');
      logTooltipTiming(instance, config, 'loading content set');

      let fetchPromise = inFlightRequests.get(cacheKey);
      if (!fetchPromise) {
        logTooltipTiming(instance, config, 'fetch start', { cacheKey });
        fetchPromise = profile.provider.fetchBatch([ref]);
        inFlightRequests.set(cacheKey, fetchPromise);
      } else {
        logTooltipTiming(instance, config, 'fetch joined', { cacheKey });
      }

      try {
        const resultsMap = await fetchPromise;
        logTooltipTiming(instance, config, 'fetch complete', { cacheKey });
        const data = resultsMap.get(cacheKey) || null;
        cache.set(cacheKey, data);
        if (!instance.state.isDestroyed) renderContent(data);
      } catch (error) {
        console.error(`Failed to fetch data for ${describeRef(ref)}`, error);
        if (!instance.state.isDestroyed) instance.setContent('Error loading data.');
      } finally {
        inFlightRequests.delete(cacheKey);
      }
    })();
  };
}

export function createShownHandler<TData, TConfig extends CoreTooltipConfig>(
  config: TConfig,
  profile: TooltipProfile<TData, TConfig>
) {
  return function onShown(instance: TooltipController<TData>) {
    logTooltipTiming(instance, config, 'onShown');

    if (instance._entityData !== undefined) {
      scheduleVisualsAndNestedTooltips(instance, config, profile, 'onShown-fallback');
    }

    const display = config.display as { collapsible?: unknown } | undefined;
    if (display?.collapsible) {
      const tooltipRoot = instance.root;

      instance._sectionToggleHandler = (event: Event) => {
        const target = event.target as HTMLElement;
        const header = target.closest<HTMLElement>('.gt-collapsible-header');
        if (!header) return;

        const nestedControl = target.closest<HTMLElement>('a, button, input, select, textarea');
        if (nestedControl && nestedControl !== header) return;

        if (event.type === 'keydown') {
          event.preventDefault();
        }

        const section = header.closest('.gene-tooltip-section-container');
        if (!section) return;

        const isCollapsed = section.getAttribute('data-collapsed') === 'true';
        const newCollapsedState = !isCollapsed;
        const content = section.querySelector<HTMLElement>('.gt-collapsible-content');

        if (content) {
          pendingCollapsibleHeightCleanups.get(content)?.();
          const measuredHeight = Math.ceil(content.scrollHeight);
          content.style.setProperty('--gt-collapsible-content-height', `${measuredHeight}px`);

          if (!newCollapsedState) {
            let cleanupTimer: ReturnType<typeof setTimeout> | undefined;
            const finishHeightTransition = (releaseHeight: boolean) => {
              content.removeEventListener('transitionend', clearMeasuredHeight);
              if (cleanupTimer) clearTimeout(cleanupTimer);
              if (releaseHeight && section.getAttribute('data-collapsed') === 'false') {
                content.style.removeProperty('--gt-collapsible-content-height');
              }
              pendingCollapsibleHeightCleanups.delete(content);
            };
            const clearMeasuredHeight = (transitionEvent: TransitionEvent) => {
              if (transitionEvent.target !== content || transitionEvent.propertyName !== 'height') return;
              finishHeightTransition(true);
            };
            content.addEventListener('transitionend', clearMeasuredHeight);
            cleanupTimer = setTimeout(
              () => finishHeightTransition(true),
              COLLAPSIBLE_HEIGHT_CLEANUP_DELAY
            );
            pendingCollapsibleHeightCleanups.set(content, () => finishHeightTransition(false));
          } else {
            // Establish the measured height before changing to zero so the browser can animate from it.
            void content.offsetHeight;
          }
        }

        section.setAttribute('data-collapsed', String(newCollapsedState));
        header.setAttribute('aria-expanded', String(!newCollapsedState));

        const arrow = header.querySelector('.gt-section-arrow');
        if (arrow) {
          arrow.classList.toggle('collapsed', newCollapsedState);
        }

        if (!newCollapsedState && instance._entityData) {
          const sectionKey = section.getAttribute('data-section') ?? undefined;
          const renderedSections = instance._renderedVisualSections ??= new Set();
          const renderingSections = instance._renderingVisualSections ??= new Set();

          if (sectionKey && (renderedSections.has(sectionKey) || renderingSections.has(sectionKey))) {
            logTooltipTiming(instance, config, 'section visuals render skipped', {
              sectionKey,
              reason: renderedSections.has(sectionKey) ? 'already-rendered' : 'already-rendering',
            });
            return;
          }

          if (sectionKey) renderingSections.add(sectionKey);
          void Promise.resolve(profile.renderVisuals?.({
            instance,
            data: instance._entityData,
            config,
            uniqueId: instance._uniqueId!,
            sectionKey,
          }))
            .then(() => {
              if (sectionKey) renderedSections.add(sectionKey);
            })
            .catch(error => {
              console.error(`[${profile.id}] Failed to render section visuals.`, error);
            })
            .finally(() => {
              if (sectionKey) renderingSections.delete(sectionKey);
            });
        }
      };

      instance._sectionKeydownHandler = (event: KeyboardEvent) => {
        if ((event.key === 'Enter' || event.key === ' ') && instance._sectionToggleHandler) {
          instance._sectionToggleHandler(event);
        }
      };

      tooltipRoot.addEventListener('click', instance._sectionToggleHandler);
      tooltipRoot.addEventListener('keydown', instance._sectionKeydownHandler);
    }

    attachPushpin(instance);
  };
}

export function createHideHandler<TData = unknown>() {
  return function onHide(instance: TooltipController<TData>) {
    if (instance._isPinned) {
      return false;
    }

    if (instance._sectionToggleHandler) {
      instance.root.removeEventListener('click', instance._sectionToggleHandler);
      instance._sectionToggleHandler = undefined;
    }

    if (instance._sectionKeydownHandler) {
      instance.root.removeEventListener('keydown', instance._sectionKeydownHandler);
      instance._sectionKeydownHandler = undefined;
    }

    const resizeHandler = instance._visualViewportResizeHandler;
    if (resizeHandler) {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', resizeHandler);
      } else {
        window.removeEventListener('resize', resizeHandler);
      }
      instance._visualViewportResizeHandler = undefined;
    }

    instance.destroyNestedTooltips();
  };
}

export function cleanupTooltipLifecycle<TData>(instance: TooltipController<TData>): void {
  instance._isPinned = false;
  createHideHandler<TData>()(instance);
}

function constrainTooltipHeight(instance: TooltipController<any>, config: CoreTooltipConfig): void {
  if (!config.constrainToViewport) return;

  const content = instance.content;
  if (!content) return;

  const padding = config.tooltipOptions.viewportPadding ?? 8;

  const availableHeight = window.visualViewport?.height || window.innerHeight;
  (content as HTMLElement).style.maxHeight = `${availableHeight - (padding * 2)}px`;
}

function describeRef(ref: EntityRef): string {
  return ref.query;
}
