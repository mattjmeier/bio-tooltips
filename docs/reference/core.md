# Core Reference

Core config is shared by all providers.

| Option | Default | Description |
| --- | --- | --- |
| `selector` | Provider-specific | CSS selector used to find tooltip targets. |
| `prefetch` | `smart` | Data fetch strategy: `smart`, `all`, or `none`. |
| `prefetchThreshold` | `15` | Element count used by smart prefetch behavior. |
| `theme` | `auto` | Tippy theme: `auto`, `light`, `dark`, `material`, `translucent`, or `light-border`. |
| `tooltipWidth` | Provider-specific | Optional fixed max width in pixels. |
| `tooltipHeight` | None | Optional fixed max height in pixels. |
| `constrainToViewport` | `true` | Keeps large tooltips within the visible viewport. |
| `tippyOptions` | Provider defaults | Options passed to the main Tippy instance. |
| `nestedTippyOptions` | Provider defaults | Options passed to nested popovers. |

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
