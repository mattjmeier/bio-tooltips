# Mixed Entity Demo

Gene and chemical tooltip modules can coexist on the same page. Hover over the entities below.

<p>
  <GeneDemo genes="TP53" species="human" />
  is involved in cellular stress responses that may be relevant when interpreting
  compounds such as
  <ChemicalDemo query="2336" scope="pubchem" label="benzo[a]pyrene" />.
</p>

## HTML Pattern

```html
<p>
  <span class="gene-tooltip" data-species="human">TP53</span>
  is involved in cellular stress responses that may be relevant when interpreting
  compounds such as
  <span class="chemical-tooltip" data-query="2336" data-scope="pubchem">benzo[a]pyrene</span>.
</p>
```

## Initialization

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';
import { ChemicalTooltip } from 'bio-tooltips/mychem';
import 'bio-tooltips/style.css';

const cleanupGenes = GeneTooltip.init({ selector: '.gene-tooltip' });
const cleanupChemicals = ChemicalTooltip.init({ selector: '.chemical-tooltip' });
```
