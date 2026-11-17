<script setup>
import PerformanceResults from './.vitepress/theme/components/PerformanceResults.vue';
</script>

# Performance

Bio Tooltips is tested in Chromium with live MyGene.info requests and local fixtures,
and in Node.js for HTML rendering. The results below show how page startup, prefetching,
and tooltip interaction behave on the recorded machine and network.

## Browser results

Choose a page size and a measurement view to compare live requests with fixtures.
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
| Prefetch complete | End of initialization until all distinct identifiers are cached. |
| Provider response | Live POST request start to completion of the response body, including network and download. |

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
matrix covers the gene adapter and initial tooltip opening; it does not measure section
expansion or the chemical adapter's browser behavior.

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

Browser runs require Playwright Chromium (`npx playwright install chromium`). Defaults
are 30 measured trials after two warm-ups for each strategy at 10 and 100 elements.
Set `BENCH_BROWSER_NETWORK_LABEL` when recording live results to describe the network.

For a quick check, reduce the sampling. Small runs verify behavior and are insufficient
for performance conclusions:

```bash
BENCH_BROWSER_LIVE_TRIALS=2 BENCH_BROWSER_LIVE_WARMUPS=1 npm run benchmark:browser
BENCH_BROWSER_TRIALS=2 BENCH_BROWSER_WARMUPS=1 npm run benchmark:browser:fixtures
```

JSON, CSV and Markdown reports are saved under the Git-ignored `benchmark/results/`.
The publish command extracts summaries and provenance into a versioned snapshot; the
docs build renders it without contacting the APIs. A separate weekly or manually
triggered GitHub Action runs the full benchmarks and proposes a snapshot update in a PR.
Merging it publishes the new tables through the normal docs workflow.

For additional experiments, `npm run benchmark:browser:fields` compares the same live
requests with and without GeneRIF fields. It overrides request fields directly and
measures transport/JSON costs. For the library's normal field planning and loading on
section expansion, see [Gene data fields](./gene-data-fields).
