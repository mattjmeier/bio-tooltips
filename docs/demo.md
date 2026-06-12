# Live Demos

Hover over the terms below to see both providers using the same tooltip engine.

## Gene Tooltips

The protein encoded by <GeneDemo genes="TP53" species="human" /> is a tumor suppressor. In mice, the ortholog is <GeneDemo genes="Trp53" species="mouse" />. Here is one from fruit fly: <GeneDemo genes="dib" species="7227" />.

Lists work too: <GeneDemo genes="TP53, GADD45A, BRCA1, BRCA2, RAD51, ATM, XPA, NOTAGENE" species="human" />

[Open the dedicated gene demo](./demos/gene.md)

## Chemical Tooltips

Common-name queries can resolve familiar compounds like <ChemicalDemo query="aspirin" />, <ChemicalDemo query="caffeine" />, and <ChemicalDemo query="imatinib" />.

Identifier scopes work when the visible text is not a name: PubChem CID <ChemicalDemo query="2244" scope="pubchem" /> and ChEMBL ID <ChemicalDemo query="CHEMBL25" scope="chembl" />.

[Open the dedicated chemical demo](./demos/chemical.md)

## Code Shape

```ts
import { GeneTooltip } from 'gene-tooltips/mygene';
import { ChemicalTooltip } from 'gene-tooltips/mychem';
import 'gene-tooltips/style.css';

GeneTooltip.init({ selector: '.gene-tooltip' });
ChemicalTooltip.init({ selector: '.chemical-tooltip' });
```
