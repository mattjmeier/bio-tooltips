# Gene Examples

## Single Gene

```html
<span class="gene-tooltip" data-species="human">TP53</span>
```

## Gene List

```html
<span class="gene-tooltip" data-species="human">TP53, BRCA1, BRCA2</span>
```

## Initialization

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';
import 'bio-tooltips/style.css';

GeneTooltip.init({
  selector: '.gene-tooltip'
});
```

See the [Gene Demo](./demos/gene.md) for live examples.
