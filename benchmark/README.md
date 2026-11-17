# Benchmark maintenance

The public performance page renders `published/latest.json`. Refresh it with:

```bash
npm run benchmark
npm run benchmark:browser:fixtures
npm run benchmark:browser
npm run benchmark:publish-results
npm run docs:build
```

Optional large runs: `npm run benchmark:browser:fixtures:stress` and
`npm run benchmark:browser:stress`. These require the dedicated `1000`-element size and default to three trials after one warm-up,
saving separate `*-stress-latest.*` files. The exporter includes the stress pair when
present and rejects missing pairs, overlapping scenarios, or mismatched loading modes.

Run all measurements at the same package version and Git commit. The exporter
checks the source modes, measurement versions, matching browser scenarios and successful
measured trials before replacing the snapshot. Raw observations remain in the ignored
`results/` directory; the public snapshot contains aggregate measurements and provenance.
Review the JSON diff before committing it. Building docs never reruns benchmarks.

`Refresh Performance Results` runs weekly and through `workflow_dispatch` on main.
It opens a new PR containing only the snapshot, after focused tests and a docs build.
A failed benchmark leaves the published data unchanged. Repository Actions settings must
allow GitHub Actions to create pull requests. PRs opened with `GITHUB_TOKEN` do not
trigger other workflows automatically, so the refresh job performs its own validation;
repositories requiring separate PR checks can use a GitHub App token instead. Merging
an approved update triggers the existing main-branch docs deployment.

Browser configuration:

| Variable | Default | Purpose |
| --- | --- | --- |
| `BENCH_BROWSER_PAGE_SIZES` | `10,100` | Select `10`, `100`, `1000`, or a combination. Stress commands default to `1000`. |
| `BENCH_BROWSER_LOADING_MODES` | `lazy,eager` | Compare real section loading with the same collapsed GeneRIF display. `lightweight` disables GeneRIFs. |
| `BENCH_BROWSER_LIVE_TRIALS` / `BENCH_BROWSER_TRIALS` | `30` | Live / fixture measured trials per scenario. |
| `BENCH_BROWSER_LIVE_WARMUPS` / `BENCH_BROWSER_WARMUPS` | `2` | Warm-ups per scenario. |
| `BENCH_BROWSER_LIVE_PAUSE_MS` | `250` | Pause between live trials. |
| `BENCH_BROWSER_LIVE_TIMEOUT_MS` | `30000` (stress: `120000`) | Live prefetch/content timeout. |
| `BENCH_BROWSER_NETWORK_LABEL` | Unspecified | Describe the measurement network without inferring a location. |

Renderer configuration: `BENCH_SAMPLES=100` and `BENCH_OPS_PER_SAMPLE=20`.
`npm run benchmark:fixtures` refreshes the tracked curated input records; it is separate
from measuring them. `npm run benchmark:browser:live` aliases the default live command.
`npm run benchmark:browser:fields` runs the optional matched field-selection experiment;
its results are saved separately and are not included in the ordinary public snapshot.


The routine matrix has two page sizes × three prefetch strategies × two loading modes.
Order alternates lazy/eager within each trial. Both modes enable collapsed GeneRIFs;
initial and first-expansion body bytes are separate. The fixture honors GeneRIF field
selection but retains other curated annotations regardless of requested fields.

At 800 unique identifiers, the application cache can retain only 500 entries. The runner
tracks cumulative successfully parsed query IDs and pending provider work, then samples
cache retention separately; it never increases cache capacity to make the benchmark pass.
Scrolling large smart pages can fetch duplicate entries again after eviction. Actual
hover requests remain observable, including cache misses after prefetch. Expansion on
the cached-repeat TP53 tooltip is measured after the hover phase. Query POSTs and gene
annotation GETs are both logged with phase, status, fields, response size and duration.

The added symbols in `fixtures/mygene-stress-symbols.json` were captured from a sorted
MyGene query for human records with GeneRIFs. Its metadata records the exact endpoint and
capture date. The fixed first 80 symbols preserve the small-page workload. This is an
annotation-rich workload, not a representative random sample of all human genes.

Scheduled refreshes omit stress. Manual dispatch exposes `include_stress`; enabling it
runs the paired large scenarios before snapshot validation and PR creation.

Routine refreshes retain the last published stress pair when no fresh stress run is
present. Retained rows keep their own commit, dates, package version and environment;
they are validated as a separate matched pair and explicitly labelled in run details.
