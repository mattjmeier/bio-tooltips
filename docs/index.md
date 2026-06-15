# Bio Tooltips

Bio Tooltips is a framework-agnostic JavaScript library for adding rich biomedical entity tooltips to HTML documents.

It provides shared tooltip behavior plus entity-specific modules for genes, chemicals, and future biomedical entities such as variants.

Currently supported modules:

- **Gene tooltips** via MyGene.info
- **Chemical tooltips** via MyChem.info

## Install

```bash
npm install bio-tooltips
```

## Choose a Tooltip Module

Use the module subpaths when you only need one entity type:

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';
import { ChemicalTooltip } from 'bio-tooltips/mychem';
import 'bio-tooltips/style.css';
```

The root import also exposes the current tooltip modules:

```ts
import { GeneTooltip, ChemicalTooltip } from 'bio-tooltips';
```

The default root export remains the gene tooltip module for compatibility with early `gene-tooltips` integrations.

## Entity Types

Gene tooltips parse gene symbols and use `data-species` for organism context. Chemical tooltips prefer `data-query` and `data-scope` so visible text can stay readable while the lookup uses stable identifiers.

```html
<p>
  <span class="gene-tooltip" data-species="human">TP53</span>
  is involved in cellular stress responses that may be relevant when interpreting
  compounds such as
  <span class="chemical-tooltip" data-query="2244" data-scope="pubchem">aspirin</span>.
</p>
```

See [Getting Started](./guide.md) for setup details or open the [mixed entity demo](./demos/mixed.md).
