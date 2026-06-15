# Adapter Reference

Adapters plug entity-specific behavior into the shared core engine.

## Gene Tooltip Module

| Area | Behavior |
| --- | --- |
| Entry point | `bio-tooltips/mygene` |
| Main export | `GeneTooltip` |
| Default selector | `.gene-tooltip` |
| Element context | `data-species` |
| Adapter | MyGene.info |
| Main sections | Summary, species, location, pathways, domains, gene model, transcripts, structures, GeneRIFs, links |

## Chemical Tooltip Module

| Area | Behavior |
| --- | --- |
| Entry point | `bio-tooltips/mychem` |
| Main export | `ChemicalTooltip` |
| Default selector | `.chemical-tooltip` |
| Element context | `data-query`, `data-scope`, `data-lookup` |
| Adapter | MyChem.info |
| Main sections | Identity, structure and properties, summary, synonyms, classes, pharmacology, regulatory, safety, identifiers |

## Generated References

Generated TypeDoc pages remain available for exact exported symbols:

- [All modules](../api/modules.md)
- [MyGene adapter](../api/providers/mygene.md)
- [MyChem client](../api/providers/mychem/client.md)
- [MyChem types](../api/providers/mychem/types.md)
