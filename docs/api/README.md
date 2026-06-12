**gene-tooltips**

***

# gene-tooltips

A framework-agnostic JavaScript/TypeScript library for displaying interactive gene information tooltips.

## Context

This library can be used to enrich any text within an HTML document to provide a 'glimpse' of information on a gene using the [MyGene.info]( https://mygene.info) API, providing an immediate definition alongside links to further reading for genes of interest.

The library is similar in principle to [Gene Hints](https://broadinstitute.github.io/gene-hints/), but does not require an ideogram as the 'launching point'.

## Features
- Display rich tooltips based on [Tippy.js](https://atomiks.github.io/tippyjs/) for genes in any HTML file
- Framework-agnostic: works with vanilla JS, React, Vue, etc.
- Optional integration with [D3.js](https://d3js.org) and [Ideogram](https://github.com/eweitz/ideogram)
- Configure what sections of information is displayed, height/width of the tooltip, and use Tippy.js themes to style the `gene-tooltips`.
- Can be easily extended to show more data from the MyGene.info API

## Installation
```bash
npm install gene-tooltips
```

## Usage

At minimum, you must include the javascript code for this project (either installed via NPM or built locally). For all features, you will also need to include [ideogram.js](https://eweitz.github.io/ideogram/) and the [D3](https://d3js.org/) libraries.

The file `examples/index.html` shows a working example - simply clone this repository, run `npm install` and `npm run build`, then open `index.html` in a browser.

To initialize gene tooltip object, add something like this (with configurable options) to your HTML:

```html
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

You can also add the class to a list of consistently delimited gene names (as long as they belong to the same species)

For module-based applications, the preferred MyGene entry point is:

```ts
import { GeneTooltip } from 'gene-tooltips/mygene';
import 'gene-tooltips/style.css';

GeneTooltip.init();
```

The root import remains available for backward compatibility:

```ts
import GeneTooltip from 'gene-tooltips';
```

## Documentation

Full documentation and examples are available in the docs
 folder or at the [project site](https://mattjmeier.github.io/gene-tooltips/).

## Development

You can run a development server with this command:

```bash
npm run docs:dev
```

## Contributing

Issues and pull requests are welcome. Please open a discussion if you’d like to propose a new feature or bug fix.
