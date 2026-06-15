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

## CSS Variables

Override variables in application CSS:

```css
:root {
  --gt-color-primary: #2563eb;
}
```

## Dimensions

Use `tooltipWidth`, `tooltipHeight`, and `constrainToViewport` for sizing behavior. These options are shared by all tooltip modules.
