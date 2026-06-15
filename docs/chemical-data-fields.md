# Chemical Data Fields

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

For exact type details, see the [generated MyChem types](./api/providers/mychem/types.md).
