# Chemical Usage

The chemical provider uses MyChem.info to resolve chemical names and identifiers.

## Import

```ts
import { ChemicalTooltip } from 'gene-tooltips/mychem';
import 'gene-tooltips/style.css';
```

## Markup

```html
<span class="chemical-tooltip">aspirin</span>
<span class="chemical-tooltip" data-scope="pubchem">2244</span>
<span class="chemical-tooltip" data-scope="chembl">CHEMBL25</span>
```

The element text is the chemical query. `data-scope` tells MyChem.info which identifier field to search.

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
