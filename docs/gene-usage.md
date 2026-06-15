# Gene Usage

The gene tooltip module uses the MyGene.info adapter to resolve gene symbols and render gene-specific context.

## Import

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';
import 'bio-tooltips/style.css';
```

## Markup

```html
<span class="gene-tooltip" data-species="human">TP53</span>
<span class="gene-tooltip" data-species="mouse">Trp53</span>
```

The element text is the gene query. `data-species` accepts built-in aliases such as `human`, `mouse`, and `zebrafish`, or a numeric NCBI taxonomy ID.

## Initialize

```ts
const cleanup = GeneTooltip.init({
  selector: '.gene-tooltip'
});
```

The default selector is `.gene-tooltip`.

## Lists

One matched element can contain multiple genes when the symbols are separated by commas, semicolons, or spaces.

```html
<span class="gene-tooltip" data-species="human">
  TP53, BRCA1, BRCA2
</span>
```

## Optional Visual Dependencies

The gene tooltip module can show chromosome ideograms and gene tracks. Include D3 and Ideogram on pages that use those visuals.

```html
<script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ideogram@1.53.0/dist/js/ideogram.min.js"></script>
```
