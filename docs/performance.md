# Performance Benchmarking

Bio Tooltips includes a reproducible benchmark harness for measuring HTML rendering and
controlled cached, prefetched, and uncached interaction pipelines.

## Run the Benchmark

From a clean checkout with dependencies installed:

```powershell
npm run benchmark
```

The command builds the JavaScript entry points, warms each renderer, runs repeated
measurements, prints a Markdown report, and writes:

- `benchmark/results/latest.json` with raw measurements and environment metadata
- `benchmark/results/latest.md` with publication-ready tables

Generated reports are ignored by Git so results from different machines are not
accidentally mixed.

The defaults can be adjusted through environment variables:

```powershell
$env:BENCH_SAMPLES = '200'
$env:BENCH_OPS_PER_SAMPLE = '25'
$env:BENCH_PIPELINE_TRIALS = '50'
$env:BENCH_LATENCY_MS = '100'
npm run benchmark
```

The benchmark reports the median, interquartile range, and 95th percentile. Prefer the
median and IQR in manuscripts because network and scheduling outliers can strongly
affect the mean.

The report also records raw and gzip sizes for the root, module-specific, and stylesheet
artifacts. Output HTML byte counts are included because large generated strings can
affect allocation and DOM insertion costs even when formatter execution is fast.

## What Is Measured

The pure-renderer table measures:

> Stored provider record → generated tooltip HTML

This isolates Bio Tooltips formatting and rendering from network behavior. It does not
measure browser layout or paint.

The controlled pipeline table compares:

| Condition | Timed work |
| --- | --- |
| `uncached` | Configured data latency followed by tooltip rendering |
| `prefetched` | Data preparation completes before interaction timing; rendering is timed |
| `warm-cache` | Rendering of already-available data is timed |

The controlled data latency is deterministic. It demonstrates the latency removed from
the interaction path by caching or prefetching, but it must not be described as measured
MyGene.info or MyChem.info service latency.

## Fixtures

The repository includes representative TP53, BRCA1, and aspirin records under
`benchmark/fixtures/`. Fixture metadata identifies the provider, entity, and capture
date.

To replace these records with current provider responses:

```powershell
npm run benchmark:fixtures
```

This command requires network access and intentionally changes tracked fixture files.
Review provider changes before committing refreshed fixtures.

For publication, retain the exact fixture revision used to produce the reported table.

## Measuring an Application

`onTiming` receives structured lifecycle checkpoints without enabling console output:

```ts
import type { TooltipTimingEvent } from 'bio-tooltips/mygene';
import { GeneTooltip } from 'bio-tooltips/mygene';

const events: TooltipTimingEvent[] = [];

GeneTooltip.init({
  debugTimings: false,
  onTiming(event) {
    events.push(event);
  }
});
```

Useful checkpoint labels include `onShow`, `cache hit`, `fetch complete`, `content set`,
`visuals render complete`, and `nested tooltips attached`. Each event contains elapsed
milliseconds relative to that tooltip's `onShow` checkpoint.

Eager prefetch can be awaited before starting an experimental interaction:

```ts
GeneTooltip.clearCache();
GeneTooltip.init({ prefetch: 'all' });
await GeneTooltip.whenPrefetchReady();
```

`whenPrefetchReady()` waits for eager `all` prefetching and for the eager path selected
by `smart` on small pages. On large pages, `smart` uses viewport observation and the
promise resolves after initialization because future scroll-driven fetches cannot be
predicted.

`clearCache()` and `cacheSize()` are primarily reproducibility and diagnostic controls.
Clearing the cache in normal application use discards the latency benefit.

## Live-Service Measurements

Live MyGene.info and MyChem.info measurements should be reported separately from the
controlled benchmark. Record at minimum:

- package and fixture revision
- date and time
- browser and operating system
- CPU and memory
- network location or environment
- provider endpoint and query
- warm-up and measured trial counts
- median, IQR, and p95

Use exact identifiers for live comparisons where possible. Best-guess name search is a
different workload and should be labeled separately.

Avoid hard timing assertions in ordinary unit tests. Shared CI runners vary too much for
small millisecond budgets; deterministic tests instead verify cache hits, request
deduplication, and awaitable prefetch behavior.
