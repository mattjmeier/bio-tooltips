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
import { renderCloseButton } from './renderer.js';

const COLLAPSIBLE_HEIGHT_CLEANUP_DELAY = 300;
const pendingCollapsibleHeightCleanups = new WeakMap<HTMLElement, () => void>();
const scheduledVisuals = new WeakSet<TooltipController<any>>();
const statusRegions = new WeakMap<TooltipController<any>, HTMLElement>();
const closeHandlers = new WeakMap<TooltipController<any>, (event: Event) => void>();

function installCloseHandler<TData>(instance: TooltipController<TData>): void {
  if (closeHandlers.has(instance)) return;
  const handler = (event: Event) => {
    const target = (event.target as HTMLElement).closest('.gt-close-button');
    if (target && target.closest('[data-gt-tooltip-root]') === instance.root) instance.close();
  };
  instance.root.addEventListener('click', handler);
  closeHandlers.set(instance, handler);
}

function removeCloseHandler(instance: TooltipController<any>): void {
  const handler = closeHandlers.get(instance);
  if (handler) instance.root.removeEventListener('click', handler);
  closeHandlers.delete(instance);
}

function announce(instance: TooltipController<any>, message: string, busy = false): void {
  let status = statusRegions.get(instance);
  if (!status) {
    status = document.createElement('div');
    status.className = 'gt-sr-only gt-panel-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    instance.box.append(status);
    statusRegions.set(instance, status);
  }
  instance.content.setAttribute('aria-busy', String(busy));
  status.textContent = message;
}

function setMessageContent(instance: TooltipController<any>, message: string): void {
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  instance.setContent(`${renderCloseButton('Close details')}${paragraph.outerHTML}`);
}

async function renderVisualsAndNestedTooltips<TData, TConfig extends CoreTooltipConfig>(
  instance: TooltipController<TData>,
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
      instance.destroyNestedTooltips();
      return;
    }

    instance._visualsRendered = true;
    logTooltipTiming(instance, config, 'visuals render complete');

  } catch (error) {
    console.error(`[${profile.id}] A critical error occurred during post-render lifecycle.`, error);
    if (instance.state.isShown) announce(instance, 'Some visual content could not be displayed.');
  }
}

function attachNestedTooltips<TData, TConfig extends CoreTooltipConfig>(
  instance: TooltipController<TData>, config: TConfig, profile: TooltipProfile<TData, TConfig>
): void {
  const data = instance._entityData;
  if (!data || !instance._uniqueId) return;
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
    createNestedTooltip(instance, finalNestedTooltipOptions, definition.selector, definition.items, config, definition.accessibleName);
  });
  logTooltipTiming(instance, config, 'nested tooltips attached', { count: nestedDefinitions.length });
}

function scheduleVisualsAndNestedTooltips<TData, TConfig extends CoreTooltipConfig>(
  instance: TooltipController<TData>,
  config: TConfig,
  profile: TooltipProfile<TData, TConfig>,
  reason: string
): void {
  if (instance._visualsRendered || instance._visualRenderPromise || scheduledVisuals.has(instance)) {
    logTooltipTiming(instance, config, 'visuals schedule skipped', {
      reason,
      rendered: Boolean(instance._visualsRendered),
      pending: Boolean(instance._visualRenderPromise),
    });
    return;
  }

  logTooltipTiming(instance, config, 'visuals scheduled', { reason });

  scheduledVisuals.add(instance);
  const run = () => {
    scheduledVisuals.delete(instance);
    if (instance._visualsRendered || instance._visualRenderPromise) return;
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
  config: CoreTooltipConfig,
  accessibleName?: string
): void {
  const button = instance.root.querySelector<HTMLElement>(selector);
  if (!button || items.length === 0 || instance._nestedTooltips.some(child => child.reference === button)) return;

  const nestedInstance = new TooltipController(button, {
    tooltip: options,
    content: createNestedContent(items),
    theme: instance.theme,
    constrainToViewport: config.constrainToViewport,
    interactiveBorder: 20,
    interactiveDebounce: 75,
    parent: instance,
    accessibleName: accessibleName
      ?? button.closest('.gt-chem-source-group')?.querySelector('.gt-chem-source-title span')?.textContent?.trim()
      ?? button.closest('.gene-tooltip-section-container')?.querySelector('.gt-section-title')?.textContent?.trim()
      ?? 'More details',
    timingConfig: config,
    hooks: { onDestroy: removeCloseHandler },
  });
  installCloseHandler(nestedInstance);
  instance.addNestedTooltip(nestedInstance);
}

function installSectionControls<TData, TConfig extends CoreTooltipConfig>(
  instance: TooltipController<TData>, config: TConfig, profile: TooltipProfile<TData, TConfig>
): void {
  const display = config.display as { collapsible?: unknown } | undefined;
  if (display?.collapsible && !instance._sectionToggleHandler) {
    const tooltipRoot = instance.root;

    instance._sectionToggleHandler = (event: Event) => {
      const target = event.target as HTMLElement;
      const header = target.closest<HTMLElement>('.gt-collapsible-header');
      if (!header) return;

      if (target.closest('[data-gt-tooltip-root]') && target.closest('[data-gt-tooltip-root]') !== instance.root) return;
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
        if (!newCollapsedState) {
          content.hidden = false;
          content.removeAttribute('inert');
        }
        const measuredHeight = Math.ceil(content.scrollHeight);
        content.style.setProperty('--gt-collapsible-content-height', `${measuredHeight}px`);
        if (newCollapsedState) void content.offsetHeight;

        const cleanup = () => {
          content.removeEventListener('transitionend', onTransitionEnd);
          clearTimeout(timer);
          pendingCollapsibleHeightCleanups.delete(content);
        };
        const finish = () => {
          cleanup();
          if (section.getAttribute('data-collapsed') === 'true') content.hidden = true;
          else content.style.removeProperty('--gt-collapsible-content-height');
        };
        const onTransitionEnd = (transitionEvent: TransitionEvent) => {
          if (transitionEvent.target === content && transitionEvent.propertyName === 'height') finish();
        };
        const timer = setTimeout(finish, COLLAPSIBLE_HEIGHT_CLEANUP_DELAY);
        content.addEventListener('transitionend', onTransitionEnd);
        pendingCollapsibleHeightCleanups.set(content, cleanup);
      }

      section.setAttribute('data-collapsed', String(newCollapsedState));
      if (content) {
        if (newCollapsedState) {
          (instance._nestedTooltips ?? [])
            .filter(child => section.contains(child.reference))
            .forEach(child => child.close());
          if (content.contains(document.activeElement)) header.focus();
          content.setAttribute('inert', '');
        }
        else content.removeAttribute('inert');
      }
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
      if (event.target instanceof HTMLButtonElement) return;
      if ((event.key === 'Enter' || event.key === ' ') && instance._sectionToggleHandler) {
        instance._sectionToggleHandler(event);
      }
    };

    tooltipRoot.addEventListener('click', instance._sectionToggleHandler);
    tooltipRoot.addEventListener('keydown', instance._sectionKeydownHandler);
  }

}

export function createShowHandler<TData, TConfig extends CoreTooltipConfig>(
  config: TConfig,
  profile: TooltipProfile<TData, TConfig>,
  inFlightRequests: Map<string, Promise<Map<string, TData>>>
) {
  return function onShow(instance: TooltipController<TData>) {
    installCloseHandler(instance);
    installSectionControls(instance, config, profile);
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
      const ref = profile.provider.parseElement(instance.reference as HTMLElement);
      if (!ref) {
        instance._entityCacheKey = undefined;
        instance._entityData = undefined;
        const message = profile.invalidElementMessage ?? 'Invalid tooltip element';
        setMessageContent(instance, message);
        announce(instance, message);
        return;
      }

      const entityKind = profile.id === 'mygene' ? 'Gene' : profile.id === 'mychem' ? 'Chemical' : profile.id;
      const panelName = `${entityKind} details for ${ref.query}`;
      instance.updateOptions({ accessibleName: panelName });
      const cacheKey = profile.provider.getCacheKey(ref);
      if (instance._entityCacheKey === cacheKey && instance._entityData !== undefined) {
        logTooltipTiming(instance, config, 'instance data already available', { cacheKey });
        attachNestedTooltips(instance, config, profile);
        scheduleVisualsAndNestedTooltips(instance, config, profile, 'existing-instance-data');
        return;
      }
      instance._entityCacheKey = cacheKey;
      instance._entityData = undefined;

      const renderContent = (data: TData | null) => {
        if (instance.state.isDestroyed) return;
        instance._entityData = data;
        instance._renderedVisualSections = new Set();
        instance._renderingVisualSections = new Set();
        logTooltipTiming(instance, config, 'content render start');
        instance.setContent(profile.renderTooltipHTML(data, { uniqueId: instance._uniqueId! }, config));
        if (!instance.content.querySelector('.gt-close-button')) {
          instance.content.insertAdjacentHTML('afterbegin', renderCloseButton('Close details'));
        }
        attachPushpin(instance);
        attachNestedTooltips(instance, config, profile);
        installSectionControls(instance, config, profile);
        announce(instance, data ? `${panelName} loaded.` : `${entityKind} not found.`);
        logTooltipTiming(instance, config, 'content set');
        scheduleVisualsAndNestedTooltips(instance, config, profile, 'content-set');
      };

      const cachedData = cache.get<TData>(cacheKey);
      if (typeof cachedData !== 'undefined') {
        logTooltipTiming(instance, config, 'cache hit');
        renderContent(cachedData);
        return;
      }

      instance.setContent(`${renderCloseButton('Close details')}<div class="gt-loader-container"><div class="gt-spinner" aria-hidden="true"></div><span>Loading…</span></div>`);
      announce(instance, `Loading ${panelName.toLowerCase()}.`, true);
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
        if (!instance.state.isDestroyed && instance._entityCacheKey === cacheKey) renderContent(data);
      } catch (error) {
        console.error(`Failed to fetch data for ${describeRef(ref)}`, error);
        if (!instance.state.isDestroyed && instance._entityCacheKey === cacheKey) {
          setMessageContent(instance, 'Error loading data.');
          announce(instance, 'Error loading data.');
        }
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

    installSectionControls(instance, config, profile);

    attachPushpin(instance);
    installCloseHandler(instance);
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
    removeCloseHandler(instance);
    instance.root.querySelectorAll<HTMLElement>('.gt-collapsible-content').forEach(content => {
      pendingCollapsibleHeightCleanups.get(content)?.();
      content.hidden = content.closest('.gene-tooltip-section-container')?.getAttribute('data-collapsed') === 'true';
      content.style.removeProperty('--gt-collapsible-content-height');
    });

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
  const content = instance.content;
  if (!content) return;

  // Drawer geometry is owned by the flex column and its selected detent. An
  // inline popover-era max-height would cap the scroll owner at 75dvh even
  // after the outer sheet expands, leaving unusable whitespace below it.
  if (instance.isDrawerPresentation()) {
    content.style.removeProperty('max-height');
    return;
  }

  if (!config.constrainToViewport) return;

  const padding = config.tooltipOptions.viewportPadding ?? 8;

  const availableHeight = window.visualViewport?.height || window.innerHeight;
  const viewportLimit = availableHeight - (padding * 2);
  const configuredLimit = config.tooltipHeight ?? Number.POSITIVE_INFINITY;
  (content as HTMLElement).style.maxHeight = `${Math.max(0, Math.min(viewportLimit, configuredLimit))}px`;
}

function describeRef(ref: EntityRef): string {
  return ref.query;
}
