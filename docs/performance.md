<script setup>
import PerformanceResults from './.vitepress/theme/components/PerformanceResults.vue';
</script>

# Performance

Bio Tooltips is tested in Chromium with live MyGene.info requests and local fixtures,
and in Node.js for HTML rendering. The results below show how page startup, prefetching,
and tooltip interaction behave on the recorded machine and network.

## Browser results

Choose a page size, section-loading mode and measurement view to compare live requests
with fixtures.
Each prefetch strategy groups the two sources together. The larger number is the median;
the smaller range beneath it is the interquartile range (the middle half of trials).
Run dates, sample counts and environment details are available below the table.

<PerformanceResults />

`none` fetches on demand. `all` fetches every distinct identifier ahead of interaction.
`smart` fetches eagerly on small pages; on larger pages it batches identifiers near the
viewport. Prefetching moves API work before the hover, while all three strategies cache
records for repeat interactions. Use **Page startup** to see when the page initializes
and how long the prefetch work takes.

The live and fixture runs use the same gene symbols, duplicate pattern and page layout.
Fixtures return relabeled copies of the stored TP53 record immediately; live requests
return the corresponding records using the library's normal field selection. Differences
therefore include payload size, parsing and rendering as well as network traffic.
No artificial request delay is added.

### Lazy versus eager GeneRIFs

The loading selector compares `sectionLoading: 'lazy'` and `'eager'` with GeneRIFs
enabled and collapsed in both modes. Other annotation-heavy sections and visualizations
are disabled to isolate this choice. **Interaction** and **Page startup** show the cost
before expanding GeneRIFs. **Section expansion** measures the first opening and a repeat.
**Payloads** separates response bytes before expansion from bytes fetched by the first
expansion. Eager mode includes enabled fields upfront; lazy mode fetches missing fields
on expansion. Both use the same bounded cache.

The first expansion opens GeneRIFs for the cached-repeat TP53 tooltip. A normal trial
therefore fetches GeneRIFs for one measured gene in lazy mode, while eager prefetch may
fetch them for every prefetched identifier. This compares the cost of the configured
workflow, not equal final annotation coverage for every gene.

### Large-page stress test

The **1,000 elements / 800 IDs** option exercises a working set larger than the current
500-entry cache. Prefetched records can be evicted before hovering and fetched again.
Prefetch completion tracks distinct successfully fetched identifiers independently of
cache retention, which is recorded in the run data and the Requests details.

The stress set keeps the same first 80 human symbols as the small workloads and adds
720 fixed symbols selected from GeneRIF-annotated human records. It favors annotated
genes rather than representing all genes. Live payload size and latency are observations;
a large improvement from lazy loading is not assumed in advance.

Stress runs are opt-in, with three measured trials after one warm-up by default. Small
samples exercise the system but do not establish stable latency differences; the table
shows sampling for the selected results. Unmeasured combinations show an explicit empty
state. Disabling GeneRIFs entirely is a different workload from deferring their data.

## HTML rendering

These tests measure stored record → HTML string for gene and chemical tooltips. They
exclude network requests, DOM insertion, layout and paint. Each sample averages a batch
of renders after warm-up.

<PerformanceResults kind="renderer" />

## What the measurements mean

| Measurement | Endpoint |
| --- | --- |
| Hover → content | Actual `mouseenter` to the library's `content set` event. |
| Hover → visible DOM | The same hover until its tooltip has content and reaches the visible DOM state. |
| Cached repeat | A hover on a second element using an already cached identifier. |
| DOM loaded | Navigation start to `DOMContentLoaded`. |
| Tooltips ready | Navigation start to completion of tooltip initialization; background prefetch is excluded. |
| Prefetch complete | End of initialization until all distinct query identifiers have been fetched and parsed, even if some are later evicted. |
| First GeneRIF expansion | Actual expansion click until the section is open and deferred content has loaded. |
| Repeat expansion | Collapse and expand the same GeneRIF section again using its loaded content. |
| Provider response | Initial-phase provider request start to completion of the response body, including network and download. |

Each browser trial uses a fresh document and application cache, with Chromium's HTTP
cache disabled. Five distinct identifiers are hovered in sequence, followed by a duplicate
identifier. Hover results summarize the median of those five interactions within each
trial, then the distribution across successful trials. For `smart` and `all`, these
hovers follow completed prefetch; `none` fetches on demand.

Large `smart` pages are scrolled to exercise viewport prefetch. Their completion time
includes scrolling and the observer's 200 ms debounce. Page startup includes the local
server and script-loading overhead. Initialization can finish before `DOMContentLoaded`
fires, so **Tooltips ready** may be slightly earlier than **DOM loaded**.

These are lifecycle and DOM measurements, not browser paint or animation-completion
timings. Optional visuals, visual preloading and animations are disabled. The browser
matrix covers initial gene-tooltip opening and one GeneRIF expansion. It does not measure
the chemical adapter's browser behavior.

Live timings depend on the host, network and provider state. Connections and provider
caches may be reused; these are observations, not service guarantees. Compare runs with
matching settings and environments. Quartiles and p95 use linear interpolation. Failed
trials are recorded in local reports and excluded from timing summaries; only complete,
successful measured runs refresh the published snapshot.

## Run the benchmarks

```bash
npm run benchmark                    # Stored-fixture HTML rendering and bundle sizes
npm run benchmark:browser            # Live MyGene.info requests
npm run benchmark:browser:fixtures   # Immediate local fixture responses
npm run benchmark:publish-results    # Refresh the snapshot used by this page
```

To include the large workload before publishing:

```bash
npm run benchmark:browser:fixtures:stress
npm run benchmark:browser:stress
npm run benchmark:publish-results
```

The stress commands use the same 1,000-element workload for both sources and save
separate `browser-fixture-stress-latest.*` and `browser-live-stress-latest.*` reports.
Large eager runs can download substantial GeneRIF data, so they are excluded from
scheduled refreshes. Manual Actions runs have an **Include stress** option. Routine refreshes retain the last
stress pair with its original date and environment until the next stress run.

Browser runs require Playwright Chromium (`npx playwright install chromium`). Routine
defaults are 30 measured trials after two warm-ups for each strategy and loading mode
at 10 and 100 elements. Set `BENCH_BROWSER_NETWORK_LABEL` when recording live results to describe the network.

For a quick check, reduce the sampling. Small runs verify behavior and are insufficient
for performance conclusions:

```bash
BENCH_BROWSER_LIVE_TRIALS=2 BENCH_BROWSER_LIVE_WARMUPS=1 npm run benchmark:browser
BENCH_BROWSER_TRIALS=2 BENCH_BROWSER_WARMUPS=1 npm run benchmark:browser:fixtures
```

JSON, CSV and Markdown reports are saved under the Git-ignored `benchmark/results/`.
The publish command extracts summaries and provenance into a versioned snapshot; the
docs build renders it without contacting the APIs. A separate weekly or manually
triggered GitHub Action runs the routine benchmarks and proposes a snapshot update in a PR.
Merging it publishes the new tables through the normal docs workflow.

For additional experiments, `npm run benchmark:browser:fields` compares the same live
requests with and without GeneRIF fields. It overrides request fields directly and
measures transport/JSON costs. For the library's normal field planning and loading on
section expansion, see [Gene data fields](./gene-data-fields).
