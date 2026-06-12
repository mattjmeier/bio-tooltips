# Gene Demo

Hover over the gene names below to see the MyGene.info provider in action.

## Example Genes

Human tumor suppressor: <GeneDemo genes="TP53" species="human" />

Mouse ortholog: <GeneDemo genes="Trp53" species="mouse" />

Fruit fly example: <GeneDemo genes="dib" species="7227" />

Yeast example: <GeneDemo genes="RAD51" species="559292" />

## Lists of Genes

Gene lists can use commas, semicolons, or spaces when all names share the same species context.

::: details Show code

```html
<span class="gene-tooltip" data-species="human">
  TP53, GADD45A, BRCA1, BRCA2, RAD51, ATM, XPA, NOTAGENE
</span>
```

:::

<GeneDemo genes="TP53, GADD45A, BRCA1, BRCA2, RAD51, ATM, XPA, NOTAGENE" species="human" />

## Species Examples

### Human
<GeneDemo genes="TP53, BRCA1, MYC" species="human" />

### Mouse
<GeneDemo genes="Trp53, Mdm2, Gadd45a" species="mouse" />

### Rat
<GeneDemo genes="Tp53, Alb, Il6" species="rat" />

### Fruit fly
<GeneDemo genes="boss, Antp, dib" species="fruitfly" />

### Zebrafish
<GeneDemo genes="noto, wnt5b, sox2" species="zebrafish" />

### Yeast
<GeneDemo genes="PHO5, GAL1, CDC28" species="yeast" />
