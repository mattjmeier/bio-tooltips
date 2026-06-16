import tippy, { type Instance, type Props } from 'tippy.js';
import * as cache from './cache.js';
import type {
  CoreTooltipConfig,
  EntityRef,
  FormattedItem,
  TippyInstanceWithCustoms,
  TooltipProfile,
} from './types.js';
import { generateUniqueTooltipId, createNestedContent } from '../utils.js';
import { attachPushpin } from '../ui/pushpin.js';
import { logTooltipTiming, startTooltipTiming } from './timing.js';

async function renderVisualsAndNestedTippys<TData, TConfig extends CoreTooltipConfig>(
  instance: TippyInstanceWithCustoms<TData>,
  config: TConfig,
  profile: TooltipProfile<TData, TConfig>
): Promise<void> {
  try {
    const data = instance._entityData;
    if (!data || !instance._uniqueId) return;

    logTooltipTiming(instance, config, 'visuals render start');

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
      return;
    }

    instance._visualsRendered = true;
    instance._nestedTippys = [];
    logTooltipTiming(instance, config, 'visuals render complete');

    const baseNestedOptions = { ...config.nestedTippyOptions };
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const defaultPlacement = isMobile ? 'bottom' : 'right';

    const finalNestedTippyOptions: Partial<Props> = {
      ...baseNestedOptions,
      placement: baseNestedOptions.placement ?? defaultPlacement,
      appendTo: instance.popper,
      popperOptions: config.tippyOptions.popperOptions,
      zIndex: (config.tippyOptions.zIndex || 9999) + 1,
      onShow(childInstance: Instance) {
        instance._isChildTippyVisible = true;
        const currentParentTheme = instance.props.theme || 'auto';
        childInstance.setProps({ theme: currentParentTheme });

        if (config.constrainToViewport) {
          const content = childInstance.popper.querySelector('.tippy-content');
          if (content) {
            const padding = config.tippyOptions?.popperOptions?.modifiers?.find(
              modifier => modifier.name === 'preventOverflow'
            )?.options?.padding ?? 8;
            const availableHeight = window.visualViewport?.height || window.innerHeight;
            (content as HTMLElement).style.maxHeight = `${availableHeight - (padding * 2)}px`;
          }
        }

        baseNestedOptions.onShow?.(childInstance);
      },
      onHide(childInstance: Instance) {
        instance._isChildTippyVisible = false;
        baseNestedOptions.onHide?.(childInstance);
      },
    };

    const nestedDefinitions = profile.getNestedTooltipDefinitions?.(
      data,
      config,
      instance._uniqueId
    ) ?? [];

    nestedDefinitions.forEach(definition => {
      createNestedTippy(instance, finalNestedTippyOptions, definition.selector, definition.items);
    });
    logTooltipTiming(instance, config, 'nested tippys attached', { count: nestedDefinitions.length });
  } catch (error) {
    console.error(`[${profile.id}] A critical error occurred during post-render lifecycle.`, error);
    if (instance.state.isShown) {
      instance.setContent('An error occurred rendering this tooltip.');
    }
  }
}

function scheduleVisualsAndNestedTippys<TData, TConfig extends CoreTooltipConfig>(
  instance: TippyInstanceWithCustoms<TData>,
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

    instance._visualRenderPromise = renderVisualsAndNestedTippys(instance, config, profile)
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

function createNestedTippy<TData>(
  instance: TippyInstanceWithCustoms<TData>,
  options: Partial<Props>,
  selector: string,
  items: FormattedItem[]
): void {
  const button = instance.popper.querySelector<HTMLElement>(selector);
  if (!button || items.length === 0) return;

  const nestedInstance = tippy(button, {
    ...options,
    content: createNestedContent(items),
  });
  instance._nestedTippys?.push(nestedInstance as Instance);
}

export function createOnShowHandler<TData, TConfig extends CoreTooltipConfig>(
  config: TConfig,
  profile: TooltipProfile<TData, TConfig>,
  inFlightRequests: Map<string, Promise<Map<string, TData>>>
) {
  return function onShow(instance: TippyInstanceWithCustoms<TData>) {
    instance._isFullyShown = false;
    instance._visualsRendered = false;
    startTooltipTiming(instance, config, 'onShow');

    constrainTooltipHeight(instance, config);

    const resizeHandler = () => constrainTooltipHeight(instance, config);
    (instance as any)._visualViewportResizeHandler = resizeHandler;

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
        scheduleVisualsAndNestedTippys(instance, config, profile, 'existing-instance-data');
        return;
      }

      const ref = profile.provider.parseElement(instance.reference as HTMLElement);
      if (!ref) {
        instance.setContent(profile.invalidElementMessage ?? 'Invalid tooltip element');
        return;
      }

      const cacheKey = profile.provider.getCacheKey(ref);

      const renderContent = (data: TData | null) => {
        instance._entityData = data;
        instance._geneData = data;
        logTooltipTiming(instance, config, 'content render start');
        instance.setContent(profile.renderTooltipHTML(data, { uniqueId: instance._uniqueId! }, config));
        logTooltipTiming(instance, config, 'content set');
        scheduleVisualsAndNestedTippys(instance, config, profile, 'content-set');
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
        renderContent(data);
      } catch (error) {
        console.error(`Failed to fetch data for ${describeRef(ref)}`, error);
        instance.setContent('Error loading data.');
      } finally {
        inFlightRequests.delete(cacheKey);
      }
    })();
  };
}

export function createOnShownHandler<TData, TConfig extends CoreTooltipConfig>(
  config: TConfig,
  profile: TooltipProfile<TData, TConfig>
) {
  return function onShown(instance: TippyInstanceWithCustoms<TData>) {
    instance._isFullyShown = true;
    logTooltipTiming(instance, config, 'onShown');

    if (instance._entityData !== undefined) {
      scheduleVisualsAndNestedTippys(instance, config, profile, 'onShown-fallback');
    }

    const display = config.display as { collapsible?: unknown } | undefined;
    if (display?.collapsible) {
      const popper = instance.popper;

      instance._sectionToggleHandler = (event: Event) => {
        const target = event.target as HTMLElement;
        const header = target.closest<HTMLElement>('.gt-collapsible-header');
        if (!header) return;

        if (event.type === 'keydown') {
          event.preventDefault();
        }

        const section = header.closest('.gene-tooltip-section-container');
        if (!section) return;

        const isCollapsed = section.getAttribute('data-collapsed') === 'true';
        const newCollapsedState = !isCollapsed;

        section.setAttribute('data-collapsed', String(newCollapsedState));
        header.setAttribute('aria-expanded', String(!newCollapsedState));

        const arrow = header.querySelector('.gt-section-arrow');
        if (arrow) {
          arrow.classList.toggle('collapsed', newCollapsedState);
        }

        if (!newCollapsedState && instance._entityData) {
          const sectionKey = section.getAttribute('data-section') ?? undefined;
          profile.renderVisuals?.({
            instance,
            data: instance._entityData,
            config,
            uniqueId: instance._uniqueId!,
            sectionKey,
          });
        }
      };

      instance._sectionKeydownHandler = (event: KeyboardEvent) => {
        if ((event.key === 'Enter' || event.key === ' ') && instance._sectionToggleHandler) {
          instance._sectionToggleHandler(event);
        }
      };

      popper.addEventListener('click', instance._sectionToggleHandler);
      popper.addEventListener('keydown', instance._sectionKeydownHandler);
    }

    attachPushpin(instance);
  };
}

export function createOnHideHandler() {
  return function onHide(instance: TippyInstanceWithCustoms) {
    if (instance._isPinned) {
      return false;
    }

    instance._isFullyShown = false;

    if (instance._isChildTippyVisible) {
      return false;
    }

    if (instance._tomselect) {
      instance._tomselect.destroy();
      instance._tomselect = null;
    }

    if (instance._sectionToggleHandler) {
      instance.popper.removeEventListener('click', instance._sectionToggleHandler);
      instance._sectionToggleHandler = undefined;
    }

    if (instance._sectionKeydownHandler) {
      instance.popper.removeEventListener('keydown', instance._sectionKeydownHandler);
      instance._sectionKeydownHandler = undefined;
    }

    const resizeHandler = (instance as any)._visualViewportResizeHandler;
    if (resizeHandler) {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', resizeHandler);
      } else {
        window.removeEventListener('resize', resizeHandler);
      }
      delete (instance as any)._visualViewportResizeHandler;
    }

    if (instance._nestedTippys) {
      instance._nestedTippys.forEach(nested => nested.destroy());
      instance._nestedTippys = [];
    }
  };
}

function constrainTooltipHeight(instance: TippyInstanceWithCustoms, config: CoreTooltipConfig): void {
  if (!config.constrainToViewport) return;

  const content = instance.popper.querySelector('.tippy-content');
  if (!content) return;

  const padding = config.tippyOptions?.popperOptions?.modifiers?.find(
    modifier => modifier.name === 'preventOverflow'
  )?.options?.padding ?? 8;

  const availableHeight = window.visualViewport?.height || window.innerHeight;
  (content as HTMLElement).style.maxHeight = `${availableHeight - (padding * 2)}px`;
}

function describeRef(ref: EntityRef): string {
  return ref.query;
}
