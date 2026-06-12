# Provider Reference

Providers plug domain-specific behavior into the shared core engine.

## Gene Provider

| Area | Behavior |
| --- | --- |
| Entry point | `gene-tooltips/mygene` |
| Main export | `GeneTooltip` |
| Default selector | `.gene-tooltip` |
| Element context | `data-species` |
| API source | MyGene.info |
| Main sections | Summary, species, location, pathways, domains, gene model, transcripts, structures, GeneRIFs, links |

## Chemical Provider

| Area | Behavior |
| --- | --- |
| Entry point | `gene-tooltips/mychem` |
| Main export | `ChemicalTooltip` |
| Default selector | `.chemical-tooltip` |
| Element context | `data-query`, `data-scope`, `data-lookup` |
| API source | MyChem.info |
| Main sections | Identity, structure and properties, summary, classes, pharmacology, regulatory, safety, identifiers |

## Generated References

Generated TypeDoc pages remain available for exact exported symbols:

- [All modules](../api/modules.md)
- [MyGene provider](../api/providers/mygene.md)
- [MyChem client](../api/providers/mychem/client.md)
- [MyChem types](../api/providers/mychem/types.md)
