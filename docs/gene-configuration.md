# Gene Configuration

Gene-specific options extend the shared core config.

## Common Options

```ts
GeneTooltip.init({
  selector: '.gene-tooltip',
  theme: 'auto',
  sectionVariant: 'cards',
  tooltipWidth: 430,
  truncateSummary: 4,
  pathwaySource: 'reactome',
  pathwayCount: 3,
  domainCount: 3,
  transcriptCount: 3,
  structureCount: 3,
  generifCount: 3
});
```

## Display Sections

```ts
GeneTooltip.init({
  display: {
    summary: 'expanded',
    species: true,
    location: 'expanded',
    ideogram: true,
    pathways: true,
    domains: true,
    geneTrack: 'expanded',
    transcripts: true,
    structures: true,
    generifs: true,
    linksSection: true,
    footer: true,
    links: {
      ncbi: true,
      ensembl: true,
      wikipedia: true
    }
  }
});
```

Use `false` to hide a section, `true` to show it with default collapse behavior, or `expanded` / `collapsed` to force the initial state.

`footer: true` shows the MyGene.info attribution and a link to the raw JSON record.

## Ideogram

```ts
GeneTooltip.init({
  ideogram: {
    enabled: true,
    height: 120,
    showLabels: true
  }
});
```

`display.ideogram` controls whether the ideogram appears inside the location section. `ideogram.enabled` controls whether the optional visual is enabled.

## Live Examples

Material theme: <GeneDemo genes="TP53" species="human" :config="{ theme: 'material' }" />

Divider sections: <GeneDemo genes="TP53" species="human" :config="{ sectionVariant: 'dividers' }" />

Wide tooltip: <GeneDemo genes="TP53" species="human" :config="{ tooltipWidth: 600, tooltipHeight: 400, truncateSummary: 6 }" />

Minimal sections: <GeneDemo genes="TP53" species="human" :config="{ display: { species: false, location: false, ideogram: false, pathways: false, domains: false, geneTrack: false, transcripts: false, structures: false, generifs: false, linksSection: false } }" />
