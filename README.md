# Bio Tooltips

Framework-agnostic biomedical entity tooltips for HTML documents.

Bio Tooltips provides shared tooltip behavior plus entity-specific tooltip modules for genes, chemicals, and future biomedical entities such as variants.

Currently supported modules:

- Gene tooltips via MyGene.info
- Chemical tooltips via MyChem.info

## Install

```bash
npm install bio-tooltips
```

Import the shared stylesheet once:

```ts
import 'bio-tooltips/style.css';
```

## Gene Tooltips

Use the MyGene.info adapter for gene symbols, species-aware lookup, summaries, pathways, transcripts, structures, and gene model visuals.

```html
<span class="gene-tooltip" data-species="human">TP53</span>
<span class="gene-tooltip" data-species="mouse">Trp53</span>
```

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';

GeneTooltip.init({
  selector: '.gene-tooltip'
});
```

## Chemical Tooltips

Use the MyChem.info adapter for chemical names, stable identifiers, structures, properties, pharmacology, safety notes, and source-aware records.

```html
<span class="chemical-tooltip" data-query="2244" data-scope="pubchem">aspirin</span>
<span class="chemical-tooltip" data-query="CHEMBL25" data-scope="chembl">aspirin</span>
```

```ts
import { ChemicalTooltip } from 'bio-tooltips/mychem';

ChemicalTooltip.init({
  selector: '.chemical-tooltip'
});
```

## Root Import

The root package exports the current tooltip modules:

```ts
import { GeneTooltip, ChemicalTooltip } from 'bio-tooltips';
```

Subpath imports remain preferred when an application wants to load only one tooltip module.

## Documentation

Full documentation and examples are available in the `docs` folder and at the project site:

https://mattjmeier.github.io/bio-tooltips/

## Migrating From gene-tooltips

Replace package imports:

```ts
import { GeneTooltip } from 'gene-tooltips/mygene';
```

with:

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';
```

Browser CDN paths also move to the new package and artifact names:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bio-tooltips@latest/dist/bio-tooltips.css">
<script src="https://cdn.jsdelivr.net/npm/bio-tooltips@latest/dist/bio-tooltips.global.js"></script>
```

## Package History

This package was originally developed as `gene-tooltips` and renamed to `bio-tooltips` as chemical and future biomedical entity modules were added.
