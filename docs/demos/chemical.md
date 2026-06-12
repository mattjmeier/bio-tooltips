# Chemical Demo

Hover over the chemical names and identifiers below to see the MyChem.info provider in action.

## Common Names

Analgesic: <ChemicalDemo query="aspirin" />

Stimulant: <ChemicalDemo query="caffeine" />

Kinase inhibitor: <ChemicalDemo query="imatinib" />

## Identifier Scopes

Use `data-query` and `data-scope` when you know a stable identifier. Visible-text name lookup is supported as an experimental best-guess search.

::: details Show code

```html
<span class="chemical-tooltip" data-query="2244" data-scope="pubchem">aspirin</span>
<span class="chemical-tooltip" data-query="CHEMBL25" data-scope="chembl">aspirin</span>
<span class="chemical-tooltip" data-query="DB00945" data-scope="drugbank">aspirin</span>
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
