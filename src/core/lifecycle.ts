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

async function renderVisualsAndNestedTippys<TData, TConfig extends CoreTooltipConfig>(
  instance: TippyInstanceWithCustoms<TData>,
  config: TConfig,
  profile: TooltipProfile<TData, TConfig>
): Promise<void> {
  try {
    const data = instance._entityData;
    if (!data || !instance._uniqueId) return;

    await profile.renderVisuals?.({
      instance,
      data,
      config,
      uniqueId: instance._uniqueId,
    });

    if (!instance.state.isShown) {
      return;
    }

    instance._visualsRendered = true;
    instance._nestedTippys = [];

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
  } catch (error) {
    console.error(`[${profile.id}] A critical error occurred during post-render lifecycle.`, error);
    if (instance.state.isShown) {
      instance.setContent('An error occurred rendering this tooltip.');
    }
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
      }
      if (instance._entityData !== undefined) return;

      const ref = profile.provider.parseElement(instance.reference as HTMLElement);
      if (!ref) {
        instance.setContent(profile.invalidElementMessage ?? 'Invalid tooltip element');
        return;
      }

      const cacheKey = profile.provider.getCacheKey(ref);

      const renderContent = (data: TData | null) => {
        instance._entityData = data;
        instance._geneData = data;
        instance.setContent(profile.renderTooltipHTML(data, { uniqueId: instance._uniqueId! }, config));
        if (instance._isFullyShown) {
          renderVisualsAndNestedTippys(instance, config, profile);
        }
      };

      const cachedData = cache.get<TData>(cacheKey);
      if (typeof cachedData !== 'undefined') {
        renderContent(cachedData);
        return;
      }

      instance.setContent('Loading...');

      let fetchPromise = inFlightRequests.get(cacheKey);
      if (!fetchPromise) {
        fetchPromise = profile.provider.fetchBatch([ref]);
        inFlightRequests.set(cacheKey, fetchPromise);
      }

      try {
        const resultsMap = await fetchPromise;
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

    if (instance._entityData !== undefined) {
      renderVisualsAndNestedTippys(instance, config, profile);
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
