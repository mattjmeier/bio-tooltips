# Chemical Usage

The chemical provider uses MyChem.info to resolve chemical names and identifiers.

## Import

```ts
import { ChemicalTooltip } from 'gene-tooltips/mychem';
import 'gene-tooltips/style.css';
```

## Markup

```html
<span class="chemical-tooltip" data-query="2244" data-scope="pubchem">aspirin</span>
<span class="chemical-tooltip" data-query="CHEMBL25" data-scope="chembl">aspirin</span>
<span class="chemical-tooltip" data-lookup="best-guess">caffeine</span>
```

Prefer `data-query` plus `data-scope` for stable chemical tooltips. The visible text remains the page label, while `data-query` is the MyChem lookup value.

Visible-text name searches are still supported as experimental best-guess lookups. They are convenient for drafts, but chemical names can match molecules, salts, products, packages, or synonyms.

```html
<span class="chemical-tooltip">aspirin</span>
```

When `data-query` is omitted, the element text becomes the query. `data-scope` tells MyChem.info which identifier field to search.

## Initialize

```ts
const cleanup = ChemicalTooltip.init({
  selector: '.chemical-tooltip'
});
```

The default selector is `.chemical-tooltip`.

## Supported Scopes

| `data-scope` | MyChem scope |
| --- | --- |
| `name` | `name` |
| `inchi` | `inchi` |
| `inchikey` | `inchikey` |
| `chebi` | `chebi.id` |
| `chembl` | `chembl.molecule_chembl_id` |
| `drugbank` | `drugbank.id` |
| `pubchem` or `cid` | `pubchem.cid` |
| `unii` | `unii.unii` |

Unknown scopes fall back to `name`.

## Lookup Modes

| Mode | How to use it | Behavior |
| --- | --- | --- |
| `id` | Any non-`name` `data-scope`, or `data-lookup="id"` | Uses identifier-oriented lookup. Supported MyChem annotation IDs are fetched directly. |
| `best-guess` | Default for `name`, or `data-lookup="best-guess"` | Searches by name and prefers molecule-backed records over product-only matches. |

Older identifier markup remains valid:

```html
<span class="chemical-tooltip" data-scope="pubchem">2244</span>
```
