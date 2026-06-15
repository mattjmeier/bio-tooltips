# API Overview

The public API is split into a shared engine layer and tooltip module entry points.

## Entry Points

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';
import { ChemicalTooltip } from 'bio-tooltips/mychem';
import 'bio-tooltips/style.css';
```

The root entry also exposes the current tooltip modules:

```ts
import { GeneTooltip, ChemicalTooltip } from 'bio-tooltips';
```

The default root export remains available for backward-compatible gene usage.

## Shared Methods

Both tooltip modules expose the same lifecycle shape.

| Method | Description |
| --- | --- |
| `init(config?)` | Finds matching elements, attaches Tippy instances, and returns a cleanup function. |
| `preload()` | Preloads optional module dependencies when available. |

## Shared Config

Shared options include `selector`, `prefetch`, `prefetchThreshold`, `theme`, `tooltipWidth`, `tooltipHeight`, `constrainToViewport`, `tippyOptions`, and `nestedTippyOptions`.

Read the [Core API](./reference/core.md) for shared behavior, [Gene API](./gene-api.md) for `GeneTooltipConfig`, and [Chemical API](./chemical-api.md) for `MyChemTooltipConfig`.

## Generated Reference

The generated TypeDoc output is available as the [Generated API Reference](./api/modules.md). It is useful for exact exported types, lower-level helpers, and adapter internals.
