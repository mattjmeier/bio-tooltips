# Getting Started

This guide will walk you through installing and configuring Gene Tooltip JS. Below is an example to illustrate what the library does.

Hover over the gene to see the configured tooltip: <GeneDemo genes="TP53" species="human" :config="{ tooltipWidth: 400, truncateSummary: 3, pathwayCount: 3, domainCount: 3 }" />

## Installation

You can install the package via npm:

```bash
npm install gene-tooltips
```

Or include it directly in your HTML from a CDN like unpkg:

```html
<script src="https://unpkg.com/gene-tooltips/dist/gene-tooltips.global.js"></script>
```

For module-based applications, prefer the provider-specific MyGene entry point:

```ts
import { GeneTooltip } from 'gene-tooltips/mygene';
import 'gene-tooltips/style.css';

GeneTooltip.init();
```

The root import is still supported for backward compatibility:

```ts
import GeneTooltip from 'gene-tooltips';
```

## Basic Usage

Once the script is loaded, you can initialize it. Add the class `gene-tooltip` and a `data-species` attribute to any `<span>` element.

To use all features, including the ideogram and exon maps, you should include ideogram.js and the d3 library as shown here.

You must also include the CSS for proper styling and theme responsiveness.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gene-tooltips/dist/gene-tooltips.css">
<script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ideogram@1.53.0/dist/js/ideogram.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gene-tooltips/dist/gene-tooltips.global.js"></script>

<p>
  Here is a human gene: <span class="gene-tooltip" data-species="human">TP53</span>.
  And here is a mouse gene: <span class="gene-tooltip" data-species="mouse">Trp53</span>.
</p>

<script src="https://unpkg.com/gene-tooltips/dist/gene-tooltips.global.js"></script>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        GeneTooltip.init({
            // Your optional configuration here
        });
    });
</script>
```

# Configuration

You can customize the tooltip by passing a configuration object to `GeneTooltip.init()`. Here are some common examples.

## Changing Displayed Sections

Hide the ideogram and protein domains sections.

```javascript
GeneTooltip.init({
    display: {
        ideogram: false,
        domains: false
    }
});
```

> [!WARNING] If a section of the tooltip is returned empty from mygene.info, it will simply not be shown, rather than displaying an error (with some exceptions, like the Summary).

## Changing Pathway Source

Show pathways from Reactome instead of the default KEGG.

```javascript
GeneTooltip.init({
    pathwaySource: 'reactome'
});
```

> [!NOTE]
> The gene must have Reactome pathway data available at mygene.info for this to display.

## Adjusting Tooltip Size and Truncation

Create a wider tooltip and show more of the summary initially.

```javascript
GeneTooltip.init({
    tooltipWidth: 400, // in pixels
    truncateSummary: 6 // number of lines
});
```

## Styling

The tooltip is styled with CSS variables that you can easily override. Create your own CSS file and include it after the library's CSS to customize the appearance.

```css
/* ./src/css/theme.css */
:root {
  --gt-color-primary: #d946ef; /* Use a different primary color */
}
```

You can also specify any of the built in [Tippy themes](https://atomiks.github.io/tippyjs/v6/themes/):

```javascript
GeneTooltip.init({
    // The default theme is auto
    // Valid options:
    // theme: 'auto'
    // theme: 'light'
    // theme: 'light-border'
    // theme: 'dark'
    // theme: 'translucent'
    // theme: 'material'
    theme: 'material'
});
```

Auto theme (default) will adjust to OS and site settings for light vs. dark: <GeneDemo genes="TP53" species="human" :config="{ theme: 'auto' }" />

Light theme: <GeneDemo genes="TP53" species="human" :config="{ theme: 'light' }" />

Light-border theme:  <GeneDemo genes="TP53" species="human" :config="{ theme: 'light-border' }" />

Dark theme:  <GeneDemo genes="TP53" species="human" :config="{ theme: 'dark' }" />

Translucent theme:  <GeneDemo genes="TP53" species="human" :config="{ theme: 'translucent' }" />

Material theme:  <GeneDemo genes="TP53" species="human" :config="{ theme: 'material' }" />

## How it works

This library leverages the MyGene.info API. Read about it [here](https://mygene.info). The function `fetchMyGeneBatch` in [`./src/providers/mygene/client.ts`](https://github.com/mattjmeier/gene-tooltips/blob/main/src/providers/mygene/client.ts) makes a POST batch request to the API using the numeric NCBI taxid for each gene requested.

It will dynamically build a query that looks something like this:

[`https://mygene.info/v3/query?q=symbol:tp53&scopes=symbol&fields=_id,query,symbol,name`](https://mygene.info/v3/query?q=symbol:tp53&scopes=symbol&fields=_id,query,symbol,name)

The example above is shortened, since the default is to include more fields of interest. Future improvements to this package could further parameterize the API query generation.

The JSON that is returned from the query is parsed and rendered by the MyGene provider. The provider renderer lives in [`./src/providers/mygene/renderer.ts`](https://github.com/mattjmeier/gene-tooltips/blob/main/src/providers/mygene/renderer.ts), with individual sections registered in [`./src/providers/mygene/sections/index.ts`](https://github.com/mattjmeier/gene-tooltips/blob/main/src/providers/mygene/sections/index.ts). The public MyGene entry point is [`./src/mygene.ts`](https://github.com/mattjmeier/gene-tooltips/blob/main/src/mygene.ts), while [`./src/index.ts`](https://github.com/mattjmeier/gene-tooltips/blob/main/src/index.ts) remains a backward-compatible root wrapper.

This pattern can be extended to other providers by adding a provider folder under `src/providers` and a package subpath similar to `gene-tooltips/mygene`.
