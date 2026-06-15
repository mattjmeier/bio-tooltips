# Chemical Source Comparison

MyChem.info aggregates chemical records from multiple data sources. Bio Tooltips presents a curated tooltip view instead of exposing every raw field by default.

| Data source | Typical use |
| --- | --- |
| PubChem | structures, names, formulae, CIDs |
| ChEMBL | bioactivity, targets, molecule IDs |
| ChEBI | ontology identifiers and classifications |
| DrugBank | drug identifiers, pharmacology, product context |
| UNII | substance identifiers |

Use `sourcePaths: true` while developing chemical tooltip sections to inspect which MyChem paths contributed rendered fields.
