# Core Concepts

Bio Tooltips separates generic tooltip behavior from entity-specific biomedical data.

## Shared Engine

The core engine owns:

- DOM element discovery through `selector`
- Tippy.js lifecycle setup and cleanup
- caching and prefetch behavior
- theme resolution
- viewport constraints
- shared section wrappers and collapsible state

Tooltip modules supply the entity-specific parts: how to parse an element, how to fetch records, and how to render the tooltip body.

## Tooltip Module Entry Points

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';
import { ChemicalTooltip } from 'bio-tooltips/mychem';
```

Each tooltip module exposes `init()` and `preload()`. `init()` returns a cleanup function, which is useful in component lifecycles.

```ts
const cleanup = GeneTooltip.init({ selector: '.gene-tooltip' });

// Later:
cleanup();
```

## Element Parsing

The visible text inside a matched element usually becomes the lookup query. Tooltip modules can also support data attributes for stable identifiers.

Gene tooltips use `data-species`:

```html
<span class="gene-tooltip" data-species="human">TP53</span>
```

Chemical tooltips prefer `data-query` for stable identifiers and `data-scope` for the identifier type:

```html
<span class="chemical-tooltip" data-query="2244" data-scope="pubchem">aspirin</span>
```

When `data-query` is omitted, chemical tooltips use visible text as an experimental best-guess name search.

## Prefetching

`prefetch` controls when data is fetched:

| Value | Behavior |
| --- | --- |
| `smart` | Default. Uses a threshold-aware strategy so small pages feel responsive without eagerly fetching everything. |
| `all` | Fetches all matched tooltip data after initialization. |
| `none` | Fetches only when the user opens a tooltip. |

## Visual Dependency Warmup

Some tooltip modules have optional visual dependencies. For example, MyGene gene tooltips can use D3 for gene tracks and Ideogram.js for chromosome context.

`visualPreload` controls when those visual libraries are warmed:

| Value | Behavior |
| --- | --- |
| `hover` | Default. Starts warming visual dependencies on the first hover or focus. |
| `init` | Starts warming visual dependencies immediately after initialization. |
| `none` | Loads visual dependencies only when the visual section renders. |

This is intentionally separate from `prefetch`: data prefetch answers "do we already have the record?", while visual preload answers "are the optional drawing libraries ready?"

## Timing Debug

`debugTimings: true` logs lifecycle checkpoints to the browser console. It is useful for investigating whether time is being spent fetching data, rendering HTML, drawing visuals, waiting on optional libraries, or attaching nested tooltips.

```ts
GeneTooltip.init({
  debugTimings: true,
  visualPreload: 'init'
});
```

Keep timing logs disabled for normal production use.

## Display State

Tooltip modules use `display` objects to control rendered sections. Section values generally support:

| Value | Behavior |
| --- | --- |
| `false` | Hide the section. |
| `true` | Show the section using the module default collapse state. |
| `expanded` | Show the section and start open. |
| `collapsed` | Show the section and start closed. |

`display.collapsible` and `display.collapsedByDefault` provide shared accordion behavior.

## Styling

Import `bio-tooltips/style.css` once. The stylesheet includes Tippy base styling, module section styling, and CSS variables that can be overridden by site CSS.

```css
:root {
  --gt-color-primary: #2563eb;
}
```
