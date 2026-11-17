# Bio Tooltips

[![Codecov](https://codecov.io/gh/mattjmeier/bio-tooltips/branch/main/graph/badge.svg)](https://app.codecov.io/gh/mattjmeier/bio-tooltips)

Framework-agnostic biological & biochemical tooltips for HTML documents.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/preview-dark.png">
    <img src="assets/preview.png" alt="Bio Tooltips preview: gene and chemical tooltips" width="900">
  </picture>
</p>

Bio Tooltips provides shared tooltip behavior plus entity-specific tooltip modules for genes, chemicals, and future biology-related entities such as variants.

Currently supported modules:

- Gene tooltips via [MyGene.info](https://mygene.info)
- Chemical tooltips via [MyChem.info](https://mychem.info)

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
<button type="button" class="chemical-tooltip" data-query="2244" data-scope="pubchem">aspirin</button>
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

## Programmatic Adapters

Visualization adapters can attach a tooltip directly to one real DOM element and control it through a small handle:

```ts
const handle = GeneTooltip.attach(anchor, { visualPreload: 'none' });

// Update the existing anchor before opening; its current text and data attributes are read on each open.
anchor.textContent = 'TP53';
anchor.dataset.species = 'human';
handle.open({ focus: false });

handle.close();
handle.destroy(); // removes the tooltip and restores the anchor's original accessibility attributes
```

`ChemicalTooltip.attach(anchor, config)` works the same way. Its query comes from the anchor's current `data-query` value, or its text when that attribute is absent, and its lookup context comes from the current `data-scope` and `data-lookup` attributes. The optional config has the same shape as the corresponding `init()` config. `open()` opens immediately and leaves focus where it is by default; pass `{ focus: true }` to move focus into the dialog. Normal hover and keyboard interactions on the anchor remain available.

The returned `TooltipHandle` type exposes only `open(options?: TooltipOpenOptions)`, `close()`, and `destroy()`. Reopening with unchanged query and context reuses fetched data; changes to either are parsed and looked up on the next open.

## Documentation

Full documentation and examples are available in the `docs` folder and at the project site:

https://mattjmeier.github.io/bio-tooltips/

Span triggers receive keyboard focus and button semantics automatically. Enter or Space enters a named, non-modal details dialog; Tab reaches its controls and Escape dismisses it. Native links retain Enter navigation and use ArrowDown to enter the panel.

Accessibility support, integration responsibilities, tested behavior, and current limitations are documented in the [accessibility guide](https://mattjmeier.github.io/bio-tooltips/accessibility.html). Bio Tooltips is designed to support WCAG 2.2 Level AA conforming implementations when used according to that guidance; this is not a claim that every integration or the package itself has completed a full WCAG conformance evaluation. The browser regression fixture uses the dev-only `axe-core` package; it is not part of the published runtime or dependency surface.

Tooltip requests select fields for enabled sections. With the default
`sectionLoading: 'lazy'`, collapsed sections load their remaining fields on expansion.
Use `sectionLoading: 'eager'` to load all enabled section fields upfront while preserving
collapsed display states. Both modes enrich and reuse the shared field-aware cache;
`prefetch` independently controls when initial requests start.
MyChem name searches retain the fields needed to rank molecule matches.

## Integrations and examples

- **Web frameworks and plain HTML:** Bio Tooltips is framework-agnostic. The [integration guide](https://mattjmeier.github.io/bio-tooltips/integration.html) includes React, Vue, and vanilla HTML examples, with initialization and cleanup guidance.
- **Reports and notebooks:** HTML output from R Markdown, Quarto, Jupyter, MyST, and similar systems can include Bio Tooltips. See [reports and notebooks](https://mattjmeier.github.io/bio-tooltips/integration.html#reports-and-notebooks) for the general approach, or use the companion R package below for R workflows.
- **Interactive demos:** gene, chemical, and mixed-entity examples are available in the [project documentation](https://mattjmeier.github.io/bio-tooltips/demo).
- **Companion R package:** [BioTooltipR on GitHub](https://github.com/mattjmeier/BioTooltipR), [CRAN package page](https://cran.r-project.org/package=BioTooltipR), and [vignette](https://cran.r-project.org/web/packages/BioTooltipR/vignettes/BioTooltipR.html). BioTooltipR generates the HTML markup expected by this JavaScript package, registers dependencies with `htmltools`, and includes version-pinned browser assets. It supports R Markdown, Quarto, Shiny, and other HTML-producing workflows, with helpers for tables and Plotly interaction.

```r
library(BioTooltipR)

use_bio_tooltips(modules = c("gene", "chemical"))

gene_tt("TP53", species = "human")
chem_tt("aspirin", query = "2244", scope = "pubchem")
```

The repository's [examples](https://github.com/mattjmeier/bio-tooltips/tree/main/examples) provide additional integration starting points.

## Performance Benchmarks

Run the deterministic renderer benchmark or the separate Chromium browser benchmark with:

```powershell
npm run benchmark
npm run benchmark:browser
# Optional: compare with local fixtures (no request delay)
npm run benchmark:browser:fixtures
# Optional: matched live requests with and without GeneRIFs
npm run benchmark:browser:fields
```

The benchmarks write machine-readable JSON and CSV plus Markdown summaries under the ignored
`benchmark/results/` directory. The default browser run makes real MyGene.info requests.
The fixture command fulfills requests immediately with stored data. Each saves separate
JSON/CSV results; `browser-latest.md` combines live and fixture rows in one table with
source labels, preserving each run's date and environment. No artificial request delay is used.
The field-selection run saves `browser-fields-latest.*` and adds a separate table comparing
the same requests with and without `generif`; other fields and display settings stay fixed.
Live results depend on the date, network and provider state. See [Performance Benchmarking](https://mattjmeier.github.io/bio-tooltips/performance)
for methodology and fixture refresh instructions. Generate local statement, branch,
function, and line coverage with `npm run test:coverage`. The CI workflow generates an LCOV
report and includes a Codecov upload step.

## Supply Chain Notes

Bio Tooltips keeps its user-facing dependency surface intentionally small:

- Required runtime npm dependencies: none.
- Accessibility test tooling: pinned `axe-core` is a development dependency used with Playwright; it is excluded from runtime bundles.
- Build and documentation tooling: esbuild bundles the library, rimraf cleans build output, and VitePress and TypeDoc build the documentation. Vite is overridden to the patched `6.4.6` release shared by VitePress and Vitest.
- Coverage tooling: Vitest's matching `@vitest/coverage-v8` development provider writes local and CI reports under the ignored `coverage/` directory.
- Bundled positioning foundation: `@floating-ui/dom`; consumers do not install or configure it separately.
- Optional peer dependencies: `d3`, `ideogram`, and `@rdkit/rdkit`. These are not bundled into the package and are only needed for optional visual/structure-rendering features.
- Published package contents: `dist`, `assets` (light + dark README preview images), `README.md`, `LICENSE`, and `package.json`.
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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bio-tooltips@2.3.2/dist/bio-tooltips.css">
<script src="https://cdn.jsdelivr.net/npm/bio-tooltips@2.3.2/dist/bio-tooltips.global.js"></script>
```

## Package History

This package was originally developed as `gene-tooltips` and renamed to `bio-tooltips` as chemical and future entity modules were added.

## AI-assisted development

Generative AI tools have been used during development to assist with code generation, refactoring, testing, documentation, and debugging. All software design decisions, integration, code review, and testing are performed by me (a human), who is responsible for the resulting code and documentation.
