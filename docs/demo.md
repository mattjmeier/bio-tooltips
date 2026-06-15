# Demo Overview

Hover over the terms below to see multiple tooltip modules using the same shared engine.

## Gene Tooltips

The protein encoded by <GeneDemo genes="TP53" species="human" /> is a tumor suppressor. In mice, the ortholog is <GeneDemo genes="Trp53" species="mouse" />. Here is one from fruit fly: <GeneDemo genes="dib" species="7227" />.

Lists work too: <GeneDemo genes="TP53, GADD45A, BRCA1, BRCA2, RAD51, ATM, XPA, NOTAGENE" species="human" />

[Open the dedicated gene demo](./demos/gene.md)

## Chemical Tooltips

Common-name queries can resolve familiar compounds like <ChemicalDemo query="aspirin" />, <ChemicalDemo query="caffeine" />, and <ChemicalDemo query="imatinib" />.

Identifier scopes work when the visible text is not a name: PubChem CID <ChemicalDemo query="2244" scope="pubchem" /> and ChEMBL ID <ChemicalDemo query="CHEMBL25" scope="chembl" />.

[Open the dedicated chemical demo](./demos/chemical.md)

## Mixed Entity Demo

Gene and chemical tooltip modules can run on the same page.

<p>
  <GeneDemo genes="TP53" species="human" />
  is involved in cellular stress responses that may be relevant when interpreting
  compounds such as
  <ChemicalDemo query="2244" scope="pubchem" label="aspirin" />.
</p>

[Open the mixed entity demo](./demos/mixed.md)

## Code Shape

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';
import { ChemicalTooltip } from 'bio-tooltips/mychem';
import 'bio-tooltips/style.css';

GeneTooltip.init({ selector: '.gene-tooltip' });
ChemicalTooltip.init({ selector: '.chemical-tooltip' });
```
