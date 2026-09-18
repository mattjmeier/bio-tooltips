# Core Reference

Core config is shared by all tooltip modules.

| Option | Default | Description |
| --- | --- | --- |
| `selector` | Module-specific | CSS selector used to find tooltip targets. |
| `prefetch` | `smart` | Data fetch strategy: `smart`, `all`, or `none`. |
| `prefetchThreshold` | `15` | Element count used by smart prefetch behavior. |
| `visualPreload` | `hover` | Optional visual dependency warmup strategy: `hover`, `init`, or `none`. |
| `debugTimings` | `false` | Logs tooltip lifecycle timing checkpoints to the browser console. |
| `onTiming` | `undefined` | Receives structured timing checkpoints for diagnostics and benchmarking. |
| `theme` | `auto` | Theme: `auto`, `light`, `dark`, `material`, `translucent`, or `light-border`. |
| `presentation` | `auto` | Top-level dialog presentation: `auto`, `popover`, or `drawer`. |
| `tooltipWidth` | Module-specific | Optional fixed max width in pixels. |
| `tooltipHeight` | None | Optional fixed max height in pixels. |
| `constrainToViewport` | `true` | Keeps large tooltips within the visible viewport. |
| `tooltipOptions` | Module defaults | Bio Tooltips positioning, timing, portal, and stacking options for main tooltips. |
| `nestedTooltipOptions` | Module defaults | The same owned option surface for nested tooltips. |

## Visual Preload

`prefetch` controls data requests. `visualPreload` is separate: it warms optional rendering dependencies used by visual sections, such as the MyGene D3 gene track and ideogram.

```ts
GeneTooltip.init({
  visualPreload: 'hover'
});
```

| Value | Behavior |
| --- | --- |
| `hover` | Default. Starts loading visual dependencies on the first hover or focus before the tooltip render path needs them. |
| `init` | Starts loading visual dependencies immediately after `init()`. Useful for demo pages or apps where first-hover smoothness matters more than initial page idle work. |
| `none` | Leaves visual dependencies fully lazy. |

## Timing Debug

Use `debugTimings` while diagnosing lifecycle or performance issues.

```ts
GeneTooltip.init({
  debugTimings: true
});
```

When enabled, Bio Tooltips logs relative timing checkpoints for events such as `onShow`, cache hits, content rendering, visual rendering, D3/Ideogram loading, and nested tooltip attachment. Leave this disabled in production unless you are actively debugging.

`onTiming` receives the same checkpoints as structured objects and operates independently
of `debugTimings`. Observer errors are isolated from tooltip behavior.

Each module also exposes:

| Method | Purpose |
| --- | --- |
| `whenPrefetchReady()` | Wait for eager prefetch work started by the latest `init()` call. |
| `clearCache()` | Clear the shared in-memory provider cache. Primarily for benchmarks and diagnostics. |
| `cacheSize()` | Return the number of entries in the shared in-memory cache. |

See [Performance Benchmarking](../performance.md) for measurement guidance and the
benchmark report command.

## Responsive presentation

Top-level dialogs use `presentation: 'auto'` by default. At a viewport width of
600 CSS pixels or less, `auto` displays the dialog as a bottom drawer; above
600px it uses the existing anchored popover. The breakpoint responds to
orientation and viewport changes while the engine is active.

```ts
// Keep the anchored popover everywhere.
GeneTooltip.init({ presentation: 'popover' });

// Use the bottom drawer everywhere (useful for a touch-first application).
GeneTooltip.init({ presentation: 'drawer' });
```

The drawer is a non-modal, full-width bottom sheet capped at roughly 75% of
the dynamic viewport height. Its content scrolls internally and includes the
device bottom safe area. The page remains scrollable and interactive: there is
no backdrop, focus trap, `aria-modal`, inert background, or page scroll lock.
The drawer closes from its Close control, Escape, opening another top-level
tooltip, or a completed click outside the drawer and its trigger. Clicking
inside the drawer or its trigger does not close it; scroll gestures are not
treated as outside clicks. Pinning is hidden in drawer mode because a drawer
already persists until deliberate dismissal.

Nested/descriptive tooltips remain anchored popovers regardless of this setting.
Use `presentation: 'popover'` to retain the pre-drawer behavior at every width.

## Tooltip Options

`tooltipOptions` and `nestedTooltipOptions` use the framework-agnostic Bio Tooltips option surface. Fixed placements can provide an ordered fallback list. Automatic placement can instead restrict the placements it is allowed to choose.

```ts
GeneTooltip.init({
  tooltipOptions: {
    placement: 'right',
    fallbackPlacements: ['left', 'bottom', 'top'],
    showDelay: 100,
    hideDelay: 50
  }
});
```

| Option | Main default | Purpose |
| --- | --- | --- |
| `placement` | `bottom` | A fixed side/alignment or `auto`. |
| `fallbackPlacements` | `top`, `right`, `left` | Ordered alternatives for fixed placement. |
| `allowedPlacements` | All | Allowed sides when `placement` is `auto`. |
| `offset` | `10` | Gap in pixels between reference and tooltip. |
| `viewportPadding` | `8` | Minimum viewport-edge padding in pixels. |
| `strategy` | `absolute` | CSS positioning strategy: `absolute` or `fixed`. |
| `showDelay` / `hideDelay` | `0` / `0` | Opening and closing delays in milliseconds. |
| `showDuration` / `hideDuration` | `300` / `250` | Transition durations in milliseconds. |
| `zIndex` | `9999` | Root stacking order. |
| `appendTo` | `document.body` | Portal element or function returning it. |

Nested tooltips default to `right` on desktop and `bottom` on viewports narrower than 768px. The controller keeps interactive content open while pointer or focus is within the reference, tooltip, or a nested tooltip.

## Cleanup

`init()` returns a cleanup function. Use it when a framework unmounts a component or when a page replaces the tooltip targets.

```ts
const cleanup = ChemicalTooltip.init();
cleanup();
```
