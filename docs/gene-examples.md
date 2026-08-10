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

## Configured Examples

### Wide Tooltip

<GeneDemo genes="TP53" species="human" :config="{ tooltipWidth: 600, tooltipHeight: 400, truncateSummary: 6 }" />

### Minimal Sections

<GeneDemo genes="TP53" species="human" :config="{ display: { species: false, location: false, ideogram: false, pathways: false, domains: false, geneTrack: false, transcripts: false, structures: false, generifs: false, linksSection: false } }" />

For visual comparisons of every theme and section variant, see [Styling & Theming](./styling-theming.md).

See the [Gene Demo](./demos/gene.md) for live examples.
