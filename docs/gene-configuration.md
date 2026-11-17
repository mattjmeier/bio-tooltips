# Gene Configuration & Examples

Gene-specific options extend the shared core config.

The shared `triggerStyle` option can be set to `'dotted'`, `'solid'`, or `'bold'`, or composed as `['dotted', 'bold']`. It defaults to `'none'`; see [trigger affordance styling](./styling-theming.md#tooltip-trigger-affordance).

## Common Options

```ts
GeneTooltip.init({
  selector: '.gene-tooltip',
  theme: 'auto',
  sectionVariant: 'cards',
  sectionLoading: 'lazy',
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

These examples show how configuration choices change the rendered tooltip. See the [Gene Demo](./demos/gene.md) for a broader gallery of genes, lists, and species.

### Lazy-Loaded Sections

Open TP53 below, then expand **GeneRIFs** or **Pathways**. The initial request includes the header and expanded sections; annotations needed only by collapsed sections are fetched on first expansion. You may briefly see “Loading details…” while the request completes.

<GeneDemo genes="TP53" species="human" :config="{ prefetch: 'none', sectionLoading: 'lazy', display: { summary: 'expanded', pathways: 'collapsed', generifs: 'collapsed' } }" />

```ts
GeneTooltip.init({
  prefetch: 'none',
  sectionLoading: 'lazy',
  display: {
    summary: 'expanded',
    pathways: 'collapsed',
    generifs: 'collapsed'
  }
});
```

`sectionLoading: 'lazy'` is the default. Expanded sections load initially; collapsed
sections fetch missing fields when first expanded. `false` hides a section and omits its
fields; `true` follows `display.collapsedByDefault`. Pathways request only the configured
`pathwaySource`. Noncollapsible sections always load initially.

This example disables prefetch to make the first opening easier to inspect. With `prefetch: 'smart'` or `'all'`, prefetch also selects initial fields and leaves collapsed sections for expansion. Successfully loaded fields are reused while cached; another example on this page may already have loaded the same annotation. If a request fails, collapse and expand to retry. A successful response without annotations shows “No data available.”

### Eager Data, Collapsed Sections

Use `sectionLoading: 'eager'` to fetch every enabled section's fields in the initial
request while keeping the same accordion display. Open BRCA1, then expand **GeneRIFs**
or **Pathways**: their data is already available when the initial request succeeds.

<GeneDemo genes="BRCA1" species="human" :config="{ prefetch: 'none', sectionLoading: 'eager', display: { summary: 'expanded', pathways: 'collapsed', generifs: 'collapsed' } }" />

```ts
GeneTooltip.init({
  prefetch: 'none',
  sectionLoading: 'eager',
  display: {
    summary: 'expanded',
    pathways: 'collapsed',
    generifs: 'collapsed'
  }
});
```

Disabled sections still add no fields. Shared caching remains enabled; this setting
changes the initial field selection, not whether records are cached. With `prefetch: 'smart'` or `'all'`, those enabled fields are included during prefetch instead.

### Wide Tooltip

<GeneDemo genes="TP53" species="human" :config="{ tooltipWidth: 600, tooltipHeight: 400, truncateSummary: 6 }" />

```ts
GeneTooltip.init({
  tooltipWidth: 600,
  tooltipHeight: 400,
  truncateSummary: 6
});
```

### Minimal Sections

<GeneDemo genes="TP53" species="human" :config="{ display: { species: false, location: false, ideogram: false, pathways: false, domains: false, geneTrack: false, transcripts: false, structures: false, generifs: false, linksSection: false } }" />

```ts
GeneTooltip.init({
  display: {
    species: false,
    location: false,
    ideogram: false,
    pathways: false,
    domains: false,
    geneTrack: false,
    transcripts: false,
    structures: false,
    generifs: false,
    linksSection: false
  }
});
```

For visual comparisons of every theme and section variant, see [Styling & Theming](./styling-theming.md).
