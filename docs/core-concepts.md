# Core Concepts

`gene-tooltips` separates generic tooltip behavior from provider-specific biomedical data.

## Shared Engine

The core engine owns:

- DOM element discovery through `selector`
- Tippy.js lifecycle setup and cleanup
- caching and prefetch behavior
- theme resolution
- viewport constraints
- shared section wrappers and collapsible state

Provider packages supply the domain-specific parts: how to parse an element, how to fetch records, and how to render the tooltip body.

## Provider Entry Points

```ts
import { GeneTooltip } from 'gene-tooltips/mygene';
import { ChemicalTooltip } from 'gene-tooltips/mychem';
```

Each provider exposes `init()` and `preload()`. `init()` returns a cleanup function, which is useful in component lifecycles.

```ts
const cleanup = GeneTooltip.init({ selector: '.gene-tooltip' });

// Later:
cleanup();
```

## Element Parsing

The visible text inside a matched element becomes the lookup query.

Gene tooltips use `data-species`:

```html
<span class="gene-tooltip" data-species="human">TP53</span>
```

Chemical tooltips use `data-scope`:

```html
<span class="chemical-tooltip" data-scope="pubchem">2244</span>
```

## Prefetching

`prefetch` controls when data is fetched:

| Value | Behavior |
| --- | --- |
| `smart` | Default. Uses a threshold-aware strategy so small pages feel responsive without eagerly fetching everything. |
| `all` | Fetches all matched tooltip data after initialization. |
| `none` | Fetches only when the user opens a tooltip. |

## Display State

Providers use `display` objects to control rendered sections. Section values generally support:

| Value | Behavior |
| --- | --- |
| `false` | Hide the section. |
| `true` | Show the section using the provider default collapse state. |
| `expanded` | Show the section and start open. |
| `collapsed` | Show the section and start closed. |

`display.collapsible` and `display.collapsedByDefault` provide shared accordion behavior.

## Styling

Import `gene-tooltips/style.css` once. The stylesheet includes Tippy base styling, provider section styling, and CSS variables that can be overridden by site CSS.

```css
:root {
  --gt-color-primary: #2563eb;
}
```
