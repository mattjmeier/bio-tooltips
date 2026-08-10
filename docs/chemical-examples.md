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

## Configured Examples

### Compact Tooltip

<ChemicalDemo query="caffeine" :config="{ tooltipWidth: 360, display: { pharmacology: false, regulatory: false, safety: false, identifiers: 'collapsed' } }" />

### Source-Aware Tooltip

<ChemicalDemo query="aspirin" :config="{ display: { sourcePaths: true, identifiers: 'expanded' } }" />

### RDKit Structure SVG

<ChemicalRDKitDemo query="aspirin" :config="{ display: { identifiers: 'collapsed' } }" />

The RDKit renderer is optional. See [Chemical Configuration](./chemical-configuration.md#optional-rdkit-structure-svgs) for installation and setup.

For visual comparisons of every theme and section variant, see [Styling & Theming](./styling-theming.md).

See the [Chemical Demo](./demos/chemical.md) for live examples.
