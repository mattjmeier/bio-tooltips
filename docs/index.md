---
layout: home
hero:
  name: Gene Tooltips JS
  text: Provider-aware biomedical tooltips for the web.
  tagline: Add rich, contextual gene and chemical tooltips to any webpage with a few lines of code.
  actions:
    - theme: brand
      text: Get Started
      link: /guide
    - theme: alt
      text: View Demos
      link: /demo
---

## One library, multiple providers

`gene-tooltips` now has a shared tooltip engine with provider-specific entry points for MyGene.info and MyChem.info. Use the gene provider for genomic context, species-aware lookups, pathways, transcript summaries, and gene model visuals. Use the chemical provider for names, identifiers, structures, properties, pharmacology, safety notes, and source-aware records.

The root package entry still defaults to the gene provider for backward compatibility. New integrations should prefer `gene-tooltips/mygene` or `gene-tooltips/mychem`.
