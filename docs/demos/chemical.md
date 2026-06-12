# Chemical Demo

Hover over the chemical names and identifiers below to see the MyChem.info provider in action.

## Common Names

Analgesic: <ChemicalDemo query="aspirin" />

Stimulant: <ChemicalDemo query="caffeine" />

Kinase inhibitor: <ChemicalDemo query="imatinib" />

## Identifier Scopes

Use `data-scope` when the visible text is an identifier rather than a name.

::: details Show code

```html
<span class="chemical-tooltip" data-scope="pubchem">2244</span>
<span class="chemical-tooltip" data-scope="chembl">CHEMBL25</span>
<span class="chemical-tooltip" data-scope="drugbank">DB00945</span>
```

:::

PubChem CID: <ChemicalDemo query="2244" scope="pubchem" />

ChEMBL ID: <ChemicalDemo query="CHEMBL25" scope="chembl" />

DrugBank ID: <ChemicalDemo query="DB00945" scope="drugbank" />

## Display Variants

Compact tooltip:

<ChemicalDemo query="caffeine" :config="{ tooltipWidth: 360, display: { pharmacology: false, regulatory: false, safety: false, identifiers: 'collapsed' } }" />

Source/debug view:

<ChemicalDemo query="aspirin" :config="{ display: { sourcePaths: true, rawJson: true, identifiers: 'expanded' } }" />
