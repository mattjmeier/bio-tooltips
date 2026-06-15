# Framework Integration

Bio Tooltips is framework-agnostic. Initialize a tooltip module after the DOM elements exist, and call the cleanup function when the component or page is torn down.

## React

```jsx
import { useEffect } from 'react';
import { GeneTooltip } from 'bio-tooltips/mygene';
import { ChemicalTooltip } from 'bio-tooltips/mychem';
import 'bio-tooltips/style.css';

export function BiomedicalText() {
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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bio-tooltips@latest/dist/bio-tooltips.css">
<script src="https://cdn.jsdelivr.net/npm/bio-tooltips@latest/dist/bio-tooltips.global.js"></script>

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

RMarkdown, Jupyter, MyST, and other static report systems follow the same pattern: include the CSS and bundle in the rendered HTML, emit spans with module-specific classes and data attributes, then initialize after the document is ready.

See the repository `examples` folder for working starting points.
