# Gene Tooltip Configuration Reference

This package uses a single configuration object (`GeneTooltipConfig`) to control all aspects of tooltip rendering, data fetching, and display behavior.  
You can pass this object when initializing your tooltip instance.

Example:
```ts
import { defaultConfig } from 'gene-tooltips';

const config = {
  ...defaultConfig,
  truncateSummary: 3,
  pathwaySource: 'reactome',
  theme: 'auto',
};

new GeneTooltip(config);
```

## 🧩 Top-Level Configuration Options

### `selector`
- **Type:** `string`
- **Default:** `'.gene-tooltip'`
- CSS selector used to find gene elements to attach tooltips to.

---

### `api`
- **Type:** `'mygene'`
- **Default:** `'mygene'`
- Specifies which backend API to use (currently only `mygene.info` supported).

---

### `prefetch`
- **Type:** `'smart' | 'all' | 'none'`
- **Default:** `'smart'`
- Controls when gene data is prefetched:
  - `'smart'` – only prefetch visible or soon-to-be-visible tooltips.
  - `'all'` – prefetch all tooltip data immediately.
  - `'none'` – fetch data only when a tooltip is opened.

---

### `prefetchThreshold`
- **Type:** `number`
- **Default:** `15`
- Number of tooltip elements to trigger prefetching behavior.

---

### `truncateSummary`
- **Type:** `number`
- **Default:** `4`
- Maximum number of sentences to display in a gene summary.

---

### `theme`
- **Type:** `string`
- **Default:** `'auto'`
- Tooltip theme. Accepts `"light"`, `"dark"`, `"auto"`, or a custom Tippy.js theme name.

---

### `tooltipWidth`
- **Type:** `number` *(optional)*
- Sets a fixed width (in pixels) for the tooltip container.

### `tooltipHeight`
- **Type:** `number` *(optional)*
- Sets a fixed height (in pixels) for the tooltip container.


## 🎨 Display Configuration (`display`)

Control which content sections are shown in the tooltip. `display.collapsible` and `display.collapsedByDefault` are global options, but they can be over-ridden with granular settings.

The display keys accept:

`false`: Hide section.
`true`: Show section (uses collapsedByDefault state).
`'expanded'`: Force start open.
`'collapsed'`: Force start closed.

Note: `display.ideogram` simply toggles the graphic on/off, but the section it lives in is controlled by display.location.

### `display`
- **Type:** `Partial<TooltipDisplayConfig>`
- **Default:**
  ```ts
  {
    species: boolean; // Header only, no collapse state
    location: SectionVisibility;
    ideogram: boolean; // Integrated into location, no separate collapse
    pathways: SectionVisibility;
    domains: SectionVisibility;
    geneTrack: SectionVisibility;
    transcripts: SectionVisibility;
    structures: SectionVisibility;
    generifs: SectionVisibility;
    linksSection: SectionVisibility; // Controls the "Links" container
    links: {
      ncbi: boolean;
      ensembl: boolean;
      wikipedia: boolean;
    };
  }
  ```

**Available options:**

| Option | Type | Default | Description |
|--------|------|----------|-------------|
| `species` | `boolean` | `true` | Show species name and taxonomy info. |
| `location` | `boolean` | `true` | Show genomic coordinates (chromosome, start, end). |
| `ideogram` | `boolean` | `true` | Show chromosome ideogram visualization. |
| `pathways` | `boolean` | `true` | Show associated biological pathways. |
| `domains` | `boolean` | `true` | Show InterPro protein domains. |
| `geneTrack` | `boolean` | `true` | Show gene track visualization (exons/introns). |
| `transcripts` | `boolean` | `true` | Show transcript information (e.g., ENSEMBL IDs). |
| `structures` | `boolean` | `true` | Show PDB or 3D structure references. |
| `generifs` | `boolean` | `true` | Show GeneRIF functional annotations. |
| `links.ncbi` | `boolean` | `true` | Show link to NCBI Gene page. |
| `links.ensembl` | `boolean` | `true` | Show link to ENSEMBL Gene page. |
| `links.wikipedia` | `boolean` | `true` | Show link to Wikipedia. |
| `selector` | `string` | `'.gene-tooltip'`| CSS selector for tooltip targets.|
| `api` | `'mygene'` | `'mygene'` | Backend API source.|
| `prefetch` | `'smart'` \| `'all'` \| `'none'` | `'smart'` | Prefetching behavior. |
| `theme` | `string` | `'auto'` | Tooltip theme. |
| `display` | `Partial<TooltipDisplayConfig> `| (see below) | Controls visibility and accordion state. |
| `display.collapsible` | `boolean` | `true` | Enables accordion-style headers. |
| `display.collapsedByDefault` | `boolean` | `true` | Default state for sections. |
| `constrainToViewport` | `boolean` | `true` | Prevents tooltip from exceeding screen height. |
| `nestedTippyOptions` | `Partial<Props> `| `{ placement: 'right', ... }` | Config for "Show more" popovers. |
| `tippyOptions` | `Partial<Props>` | `{...}` | Main tooltip behavior (Tippy.js props). |

## 🧬 Ideogram Configuration (`ideogram`)

Controls the small chromosome ideogram visualization.

### `ideogram`
- **Type:** `Partial<IdeogramConfig>`
- **Default:**
  ```ts
  {
    enabled: true,
    height: 100,
    showLabels: false,
  }
  ```

**Available options:**

| Option | Type | Default | Description |
|--------|------|----------|-------------|
| `enabled` | `boolean` | `true` | Toggle ideogram display. |
| `width` | `number` | *none* | Set custom width in pixels. |
| `height` | `number` | `100` | Set height of the ideogram in pixels. |
| `showLabels` | `boolean` | `false` | Show chromosome labels. |

## 🧬 Pathway Configuration

### `pathwaySource`
- **Type:** `'reactome' | 'kegg' | 'wikipathways'`
- **Default:** `'kegg'`
- Which pathway source to display when multiple are available.

### `pathwayCount`
- **Type:** `number`
- **Default:** `3`
- Maximum number of pathways to display.

## 🧬 Domain and Structure Settings

| Option | Type | Default | Description |
|--------|------|----------|-------------|
| `domainCount` | `number` | `3` | Maximum number of InterPro domains to show. |
| `structureCount` | `number` | `3` | Maximum number of protein structures (PDB) to show. |

## 🧬 Transcript and GeneRIF Settings

| Option | Type | Default | Description |
|--------|------|----------|-------------|
| `transcriptCount` | `number` | `3` | Maximum number of transcripts to show. |
| `generifCount` | `number` | `3` | Maximum number of GeneRIF annotations to show. |

## 💬 Tippy.js Options (`tippyOptions`)

Pass any subset of [Tippy.js options](https://atomiks.github.io/tippyjs/v6/all-props/) to customize tooltip behavior.

### Default:
```ts
{
  allowHTML: true,
  interactive: true,
  placement: 'bottom',
}
```

Common overrides:
| Option | Type | Description |
|--------|------|-------------|
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | Tooltip placement relative to target. |
| `delay` | `[number, number]` | Delay for showing/hiding tooltips. |
| `theme` | `string` | Name of a Tippy.js theme. |
| `maxWidth` | `number` | Maximum tooltip width in pixels. |

---

# 🧾 Complete Prop Reference

| Property | Type | Default | Description |
|-----------|------|----------|-------------|
| `selector` | `string` | `'.gene-tooltip'` | CSS selector for tooltip targets. |
| `api` | `'mygene'` | `'mygene'` | Backend API source. |
| `prefetch` | `'smart' \| 'all' \| 'none'` | `'smart'` | Prefetching behavior. |
| `prefetchThreshold` | `number` | `15` | Number of elements before prefetching triggers. |
| `truncateSummary` | `number` | `4` | Number of sentences to show in gene summary. |
| `theme` | `string` | `'auto'` | Tooltip theme. |
| `tooltipWidth` | `number` | — | Fixed width (px). |
| `tooltipHeight` | `number` | — | Fixed height (px). |
| `display` | `Partial<TooltipDisplayConfig>` | *(see defaults above)* | Controls which sections are visible. |
| `ideogram` | `Partial<IdeogramConfig>` | *(see defaults above)* | Controls ideogram appearance. |
| `pathwaySource` | `'reactome' \| 'kegg' \| 'wikipathways'` | `'kegg'` | Pathway source. |
| `pathwayCount` | `number` | `3` | Number of pathways to show. |
| `domainCount` | `number` | `3` | Number of InterPro domains to show. |
| `transcriptCount` | `number` | `3` | Number of transcripts to show. |
| `structureCount` | `number` | `3` | Number of PDB structures to show. |
| `generifCount` | `number` | `3` | Number of GeneRIF annotations to show. |
| `tippyOptions` | `Partial<Props>` | `{ allowHTML: true, interactive: true, placement: 'bottom' }` | Tooltip behavior and styling. |

## 🔧 Example Minimal Override

```ts
new GeneTooltip({
  selector: '.gene',
  theme: 'dark',
  pathwaySource: 'reactome',
  display: { domains: false, generifs: false },
});
```

