# Performance Benchmarking

Bio Tooltips has a deterministic Node benchmark and a separate Chromium benchmark. The
first measures stored-fixture rendering and a simulated fetch/render pipeline. The
browser benchmark initializes the built library against a local page and controlled API
responses. Neither default command contacts MyGene.info or MyChem.info. Separate
opt-in commands measure real MyGene.info requests and compare field selection.

## Example Results

These tables are snapshots from saved benchmark runs, rather than performance targets.
They were recorded with package version **2.3.2**, based on commit `144c30e3fe10`
with uncommitted changes, before section-aware loading was added. They illustrate
renderer costs and prefetch behavior; they do **not** measure lazy section expansion
or establish a before/after improvement for it.

All runs used Linux x64 on an AMD Ryzen 9 3950X with Node.js 24.14.0.
Browser runs used Chromium 153.0.8010.12. Values are milliseconds unless stated
otherwise; IQR is the first to third quartile.

### Stored-Fixture HTML Rendering

Recorded **2026-11-16 23:56 UTC**. Each row summarizes 100 samples of 20 operations
(2,000 renders), after warm-up, using the curated fixtures. This measures HTML string
generation, excluding requests, DOM insertion, layout, and paint.

| Tooltip | Median (ms/render) | IQR (ms/render) | p95 (ms/render) |
| --- | ---: | ---: | ---: |
| MyGene TP53 | 0.017 | 0.015–0.019 | 0.024 |
| MyGene BRCA1 | 0.014 | 0.013–0.017 | 0.018 |
| MyChem aspirin | 0.178 | 0.171–0.185 | 0.197 |

### Controlled Browser Prefetch

Recorded **2026-11-17 00:17 UTC**, with 30 measured trials after two warm-ups per
scenario and a simulated **100 ms delay per request**. Each trial starts with a fresh
page and application cache; browser HTTP caching and optional visuals are disabled.
Hover values summarize each trial's median across five distinct identifiers.
`smart` and `all` are measured after prefetch completes; `none` fetches on demand.

| Elements / unique IDs | Prefetch | Hover → content, median (IQR ms) | Repeat cached hover → content, median (IQR ms) | Prefetch batch requests | Requests during five hovers |
| --- | --- | ---: | ---: | ---: | ---: |
| 10 / 8 | `none` | 104.5 (104.3–104.7) | 1.100 (1.000–1.200) | 0 | 5 |
| 10 / 8 | `smart` | 0.900 (0.800–0.900) | 1.000 (1.000–1.100) | 1 | 0 |
| 10 / 8 | `all` | 0.850 (0.800–0.900) | 1.100 (1.000–1.200) | 1 | 0 |
| 100 / 80 | `none` | 104.5 (104.1–104.8) | 1.100 (1.000–1.100) | 0 | 5 |
| 100 / 80 | `smart` | 0.900 (0.800–0.975) | 1.000 (1.000–1.100) | 3 | 0 |
| 100 / 80 | `all` | 0.900 (0.800–0.900) | 1.100 (1.000–1.100) | 1 | 0 |

“Hover → content” starts at the actual `mouseenter` event and ends at the library's
`content set` checkpoint; it excludes Playwright hover preparation and is not a paint
measurement. Request counts are median HTTP batch calls, not records. Prefetch moves
requests ahead of interaction; it still takes time and transfers data. Large `smart`
pages were scrolled to populate the cache, including the observer's 200 ms debounce.
The imposed delay is not observed MyGene.info latency. These browser results cover
the gene adapter; the chemical row above measures only its HTML renderer.

### Live Field-Selection Sample

Recorded **2026-11-17 02:20–02:22 UTC** against MyGene.info, with no simulated delay.
This small experiment used only **two measured trials after one warm-up** per variant
and scenario; it illustrates payload differences and is insufficient for latency
conclusions. The excerpt below uses `prefetch: 'all'` on 100 elements / 80 distinct
human gene identifiers. Both variants completed 2/2 trials with no failures and one
prefetch POST per trial.

| Requested fields | Total response bodies, median (IQR MB) | Prefetch completion, median (IQR ms) |
| --- | ---: | ---: |
| Fixed reference list | 8.37 (8.37–8.37) | 5874.1 (5713.7–6034.6) |
| Same list without `generif` | 0.23 (0.23–0.23) | 409.5 (392.6–426.3) |

The harness changed only the outgoing field list, alternating variant order within
matched trials; GeneRIF display stayed disabled in both. The reference list is not
`fields=all`. Bytes sum encoded response bodies across a trial, excluding headers
(decimal MB). Network type/location was unspecified; connections and provider caches
could be reused. These observations depend on the selected genes, host, network, and
provider state. The experiment overrides request fields directly and does not test
automatic section-aware selection or loading on expansion.

## Commands and outputs

```bash
npm run benchmark
npm run benchmark:browser
# Optional live API experiment
npm run benchmark:browser:live
# Optional live field-selection comparison
npm run benchmark:browser:fields
```

`benchmark` builds the ESM bundles, measures pure HTML rendering, compares its
synthetic uncached/prefetched/warm-cache pipeline, and records raw and gzip bundle sizes.
It writes `benchmark/results/latest.json`, `latest.csv`, and `latest.md`.

`benchmark:browser` builds the browser bundles and runs the Chromium page experiment. It
defaults to 30 measured trials after 2 warm-ups for each of `none`, `smart`, and `all`
with 10 and 100 annotated elements. This tests page sizes below and above the default
smart threshold of 15. Set `BENCH_BROWSER_INCLUDE_500=1` to add the optional 500-element
scenario. It writes `browser-latest.json`, `browser-latest.csv`, and
`browser-latest.md`. JSON contains the individual trials; CSV and Markdown contain
summaries. These files are ignored by Git.

To make a quick development run, reduce trial counts and latency:

```bash
BENCH_BROWSER_TRIALS=2 BENCH_BROWSER_WARMUPS=1 BENCH_BROWSER_LATENCY_MS=0 npm run benchmark:browser
```

The browser command needs the Playwright Chromium browser installed. On a new setup,
install it with `npx playwright install chromium`.

## Measurement definitions

The deterministic command measures stored provider record → HTML string. Its simulated
pipeline adds `BENCH_LATENCY_MS` (default 50 ms) before uncached work or completes that
delay before the prefetched interaction. It is a model of a delay, not a measured service
response. Bundle sizes are emitted artifact sizes; HTML byte counts do not represent
layout or paint costs.

The browser benchmark serves the same generated HTML template for every prefetch
strategy. It uses varied gene identifiers derived from the checked-in TP53 record,
repeats some identifiers, disables optional visual preload and visual sections, and
intercepts the normal MyGene.info batch endpoint. Each intercepted request receives a
fixed delay (`BENCH_BROWSER_LATENCY_MS`, default 100 ms) and deterministic fixture data.
This preserves real initialization, event handling, fetch parsing, cache writes,
rendering, and DOM insertion. Controlled responses always return the complete fixture
regardless of requested fields; they do not measure field-selection savings. Their byte
counts measure decoded response bodies, excluding protocol and transport overhead.

| Measurement | Start and endpoint |
| --- | --- |
| Page load | Browser `navigationStart` to `DOMContentLoaded` from Navigation Timing. |
| Initialization | Synchronous duration of `GeneTooltip.init()`. |
| Page readiness | Navigation start to the inline module completing real tooltip initialization. Optional background prefetch is excluded. |
| Prefetch completion | Initialization endpoint to all distinct identifiers becoming cached. For large `smart` pages the runner scrolls through the page to trigger viewport observers; this includes scrolling and the implementation's 200 ms debounce. |
| Interaction to content | Median across five sequential hovers on distinct identifiers, each measured from in-page capture of the actual `mouseenter` event to its `onTiming` `content set` checkpoint. Playwright's hover preparation is excluded. The report summarizes those per-trial medians. |
| Interaction to visible | Median across the same five hovers from `mouseenter` capture until the active trigger's own tooltip contains the record and reaches its visible DOM state, timestamped by an in-page MutationObserver. It is not a paint trace or animation completion. |
| Repeat cached interaction | Actual `mouseenter` to content on a second element referencing the first identifier, already cached after the first five hovers. This constructs another tooltip; reopening the original trigger has a separate retained-content path. |

Each trial navigates to a fresh document and JavaScript realm, and Chromium's HTTP cache
is disabled for the run, so application memory cache starts cold. The page readiness
endpoint is captured before background requests complete. `none` has no
prefetch; each of its first five interactions needs a fetch. It still caches on-demand
results, so its repeat interaction is cache-served. For `all`, the full distinct identifier
set is fetched eagerly. `smart` eagerly fetches when there are at most 15 elements; over
15 it observes elements within a 200 px viewport margin and batches visible entries
after a 200 ms debounce. `whenPrefetchReady()` only waits for eager work. For large
`smart` pages it resolves after observer setup, so the runner separately scrolls and
waits until the records are actually cached.

Reports include total annotated elements, distinct identifiers, API batch requests made
for prefetch separately from requests made during five hovers, fetched distinct records,
initialization requests, cache hits observable through timing events, response-body bytes,
package version, Git commit, working-tree status, and SHA-256 hashes of the harness,
configuration, fixture, and built artifacts captured before the run. An API request may
fetch multiple records. Repeated elements are not counted as distinct records. Page-load and
readiness include browser and local server overhead. The
interaction endpoint is a library lifecycle event; do not compare it directly with
renderer-only timings. The visible endpoint includes DOM insertion and browser scheduling
but does not measure GPU paint. Optional D3/Ideogram visual preload is disabled so it is
independent of annotation prefetch.

## Section-Aware Loading

Initial requests and prefetches select the fields needed for the tooltip header and
expanded sections. Disabled sections add no fields. When collapsible sections start
collapsed, their remaining annotations load on first expansion. Set a section to
`'expanded'` to fetch it immediately; `display.collapsible: false` fetches all enabled
sections immediately. MyGene pathway requests select only `pathwaySource`.

The shared cache tracks requested fields, including annotations absent from a
successful response. Expansions fetch missing fields by the resolved record ID and
merge them into the cached record. Different tooltip configurations can share partial
records without mistaking them for complete responses. Failed section loads can be
retried by collapsing and expanding the section.

A collapsed section initially appears even when its annotation availability is unknown.
If the API returns no annotation, expansion shows “No data available.” MyChem name
searches also request the identity and synonym fields needed for stable match ranking.
Enabling MyChem `display.rawJson` requests the complete record immediately.

Measure initial opening and section expansion separately when evaluating network
performance. Pure-renderer benchmarks use stored records and do not measure this
request behavior.

## Interpreting results

The Markdown table reports medians and IQR (first to third quartile). Percentiles use
linear interpolation at index `(n - 1) × p` in the sorted observations (R type 7). Compare rows only
when browser version, operating system, hardware, page size, simulated delay, and trial
settings are alike. Shared machine load, thermal state, browser scheduling, and runtime
versions can shift timings. The 100 ms control delay is simulated and must not be labeled
as MyGene.info or MyChem.info latency. The browser benchmark currently measures the gene
adapter; chemical behavior is covered by the functional test suite and the deterministic
renderer benchmark, not by this page-size matrix. The five-hover timing is uncached for
`none` and cache-served after prefetch for `smart` and `all`; the repeat interaction is
cache-served for every strategy.

Browser result schema version 2 defines interaction timing from the actual DOM event
and timestamps visible state inside the page. Compare measurements only when their
schema, measurement version, and endpoint definitions match. `measurementVersion`
identifies the timing definitions, including initialization limited to the synchronous
`GeneTooltip.init()` call. Trigger boxes use text width and the pointer
moves clear between hovers so preceding tooltips do not obscure the next target.

The Node "pipeline" is only a synthetic delay plus HTML-string generation; its cached
conditions exercise neither the real cache nor the browser lifecycle.

## Fixtures and live services

The deterministic renderer uses small, curated TP53, BRCA1, and aspirin fixtures in
`benchmark/fixtures/`. These exercise rendering but do not reproduce the payload size
or field proportions of complete live records. Use live measurements for payload
comparisons. `npm run benchmark:fixtures` fetches fresh records from public services
and intentionally changes tracked files; review changes before keeping them.

`npm run benchmark:browser:live` runs the same six strategy/page-size scenarios using
80 fixed real human gene symbols and the library's normal MyGene.info POST requests.
It applies no fixture interception or artificial delay. Defaults are 30 measured trials
after two warm-ups per scenario, with a 250 ms pause between trials. Optional visual
rendering, visual preload and animations remain disabled; the normal API field selection
is unchanged. The live mode supports 10/100 elements; the optional 500-element scenario
is available only in controlled mode.

Live JSON, CSV and standalone Markdown are saved as `browser-live-latest.*`. The shared
`browser-latest.md` contains separate controlled and live tables, each with its own date
and environment. A live-only run preserves the controlled JSON/CSV; a controlled-only run
preserves the saved live results. Neither command automatically runs the other condition.

Use `BENCH_BROWSER_LIVE_TRIALS` and `BENCH_BROWSER_LIVE_WARMUPS` to adjust sampling,
`BENCH_BROWSER_LIVE_PAUSE_MS` for trial spacing, and `BENCH_BROWSER_LIVE_TIMEOUT_MS`
for the content/prefetch timeout (default 15000 ms). Set `BENCH_BROWSER_NETWORK_LABEL`
to describe the measurement network; otherwise the report explicitly records it as
unspecified. No location or connection type is inferred automatically.

Live reports include successful/attempted trials, failures and provider POST start-to-body
completion timing, alongside interaction metrics. Failed trials are retained with request
timestamps, queries, HTTP statuses and errors in JSON and excluded from latency summaries;
the command exits unsuccessfully if any measured trial fails. Failed warm-ups are also
recorded. Request counts refer to POST batch calls, not records. Live response body sizes
use encoded network bytes (excluding headers); controlled response sizes count decoded
fixture bytes. Each trial starts with a fresh document and application cache and disables
the browser HTTP cache, while browser connections and
provider-side caches may be reused. Live measurements are observations for the recorded
host, date and network, rather than provider service guarantees or cold-connection timings.

### Field-selection comparison

```bash
npm run benchmark:browser:fields
# Small live smoke run, not enough trials for performance conclusions:
BENCH_BROWSER_PAGE_SIZES=10 BENCH_BROWSER_LIVE_TRIALS=1 BENCH_BROWSER_LIVE_WARMUPS=0 npm run benchmark:browser:fields
```

This opt-in live experiment compares the fixed reference field list (`reference`)
with exactly the same list minus `generif` (`without-generif`). “Reference” does not
mean `fields=all`. The benchmark overrides only the outgoing POST `fields` parameter;
queries, species, scopes, tooltip display settings and prefetch strategies are identical.
GeneRIF display stays disabled in both variants, isolating transport/JSON costs rather
than a change in displayed content. Request fields are controlled by the harness,
independently of the library configuration. This comparison does not exercise automatic
field planning or loading on expansion.

Each scenario runs both variants in alternating order within matched trial numbers,
including warm-ups. Both use fresh documents/application caches. Defaults are the same
30 measured trials and two warm-ups per variant/scenario, with live environment settings
and failure handling described above. The library parses real responses; the harness
checks that limited responses omit `generif` and reference trials include GeneRIF data.

Results are saved separately as `browser-fields-latest.json`, `.csv`, and `.md`. The
combined `browser-latest.md` displays field-selection results alongside any saved controlled
and ordinary live results. Running any mode preserves the other modes' JSON/CSV, dates
and environments. Exact outgoing field lists, variants, matched trial numbers, response
validation counts, statuses and failures are recorded. Encoded response body bytes and
provider/hover timings are reported as median (IQR); no payload dominance or latency
improvement is assumed across genes. This is observational, with reused connections and
provider caches possible; alternating order is not randomization.

`BENCH_BROWSER_PAGE_SIZES=10`, `100`, or `10,100` restricts live scenarios; controlled
mode additionally permits `500`. This can be used with any browser benchmark mode.

`onTiming` provides application lifecycle checkpoints without console logs:

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';

GeneTooltip.init({
  prefetch: 'all',
  onTiming(event) {
    console.log(event.label, event.elapsedMs);
  }
});
await GeneTooltip.whenPrefetchReady();
```

Useful labels include `onShow`, `cache hit`, `fetch complete`, `content set`,
`visuals render complete`, and `nested tooltips attached`. Event elapsed times are
relative to that tooltip's `onShow`. `clearCache()` and `cacheSize()` help controlled
experiments but are usually not needed in application code. Ordinary tests verify
behavior and request deduplication without fixed timing thresholds because machine load
varies.
