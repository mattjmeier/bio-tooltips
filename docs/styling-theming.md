# Styling & Theming

Import the shared stylesheet once:

```ts
import 'bio-tooltips/style.css';
```

The stylesheet includes the owned Bio Tooltips shell, layout rules, module section styling, themes, and CSS variables.

For a browser build, load the stylesheet from a pinned package version:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bio-tooltips@2.0.3/dist/bio-tooltips.css">
```

## Themes

```ts
GeneTooltip.init({
  theme: 'auto'
});
```

Supported theme values include `auto`, `light`, `dark`, `material`, `translucent`, and `light-border`.

### Theme Examples

Each theme is shown with both tooltip modules so you can compare the shared visual treatment across different content.

#### Auto

Gene: <GeneDemo genes="TP53" species="human" :config="{ theme: 'auto' }" />

Chemical: <ChemicalDemo query="aspirin" :config="{ theme: 'auto' }" />

#### Light

Gene: <GeneDemo genes="TP53" species="human" :config="{ theme: 'light' }" />

Chemical: <ChemicalDemo query="aspirin" :config="{ theme: 'light' }" />

#### Dark

Gene: <GeneDemo genes="TP53" species="human" :config="{ theme: 'dark' }" />

Chemical: <ChemicalDemo query="aspirin" :config="{ theme: 'dark' }" />

#### Material

Gene: <GeneDemo genes="TP53" species="human" :config="{ theme: 'material' }" />

Chemical: <ChemicalDemo query="aspirin" :config="{ theme: 'material' }" />

#### Translucent

Gene: <GeneDemo genes="TP53" species="human" :config="{ theme: 'translucent' }" />

Chemical: <ChemicalDemo query="aspirin" :config="{ theme: 'translucent' }" />

#### Light Border

Gene: <GeneDemo genes="TP53" species="human" :config="{ theme: 'light-border' }" />

Chemical: <ChemicalDemo query="aspirin" :config="{ theme: 'light-border' }" />

## Section Variants

Tooltips use filled, rounded section cards by default. Use the shared `sectionVariant` option for a flatter layout with simple dividers:

```ts
GeneTooltip.init({
  sectionVariant: 'dividers'
});
```

Supported values are `cards` and `dividers`. The divider variant keeps the same content, collapse behavior, and theme colors while replacing card backgrounds with separators. To customize it further, target `[data-section-variant='dividers']` in application CSS and use the existing theme variables.

### Section Variant Examples

#### Cards

Gene: <GeneDemo genes="TP53" species="human" :config="{ sectionVariant: 'cards' }" />

Chemical: <ChemicalDemo query="aspirin" :config="{ sectionVariant: 'cards' }" />

#### Dividers

Gene: <GeneDemo genes="TP53" species="human" :config="{ sectionVariant: 'dividers' }" />

Chemical: <ChemicalDemo query="aspirin" :config="{ sectionVariant: 'dividers' }" />

## CSS Variables

Override variables in application CSS:

```css
:root {
  --gt-color-primary: #2563eb;
}
```

The MyGene transcript control also exposes focused override hooks. Its opened
picker uses these values in browsers that support customizable native selects;
other browsers continue to use their operating-system picker.

```css
.gt-tooltip-box {
  --gt-transcript-selector-background: var(--gt-background-color-base);
  --gt-transcript-selector-picker-background: var(--gt-background-color-base);
  --gt-transcript-selector-border-color: var(--gt-border-color);
  --gt-transcript-selector-option-hover: color-mix(
    in srgb,
    var(--gt-accent-color) 12%,
    var(--gt-background-color-base)
  );
  --gt-transcript-selector-option-selected: color-mix(
    in srgb,
    var(--gt-accent-color) 22%,
    var(--gt-background-color-base)
  );
  --gt-transcript-selector-picker-shadow: 0 8px 20px rgb(0 0 0 / 20%);
}
```

Applications can also target `.gene-tooltip-transcript-selector` and its
`::picker(select)` directly when more control is needed.

## Tooltip Shell Selectors

Bio Tooltips owns its rendered shell. The stable selectors are
`[data-gt-tooltip-root]`, `.gt-tooltip-box`, `.gt-tooltip-content`, and
`.gt-tooltip-arrow`. Applications migrating from v1 should replace the old
Tippy selectors as described in [Migrating to v2](./migrating-to-v2.md).

## Dimensions

Use `tooltipWidth`, `tooltipHeight`, and `constrainToViewport` for sizing behavior. These options are shared by all tooltip modules.
