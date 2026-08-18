import {
  arrow,
  autoPlacement,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  size,
  type Middleware,
  type Placement,
} from '@floating-ui/dom';
import type { FixedPlacement, TooltipOptions } from './config.js';

export interface PositioningElements {
  reference: Element;
  root: HTMLElement;
  box: HTMLElement;
  content: HTMLElement;
  arrow: HTMLElement;
}

export interface PositioningOptions {
  tooltip: TooltipOptions;
  constrainToViewport: boolean;
  maxWidth?: number;
  maxHeight?: number;
  isTopLevel?: boolean;
}

export interface ActivePositioner {
  update: () => Promise<void>;
  destroy: () => void;
}

export function startPositioning(
  elements: PositioningElements,
  options: PositioningOptions
): ActivePositioner {
  const { reference, root, box, content, arrow: arrowElement } = elements;
  const tooltipOptions = options.tooltip;
  const padding = tooltipOptions.viewportPadding ?? 8;
  const strategy = tooltipOptions.strategy ?? 'absolute';
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  const useCompactLayout = options.isTopLevel === true && viewportWidth <= 600;
  const preferredPlacement = useCompactLayout
    ? (tooltipOptions.placement?.startsWith('top') ? 'top' : 'bottom')
    : tooltipOptions.placement;
  let active = true;

  root.style.position = strategy;
  root.style.zIndex = String(tooltipOptions.zIndex ?? 9999);
  box.style.maxWidth = `${options.maxWidth ?? 350}px`;

  const placementMiddleware: Middleware = preferredPlacement === 'auto'
    ? autoPlacement({
        padding,
        rootBoundary: 'viewport',
        allowedPlacements: tooltipOptions.allowedPlacements as Placement[] | undefined,
      })
    : flip({
        padding,
        rootBoundary: 'viewport',
        fallbackPlacements: useCompactLayout
          ? [preferredPlacement === 'top' ? 'bottom' : 'top']
          : tooltipOptions.fallbackPlacements as Placement[] | undefined,
      });

  const middleware: Middleware[] = [
    offset(tooltipOptions.offset ?? 10),
    placementMiddleware,
    shift({ padding, rootBoundary: 'viewport' }),
    size({
      padding,
      rootBoundary: 'viewport',
      apply({ availableWidth, availableHeight }) {
        if (!active) return;
        const resolvedWidth = Math.max(0, Math.min(availableWidth, options.maxWidth ?? 350));
        box.style.maxWidth = `${resolvedWidth}px`;
        // Side placements can leave a full-sized tooltip squeezed into a thin
        // column on phones. Compact top-level tooltips use the full resolved
        // width so their sections stay readable and scroll vertically instead.
        if (useCompactLayout) box.style.width = `${resolvedWidth}px`;
        box.style.setProperty('--gt-available-width', `${Math.max(0, availableWidth)}px`);
        box.style.setProperty('--gt-available-height', `${Math.max(0, availableHeight)}px`);
        if (options.constrainToViewport) {
          const configuredHeight = options.maxHeight ?? Number.POSITIVE_INFINITY;
          const resolvedHeight = Math.max(0, Math.min(availableHeight, configuredHeight));
          content.style.maxHeight = `${resolvedHeight}px`;
        } else if (options.maxHeight) {
          content.style.maxHeight = `${options.maxHeight}px`;
        } else {
          content.style.removeProperty('max-height');
        }
      },
    }),
    arrow({ element: arrowElement, padding: 4 }),
  ];

  const update = async (): Promise<void> => {
    if (!active || !root.isConnected) return;
    const result = await computePosition(reference, root, {
      placement: preferredPlacement === 'auto'
        ? undefined
        : preferredPlacement as Placement | undefined,
      strategy,
      middleware,
    });
    if (!active || !root.isConnected) return;

    Object.assign(root.style, {
      left: `${result.x}px`,
      top: `${result.y}px`,
    });

    const side = result.placement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left';
    const staticSide = ({ top: 'bottom', right: 'left', bottom: 'top', left: 'right' } as const)[side];
    const arrowData = result.middlewareData.arrow;
    Object.assign(arrowElement.style, {
      left: arrowData?.x == null ? '' : `${arrowData.x}px`,
      top: arrowData?.y == null ? '' : `${arrowData.y}px`,
      right: '',
      bottom: '',
      [staticSide]: '-4px',
    });
    box.dataset.placement = result.placement;
  };

  const stopAutoUpdate = autoUpdate(reference, root, () => {
    void update();
  });

  return {
    update,
    destroy() {
      if (!active) return;
      active = false;
      stopAutoUpdate();
    },
  };
}

export function getDefaultFallbackPlacements(placement: FixedPlacement): FixedPlacement[] {
  const side = placement.split('-')[0];
  if (side === 'right') return ['left', 'bottom', 'top'];
  if (side === 'left') return ['right', 'bottom', 'top'];
  if (side === 'top') return ['bottom', 'right', 'left'];
  return ['top', 'right', 'left'];
}
