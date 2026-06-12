# API Overview

The public API is split into a shared engine layer and provider-specific entry points.

## Entry Points

```ts
import { GeneTooltip } from 'gene-tooltips/mygene';
import { ChemicalTooltip } from 'gene-tooltips/mychem';
import 'gene-tooltips/style.css';
```

The root entry remains gene-oriented for backward compatibility:

```ts
import GeneTooltip from 'gene-tooltips';
```

## Shared Methods

Both providers expose the same lifecycle shape.

| Method | Description |
| --- | --- |
| `init(config?)` | Finds matching elements, attaches Tippy instances, and returns a cleanup function. |
| `preload()` | Preloads optional provider dependencies when available. |

## Shared Config

Shared options include `selector`, `prefetch`, `prefetchThreshold`, `theme`, `tooltipWidth`, `tooltipHeight`, `constrainToViewport`, `tippyOptions`, and `nestedTippyOptions`.

Read the [Core Reference](./reference/core.md) for shared behavior, [Gene API](./gene-api.md) for `GeneTooltipConfig`, and [Chemical API](./chemical-api.md) for `MyChemTooltipConfig`.

## Generated Reference

The generated TypeDoc output is available as the [Full Generated Reference](./api/modules.md). It is useful for exact exported types, lower-level helpers, and provider internals.
