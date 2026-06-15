import type { Props } from 'tippy.js';

export type PrefetchMode = 'smart' | 'all' | 'none';
export type TooltipTheme = 'light' | 'dark' | 'auto' | 'material' | 'translucent' | 'light-border' | undefined;
export type VisualPreloadMode = 'none' | 'hover' | 'init';

export interface CoreTooltipConfig {
  selector: string;
  prefetch: PrefetchMode;
  prefetchThreshold: number;
  visualPreload: VisualPreloadMode;
  debugTimings: boolean;
  theme: TooltipTheme;
  tippyOptions: Partial<Props>;
  nestedTippyOptions: Partial<Props>;
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
  constrainToViewport: true,
  tippyOptions: {
    allowHTML: true,
    interactive: true,
    placement: 'bottom',
    appendTo: () => document.body,
    interactiveDebounce: 75,
    hideOnClick: false,
    trigger: 'mouseenter focus',
    zIndex: 9999,
    popperOptions: {
      strategy: 'absolute',
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            boundary: 'viewport',
            padding: 8,
          },
        },
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['top', 'right', 'left'],
            boundary: 'viewport',
            padding: 8,
          },
        },
      ],
    },
  },
  nestedTippyOptions: {
    allowHTML: true,
    interactive: true,
    trigger: 'mouseenter focus',
    hideOnClick: false,
    interactiveBorder: 20,
    interactiveDebounce: 75,
    placement: 'right',
  },
};
