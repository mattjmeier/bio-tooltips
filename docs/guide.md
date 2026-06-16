# Getting Started

Bio Tooltips is a framework-agnostic tooltip library with a shared engine and biological feature-specific renderers.

Hover over a gene: <GeneDemo genes="TP53" species="human" :config="{ tooltipWidth: 400, truncateSummary: 3, pathwayCount: 3, domainCount: 3 }" />

Hover over a chemical: <ChemicalDemo query="aspirin" :config="{ tooltipWidth: 430, truncateSummary: 3 }" />

## Install

```bash
npm install bio-tooltips
```

Import the shared CSS once in your app:

```ts
import 'bio-tooltips/style.css';
```

## Choose a Tooltip Module

Use the module subpaths for focused bundle entry points.

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';
import { ChemicalTooltip } from 'bio-tooltips/mychem';
import 'bio-tooltips/style.css';
```

The root import also exposes the current tooltip modules:

```ts
import { GeneTooltip, ChemicalTooltip } from 'bio-tooltips';
```

## Gene Tooltips

Gene tooltips read the element text as one or more gene symbols. Add `data-species` to choose the organism.

```html
<span class="gene-tooltip" data-species="human">TP53</span>
<span class="gene-tooltip" data-species="mouse">Trp53</span>
```

```ts
GeneTooltip.init({
  selector: '.gene-tooltip'
});
```

For chromosome ideograms and gene model visuals, include the optional peer libraries on pages that need them.

```html
<script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ideogram@1.53.0/dist/js/ideogram.min.js"></script>
```

## Chemical Tooltips

Prefer stable chemical identifiers in `data-query` and use the element text as the human-readable label. Visible-text name searches are still available as experimental best-guess lookups.

```html
<span class="chemical-tooltip" data-query="2244" data-scope="pubchem">aspirin</span>
<span class="chemical-tooltip" data-query="CHEMBL25" data-scope="chembl">aspirin</span>
<span class="chemical-tooltip" data-lookup="best-guess">caffeine</span>
```

```ts
ChemicalTooltip.init({
  selector: '.chemical-tooltip'
});
```

## Next Steps

Read [Core Concepts](./core-concepts.md) for shared behavior, [Gene Usage](./gene-usage.md) for MyGene.info adapter details, and [Chemical Usage](./chemical-usage.md) for MyChem.info adapter details.
