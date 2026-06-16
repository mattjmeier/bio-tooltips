# Core Reference

Core config is shared by all tooltip modules.

| Option | Default | Description |
| --- | --- | --- |
| `selector` | Module-specific | CSS selector used to find tooltip targets. |
| `prefetch` | `smart` | Data fetch strategy: `smart`, `all`, or `none`. |
| `prefetchThreshold` | `15` | Element count used by smart prefetch behavior. |
| `visualPreload` | `hover` | Optional visual dependency warmup strategy: `hover`, `init`, or `none`. |
| `debugTimings` | `false` | Logs tooltip lifecycle timing checkpoints to the browser console. |
| `theme` | `auto` | Tippy theme: `auto`, `light`, `dark`, `material`, `translucent`, or `light-border`. |
| `tooltipWidth` | Module-specific | Optional fixed max width in pixels. |
| `tooltipHeight` | None | Optional fixed max height in pixels. |
| `constrainToViewport` | `true` | Keeps large tooltips within the visible viewport. |
| `tippyOptions` | Module defaults | Options passed to the main Tippy instance. |
| `nestedTippyOptions` | Module defaults | Options passed to nested popovers. |

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

## Tippy Options

Any supported Tippy.js option can be passed through `tippyOptions`.

```ts
GeneTooltip.init({
  tippyOptions: {
    placement: 'right',
    delay: [100, 50]
  }
});
```

The library sets interactive defaults so users can pin, scroll, copy, and click links inside tooltips.

## Cleanup

`init()` returns a cleanup function. Use it when a framework unmounts a component or when a page replaces the tooltip targets.

```ts
const cleanup = ChemicalTooltip.init();
cleanup();
```
