# Chemical Examples

## Stable PubChem Identifier

```html
<span class="chemical-tooltip" data-query="2244" data-scope="pubchem">aspirin</span>
```

## ChEMBL Identifier

```html
<span class="chemical-tooltip" data-query="CHEMBL25" data-scope="chembl">aspirin</span>
```

## Best-Guess Name Lookup

```html
<span class="chemical-tooltip" data-lookup="best-guess">caffeine</span>
```

## Initialization

```ts
import { ChemicalTooltip } from 'bio-tooltips/mychem';
import 'bio-tooltips/style.css';

ChemicalTooltip.init({
  selector: '.chemical-tooltip'
});
```

See the [Chemical Demo](./demos/chemical.md) for live examples.
