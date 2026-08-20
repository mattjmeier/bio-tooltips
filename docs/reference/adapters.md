# Module & Adapter Reference

Bio Tooltips exposes stable tooltip modules while keeping most adapter internals behind module entry points.

## Public Modules

| Tooltip module | Entry point | Main export |
| --- | --- | --- |
| Gene tooltips | `bio-tooltips/mygene` | `GeneTooltip` |
| Chemical tooltips | `bio-tooltips/mychem` | `ChemicalTooltip` |

## Module Behavior

| Area | Gene tooltips | Chemical tooltips |
| --- | --- | --- |
| Default selector | `.gene-tooltip` | `.chemical-tooltip` |
| Element context | `data-species` | `data-query`, `data-scope`, `data-lookup` |
| Provider | MyGene.info | MyChem.info |
| Main sections | Summary, species, location, pathways, domains, gene model, transcripts, structures, GeneRIFs, links | Identity, structure and properties, summary, synonyms, classes, pharmacology, regulatory, safety, identifiers |

## Adapter Internals

The generated API reference includes lower-level MyGene.info and MyChem.info adapter helpers for users extending the package:

- [MyGene adapter](../api/providers/mygene.md)
- [MyChem adapter](../api/providers/mychem.md)
- [All generated modules](../api/modules.md)

These internals are useful when adding new sections or researching field handling, but application code should normally initialize the public tooltip module exports.
