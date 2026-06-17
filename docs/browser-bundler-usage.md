# Browser / Bundler Usage

## Bundlers

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';
import { ChemicalTooltip } from 'bio-tooltips/mychem';
import 'bio-tooltips/style.css';
```

## Browser CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bio-tooltips@1.0.1/dist/bio-tooltips.css">
<script src="https://cdn.jsdelivr.net/npm/bio-tooltips@1.0.1/dist/bio-tooltips.global.js"></script>
```

The global bundle exposes `BioTooltips` and also initializes the module globals used by the browser examples:

```js
GeneTooltip.init({ selector: '.gene-tooltip' });
ChemicalTooltip.init({ selector: '.chemical-tooltip' });
```
