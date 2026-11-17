# Framework Integration

Bio Tooltips is framework-agnostic. Initialize a tooltip module after the DOM elements exist, and call the cleanup function when the component or page is torn down.

## React

```jsx
import { useEffect } from 'react';
import { GeneTooltip } from 'bio-tooltips/mygene';
import { ChemicalTooltip } from 'bio-tooltips/mychem';
import 'bio-tooltips/style.css';

export function BioText() {
  useEffect(() => {
    const cleanupGenes = GeneTooltip.init({ selector: '.gene' });
    const cleanupChemicals = ChemicalTooltip.init({ selector: '.chemical' });

    return () => {
      cleanupGenes();
      cleanupChemicals();
    };
  }, []);

  return (
    <p>
      <span className="gene" data-species="human">TP53</span>
      {' responds to compounds such as '}
      <span className="chemical">aspirin</span>.
    </p>
  );
}
```

## Vue

```vue
<template>
  <p>
    <span class="gene" data-species="human">TP53</span>
    responds to compounds such as
    <span class="chemical">aspirin</span>.
  </p>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { GeneTooltip } from 'bio-tooltips/mygene';
import { ChemicalTooltip } from 'bio-tooltips/mychem';
import 'bio-tooltips/style.css';

let cleanup = () => {};

onMounted(() => {
  const cleanupGenes = GeneTooltip.init({ selector: '.gene' });
  const cleanupChemicals = ChemicalTooltip.init({ selector: '.chemical' });

  cleanup = () => {
    cleanupGenes();
    cleanupChemicals();
  };
});

onUnmounted(() => cleanup());
</script>
```

## Vanilla HTML

For a direct browser integration, include the CSS and global bundle, then initialize the tooltip modules you need.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bio-tooltips@2.4.0/dist/bio-tooltips.css">
<script src="https://cdn.jsdelivr.net/npm/bio-tooltips@2.4.0/dist/bio-tooltips.global.js"></script>

<p>
  <span class="gene-tooltip" data-species="human">TP53</span>
  and
  <span class="chemical-tooltip">aspirin</span>
</p>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    GeneTooltip.init({ selector: '.gene-tooltip' });
    ChemicalTooltip.init({ selector: '.chemical-tooltip' });
  });
</script>
```

Gene visuals that use chromosome ideograms also need D3 and Ideogram on the page.

```html
<script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ideogram@1.53.0/dist/js/ideogram.min.js"></script>
```

## Reports and Notebooks

R Markdown, Quarto, Jupyter, MyST, and other report and notebook systems can use Bio Tooltips in their HTML output. Follow the same pattern as the vanilla HTML example above: include the CSS and bundle in the rendered HTML, emit spans with module-specific classes and data attributes, then initialize after the document is ready.

See the repository [examples folder](https://github.com/mattjmeier/bio-tooltips/tree/main/examples) for working starting points.

### R Markdown, Quarto, and Shiny with BioTooltipR

The companion R package [BioTooltipR](https://github.com/mattjmeier/BioTooltipR) handles the HTML markup and dependency registration for R workflows. It registers dependencies with `htmltools`, includes version-pinned browser assets, and supports R Markdown, Quarto, Shiny, and other HTML-producing workflows, with helpers for tables and Plotly interaction.

```r
library(BioTooltipR)

use_bio_tooltips(modules = c("gene", "chemical"))

gene_tt("TP53", species = "human")
chem_tt("aspirin", query = "2244", scope = "pubchem")
```

See the [CRAN package page](https://cran.r-project.org/package=BioTooltipR) for installation and the [BioTooltipR vignette](https://cran.r-project.org/web/packages/BioTooltipR/vignettes/BioTooltipR.html) for usage in reports and interactive applications.
