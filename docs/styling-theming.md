# Styling & Theming

Import the shared stylesheet once:

```ts
import 'bio-tooltips/style.css';
```

The stylesheet includes base Tippy styles, Bio Tooltips layout rules, module section styling, and CSS variables.

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

## Dimensions

Use `tooltipWidth`, `tooltipHeight`, and `constrainToViewport` for sizing behavior. These options are shared by all tooltip modules.
