# Benchmark maintenance

The public performance page renders `published/latest.json`. Refresh it with:

```bash
npm run benchmark
npm run benchmark:browser:fixtures
npm run benchmark:browser
npm run benchmark:publish-results
npm run docs:build
```

Run all three measurements at the same package version and Git commit. The exporter
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
| `BENCH_BROWSER_PAGE_SIZES` | `10,100` | Select `10`, `100`, or both. |
| `BENCH_BROWSER_LIVE_TRIALS` / `BENCH_BROWSER_TRIALS` | `30` | Live / fixture measured trials per scenario. |
| `BENCH_BROWSER_LIVE_WARMUPS` / `BENCH_BROWSER_WARMUPS` | `2` | Warm-ups per scenario. |
| `BENCH_BROWSER_LIVE_PAUSE_MS` | `250` | Pause between live trials. |
| `BENCH_BROWSER_LIVE_TIMEOUT_MS` | `15000` | Live prefetch/content timeout. |
| `BENCH_BROWSER_NETWORK_LABEL` | Unspecified | Describe the measurement network without inferring a location. |

Renderer configuration: `BENCH_SAMPLES=100` and `BENCH_OPS_PER_SAMPLE=20`.
`npm run benchmark:fixtures` refreshes the tracked curated input records; it is separate
from measuring them. `npm run benchmark:browser:live` aliases the default live command.
`npm run benchmark:browser:fields` runs the optional matched field-selection experiment;
its results are saved separately and are not included in the ordinary public snapshot.
