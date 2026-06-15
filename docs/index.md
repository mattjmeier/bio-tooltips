---
layout: home
hero:
  name: Bio Tooltips
  text: Biomedical entity tooltips for the web.
  tagline: Add rich, contextual gene and chemical tooltips to HTML documents with framework-agnostic JavaScript.
  actions:
    - theme: brand
      text: Get Started
      link: /guide
    - theme: alt
      text: View Demos
      link: /demo
features:
  - title: Gene Tooltips
    details: MyGene.info-powered summaries, species context, pathways, transcripts, structures, and gene model visuals.
  - title: Chemical Tooltips
    details: MyChem.info-powered identifiers, structures, properties, pharmacology, safety notes, and source-aware records.
  - title: Shared Core
    details: One tooltip engine for caching, prefetching, theming, viewport behavior, and future biomedical entity modules.
---

## Try It

Hover or focus the highlighted terms:

<p>
  Gene tooltip:
  <GeneDemo genes="TP53" species="human" :config="{ tooltipWidth: 420, truncateSummary: 3, pathwayCount: 3, domainCount: 3 }" />
</p>

<p>
  Chemical tooltip:
  <ChemicalDemo query="2244" scope="pubchem" label="aspirin" :config="{ tooltipWidth: 430, truncateSummary: 3 }" />
</p>

<p>
  Mixed entities:
  <GeneDemo genes="BRCA1" species="human" :config="{ tooltipWidth: 420, truncateSummary: 3 }" />
  is often discussed alongside compounds such as
  <ChemicalDemo query="CHEMBL25" scope="chembl" label="aspirin" :config="{ tooltipWidth: 430, truncateSummary: 3 }" />.
</p>

## Install

```bash
npm install bio-tooltips
```

## Choose a Tooltip Module

Use module subpaths when you only need one entity type:

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

See [Getting Started](./guide.md) for setup details or open the [mixed entity demo](./demos/mixed.md).
