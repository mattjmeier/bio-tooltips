# Chemical API

## Entry Point

```ts
import { ChemicalTooltip } from 'gene-tooltips/mychem';
```

## Methods

| Method | Description |
| --- | --- |
| `ChemicalTooltip.init(config?)` | Initializes chemical tooltips and returns a cleanup function. |
| `ChemicalTooltip.preload()` | Matches the shared provider lifecycle shape. |

## Config Type

`MyChemTooltipConfig` combines the shared `CoreTooltipConfig` with MyChem-specific options.

| Option | Default | Description |
| --- | --- | --- |
| `api` | `mychem` | Provider identifier. |
| `selector` | `.chemical-tooltip` | Elements to attach chemical tooltips to. |
| `truncateSummary` | `4` | Summary line clamp. |
| `synonymCount` | `6` | Synonyms shown before overflow UI. |
| `listCount` | `5` | Items shown in grouped sections before overflow UI. |
| `display.identity` | `expanded` | Name, badges, and match context. |
| `display.structureProperties` | `expanded` | Structure image plus formula, mass, identity, SMILES, and InChIKey. |
| `display.detailedProperties` | `true` | Secondary property table such as LogP, TPSA, H-bond counts, charge, and stereochemistry count. |
| `display.summary` | `expanded` | Description text. |
| `display.synonyms` | `expanded` | Synonym list. |
| `display.classes` | `true` | Chemical classes and categories. |
| `display.pharmacology` | `true` | Mechanism, indications, targets, and bioactivity summaries. |
| `display.regulatory` | `true` | Approval status, products, and orphan designations. |
| `display.safety` | `true` | Reported side effects and adverse event data. |
| `display.identifiers` | `true` | External identifiers and links. |
| `display.footer` | `true` | MyChem attribution and JSON link. |
| `display.rawJson` | `false` | Raw MyChem record display. |
| `display.sourcePaths` | `false` | Source path labels for rendered fields. |

## Markup Attributes

| Attribute | Description |
| --- | --- |
| `data-query` | Optional lookup value. Use this for stable IDs while keeping readable visible text. |
| `data-scope` | Identifier or search field, such as `pubchem`, `chembl`, `chebi`, `drugbank`, `unii`, `inchikey`, or `name`. |
| `data-lookup` | Optional lookup mode: `id` or `best-guess`. Non-`name` scopes default to `id`; `name` defaults to `best-guess`. |

For exact exported types, see the generated MyChem reference pages for [config](./api/providers/mychem/config.md), [client](./api/providers/mychem/client.md), and [types](./api/providers/mychem/types.md).
