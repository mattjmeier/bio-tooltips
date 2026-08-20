# Installation & Imports

Install the npm package:

```bash
npm install bio-tooltips
```

Import the CSS once:

```ts
import 'bio-tooltips/style.css';
```

## Package Imports

The package ships standard ESM entry points for modern bundlers. Prefer the module subpaths so applications include only the tooltip modules they use:

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';
import { ChemicalTooltip } from 'bio-tooltips/mychem';
```

The root entry point also exports both modules:

```ts
import { GeneTooltip, ChemicalTooltip } from 'bio-tooltips';
```

## Browser CDN

Use pinned package versions in production CDN URLs:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bio-tooltips@2.0.9/dist/bio-tooltips.css">
<script src="https://cdn.jsdelivr.net/npm/bio-tooltips@2.0.9/dist/bio-tooltips.global.js"></script>
```

The global bundle exposes the module globals used by browser examples:

```js
GeneTooltip.init({ selector: '.gene-tooltip' });
ChemicalTooltip.init({ selector: '.chemical-tooltip' });
```
