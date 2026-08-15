# Migrating to v2

Bio Tooltips v2 replaces its archived Tippy.js foundation with an owned tooltip controller and `@floating-ui/dom` positioning. Data providers, rendered biological content, themes, dimensions, caching, prefetch, timing, and the cleanup function returned by `init()` remain available.

## Configuration

Rename the option bags and translate the supported fields:

| v1 | v2 |
| --- | --- |
| `tippyOptions` | `tooltipOptions` |
| `nestedTippyOptions` | `nestedTooltipOptions` |
| `placement` | `placement` |
| `delay: [show, hide]` | `showDelay`, `hideDelay` |
| `duration: [show, hide]` | `showDuration`, `hideDuration` |
| `zIndex` | `zIndex` |
| `appendTo` | `appendTo` |
| Popper `strategy` | `strategy` |
| `preventOverflow.options.padding` | `viewportPadding` |
| `flip.options.fallbackPlacements` | `fallbackPlacements` |

```ts
GeneTooltip.init({
  tooltipOptions: {
    placement: 'right',
    fallbackPlacements: ['left', 'bottom', 'top'],
    showDelay: 100,
    hideDelay: 50,
    viewportPadding: 8
  }
});
```

For most-space placement, use the discriminated automatic form:

```ts
GeneTooltip.init({
  tooltipOptions: {
    placement: 'auto',
    allowedPlacements: ['top', 'right', 'bottom', 'left']
  }
});
```

Arbitrary Tippy lifecycle hooks, plugins, trigger strings, animations, and raw Popper modifiers are not accepted. Bio Tooltips owns hover, focus, touch, interactive traversal, pinning, nested tooltip, reduced-motion, and cleanup behavior. Structured lifecycle diagnostics remain available through `onTiming`.

## CSS Selectors

Replace custom Tippy selectors with the owned shell selectors:

| v1 | v2 |
| --- | --- |
| `[data-tippy-root]` | `[data-gt-tooltip-root]` |
| `.tippy-box` | `.gt-tooltip-box` |
| `.tippy-content` | `.gt-tooltip-content` |
| `.tippy-arrow` | `.gt-tooltip-arrow` |

The existing theme names and `--gt-*` customization variables remain supported. Import `bio-tooltips/style.css` exactly once as before.
