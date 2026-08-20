# Chemical Data & Sources

Chemical tooltips render normalized fields from MyChem.info records.

| Area | Example fields |
| --- | --- |
| Identity | name, identifiers, match context |
| Structure | formula, molecular weight, SMILES, InChIKey |
| Descriptions | summaries and source text |
| Synonyms | common names and aliases |
| Classes | chemical categories and classifications |
| Pharmacology | targets, indications, mechanisms, bioactivity |
| Regulatory | approval status, products, designations |
| Safety | adverse effects and safety annotations |

Chemical summary text may include simple inline formatting from source records, such as ChEBI emphasis tags. Bio Tooltips renders a small allowlist of inline tags (`em`, `i`, `strong`, `b`, `sub`, and `sup`) and escapes other markup or attributes.

## Source Comparison

MyChem.info aggregates chemical records from multiple data sources. Bio Tooltips presents a curated tooltip view instead of exposing every raw field by default.

| Data source | Typical use |
| --- | --- |
| PubChem | structures, names, formulae, CIDs |
| ChEMBL | bioactivity, targets, molecule IDs |
| ChEBI | ontology identifiers and classifications |
| DrugBank | drug identifiers, pharmacology, product context |
| UNII | substance identifiers |

Use `sourcePaths: true` while developing chemical tooltip sections to inspect which MyChem paths contributed rendered fields. See [Chemical Configuration & Examples](./chemical-configuration.md#source-and-debug-options) for setup.

For exact type details, see the [generated MyChem types](./api/providers/mychem/types.md).
