# Chemical Configuration

Chemical-specific options extend the shared core config.

## Common Options

```ts
ChemicalTooltip.init({
  selector: '.chemical-tooltip',
  theme: 'auto',
  tooltipWidth: 430,
  truncateSummary: 4,
  synonymCount: 6,
  listCount: 5
});
```

## Display Sections

```ts
ChemicalTooltip.init({
  display: {
    identity: 'expanded',
    structureProperties: 'expanded',
    detailedProperties: true,
    summary: 'expanded',
    synonyms: 'expanded',
    classes: true,
    pharmacology: true,
    regulatory: true,
    safety: true,
    identifiers: true,
    footer: true,
    rawJson: false,
    sourcePaths: false,
    collapsible: true,
    collapsedByDefault: true
  }
});
```

## Counts

`synonymCount` controls how many synonyms appear before the overflow control. `listCount` controls grouped list sections such as classes, targets, products, and reported effects.

## Section Visibility

Section display options accept `true`, `false`, `'expanded'`, or `'collapsed'`. `true` follows `collapsedByDefault`; the default chemical tooltip keeps `Structure & Properties`, `Summary`, and `Synonyms` expanded while secondary sections, including `Detailed Properties`, start collapsed.

## Source and Debug Options

`sourcePaths: true` shows the MyChem source path for rendered fields. `rawJson: true` adds a raw JSON section for inspection.

These are useful while developing a tooltip, but they are usually too verbose for production documentation or application UI.

## Live Examples

Compact chemical tooltip: <ChemicalDemo query="caffeine" :config="{ tooltipWidth: 360, display: { pharmacology: false, regulatory: false, safety: false, identifiers: 'collapsed' } }" />

Source-aware tooltip: <ChemicalDemo query="aspirin" :config="{ display: { sourcePaths: true, identifiers: 'expanded' } }" />

## Optional RDKit Structure SVGs

The default structure figure uses PubChem PNG URLs. RDKit SVG rendering is available through a separate entry point so it is not loaded unless your app imports it.

```ts
import { ChemicalTooltip } from 'gene-tooltips/mychem';
import { createRDKitStructureRenderer } from 'gene-tooltips/mychem/rdkit';

const structureRenderer = await createRDKitStructureRenderer();

ChemicalTooltip.init({
  structureRenderer,
});
```

Install `@rdkit/rdkit` in applications that use this option. Tooltips fall back to the default PubChem PNG when RDKit cannot render a SMILES string.
