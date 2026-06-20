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

## Section Variants

Tooltips use filled, rounded section cards by default. Use the shared `sectionVariant` option for a flatter layout with simple dividers:

```ts
GeneTooltip.init({
  sectionVariant: 'dividers'
});
```

Supported values are `cards` and `dividers`. The divider variant keeps the same content, collapse behavior, and theme colors while replacing card backgrounds with separators. To customize it further, target `[data-section-variant='dividers']` in application CSS and use the existing theme variables.

### Live Example

Hover over <GeneDemo genes="TP53" species="human" :config="{ sectionVariant: 'dividers', tooltipWidth: 420, truncateSummary: 3 }" /> to see the divider variant in action.

## CSS Variables

Override variables in application CSS:

```css
:root {
  --gt-color-primary: #2563eb;
}
```

## Dimensions

Use `tooltipWidth`, `tooltipHeight`, and `constrainToViewport` for sizing behavior. These options are shared by all tooltip modules.
