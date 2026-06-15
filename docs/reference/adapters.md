# Adapter API

Bio Tooltips exposes stable tooltip modules while keeping most adapter internals behind module entry points.

## Public Modules

| Tooltip module | Entry point | Main export |
| --- | --- | --- |
| Gene tooltips | `bio-tooltips/mygene` | `GeneTooltip` |
| Chemical tooltips | `bio-tooltips/mychem` | `ChemicalTooltip` |

## Adapter Internals

The generated API reference includes lower-level MyGene.info and MyChem.info adapter helpers for users extending the package:

- [MyGene adapter](../api/providers/mygene.md)
- [MyChem adapter](../api/providers/mychem.md)

These internals are useful when adding new sections or researching field handling, but application code should normally initialize the public tooltip module exports.
