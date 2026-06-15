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

Live RDKit SVG tooltip: <ChemicalRDKitDemo query="aspirin" :config="{ display: { identifiers: 'collapsed' } }" />

The default structure figure uses PubChem PNG URLs. RDKit SVG rendering is available through a separate entry point so it is not loaded unless your app imports it.

RDKit is a better fit when you want crisp, theme-independent SVGs generated from the SMILES already returned by MyChem. It is kept optional because `@rdkit/rdkit` includes a WebAssembly payload and currently reports an unpacked package size of about 14 MB, while the default renderer is just a PubChem image URL.

```ts
// npm install @rdkit/rdkit
import { ChemicalTooltip } from 'bio-tooltips/mychem';
import { createRDKitStructureRenderer } from 'bio-tooltips/mychem/rdkit';

const structureRenderer = await createRDKitStructureRenderer();

ChemicalTooltip.init({
  structureRenderer,
});
```

For apps without top-level `await`, initialize the tooltip from an async function:

```ts
import { ChemicalTooltip } from 'bio-tooltips/mychem';
import { createRDKitStructureRenderer } from 'bio-tooltips/mychem/rdkit';

async function initChemicalTooltips() {
  const structureRenderer = await createRDKitStructureRenderer();

  return ChemicalTooltip.init({
    selector: '.chemical-tooltip',
    structureRenderer,
  });
}

initChemicalTooltips();
```

Install `@rdkit/rdkit` in applications that use this option. Tooltips fall back to the default PubChem PNG when RDKit cannot render a SMILES string.
