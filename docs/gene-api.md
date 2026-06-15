# Gene API

## Entry Point

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';
```

## Methods

| Method | Description |
| --- | --- |
| `GeneTooltip.init(config?)` | Initializes gene tooltips and returns a cleanup function. |
| `GeneTooltip.preload()` | Preloads optional heavy dependencies used by gene visuals. |
| `GeneTooltip.filterNestedList(query, listId)` | Filters nested rendered lists by text. |

## Config Type

`GeneTooltipConfig` combines the shared `CoreTooltipConfig` with MyGene-specific options.

| Option | Default | Description |
| --- | --- | --- |
| `api` | `mygene` | Adapter identifier. |
| `selector` | `.gene-tooltip` | Elements to attach gene tooltips to. |
| `truncateSummary` | `4` | Summary line clamp. |
| `display` | Module defaults | Section visibility and collapse state. |
| `ideogram` | Module defaults | Ideogram dimensions and labels. |
| `pathwaySource` | `kegg` | Pathway source: `reactome`, `kegg`, or `wikipathways`. |
| `pathwayCount` | `3` | Number of pathways shown before overflow UI. |
| `domainCount` | `3` | Number of protein domains shown before overflow UI. |
| `transcriptCount` | `3` | Number of transcripts shown before overflow UI. |
| `structureCount` | `3` | Number of PDB structures shown before overflow UI. |
| `generifCount` | `3` | Number of GeneRIFs shown before overflow UI. |

For exact exported types, see the [generated MyGene reference](./api/providers/mygene.md).
