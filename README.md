# Bio Tooltips

Framework-agnostic biological & biochemical tooltips for HTML documents.

Bio Tooltips provides shared tooltip behavior plus entity-specific tooltip modules for genes, chemicals, and future biology-related entities such as variants.

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

## Supply Chain Notes

Bio Tooltips keeps its user-facing dependency surface intentionally small:

- Runtime npm dependencies: `tom-select`, plus its npm dependencies `@orchidjs/sifter` and `@orchidjs/unicode-variants`.
- Optional peer dependencies: `d3`, `ideogram`, and `@rdkit/rdkit`. These are not bundled into the package and are only needed for optional visual/structure-rendering features.
- Published package contents: `dist`, `README.md`, `LICENSE`, and `package.json`.
- External data/API sources used at runtime: MyGene.info for gene records, MyChem.info for chemical records, and PubChem image URLs for chemical structure images.

The release workflow installs from `package-lock.json` with `npm ci` and publishes to npm with provenance. For browser CDN usage, prefer a pinned package version instead of `@latest`.

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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bio-tooltips@1.0.1/dist/bio-tooltips.css">
<script src="https://cdn.jsdelivr.net/npm/bio-tooltips@1.0.1/dist/bio-tooltips.global.js"></script>
```

## Package History

This package was originally developed as `gene-tooltips` and renamed to `bio-tooltips` as chemical and future entity modules were added.
