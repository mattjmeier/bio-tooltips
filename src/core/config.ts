export type PrefetchMode = 'smart' | 'all' | 'none';
export type TooltipTheme = 'light' | 'dark' | 'auto' | 'material' | 'translucent' | 'light-border' | undefined;
export type VisualPreloadMode = 'none' | 'hover' | 'init';
export type SectionVariant = 'cards' | 'dividers';

export type FixedPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end';

export type TooltipPlacementOptions =
  | {
      placement?: FixedPlacement;
      fallbackPlacements?: FixedPlacement[];
      allowedPlacements?: never;
    }
  | {
      placement: 'auto';
      allowedPlacements?: FixedPlacement[];
      fallbackPlacements?: never;
    };

export type TooltipOptions = TooltipPlacementOptions & {
  offset?: number;
  viewportPadding?: number;
  strategy?: 'absolute' | 'fixed';
  showDelay?: number;
  hideDelay?: number;
  showDuration?: number;
  hideDuration?: number;
  zIndex?: number;
  appendTo?: HTMLElement | (() => HTMLElement);
};

export interface TooltipTimingEvent {
  label: string;
  elapsedMs: number;
  timestampMs: number;
  tooltipId?: string;
  details?: Record<string, unknown>;
}

export type TooltipTimingObserver = (event: TooltipTimingEvent) => void;

export interface CoreTooltipConfig {
  selector: string;
  prefetch: PrefetchMode;
  prefetchThreshold: number;
  visualPreload: VisualPreloadMode;
  debugTimings: boolean;
  onTiming?: TooltipTimingObserver;
  theme: TooltipTheme;
  sectionVariant: SectionVariant;
  tooltipOptions: TooltipOptions;
  nestedTooltipOptions: TooltipOptions;
  tooltipWidth?: number;
  tooltipHeight?: number;
  constrainToViewport: boolean;
  display?: unknown;
}

export const defaultCoreConfig: CoreTooltipConfig = {
  selector: '.gene-tooltip',
  prefetch: 'smart',
  prefetchThreshold: 15,
  visualPreload: 'hover',
  debugTimings: false,
  theme: 'auto',
  sectionVariant: 'cards',
  constrainToViewport: true,
  tooltipOptions: {
    placement: 'bottom',
    appendTo: () => document.body,
    zIndex: 9999,
    strategy: 'absolute',
    fallbackPlacements: ['top', 'right', 'left'],
    offset: 10,
    viewportPadding: 8,
    showDelay: 0,
    hideDelay: 0,
    showDuration: 300,
    hideDuration: 250,
  },
  nestedTooltipOptions: {
    strategy: 'absolute',
    offset: 10,
    viewportPadding: 8,
    showDelay: 0,
    hideDelay: 0,
    showDuration: 300,
    hideDuration: 250,
    zIndex: 10000,
  },
};
