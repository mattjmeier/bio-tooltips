<script setup>
import { computed, ref } from 'vue';
import snapshot from '../../../../benchmark/published/latest.json';
import snapshotUrl from '../../../../benchmark/published/latest.json?url';
import { browserViews, formatNumber, formatDate, groupBrowserRows, sourceLabel, loadingLabel } from '../../../../benchmark/presentation.mjs';
import BenchmarkMetric from './BenchmarkMetric.vue';

defineProps({ kind: { type: String, default: 'browser' } });
const pageSizes = [10, 100, 1000];
const availableModes = [...new Set(snapshot.browser.flatMap(run => run.summaries.map(row => row.loadingMode ?? 'lightweight')))];
const sectionModes = [...(availableModes.includes('lightweight') ? ['lightweight'] : []), 'lazy', 'eager'];
const loadingMode = ref(availableModes.includes('lazy') ? 'lazy' : 'lightweight');
const elements = ref(pageSizes[0]);
const view = ref('interaction');
const columns = computed(() => browserViews[view.value]);
const groups = computed(() => groupBrowserRows(snapshot.browser, elements.value, loadingMode.value));
const uniqueIdentifiers = computed(() => Math.ceil(elements.value * 0.8));
const retainedCache = computed(() => groups.value.some(group => group.rows.some(row => row.cacheEntriesAfterPrefetch && row.strategy !== 'none' && row.cacheEntriesAfterPrefetch.median < row.uniqueIdentifiers)));
const selectedRuns = computed(() => snapshot.browser.filter(run => run.summaries.some(row => row.annotatedElements === elements.value && (row.loadingMode ?? 'lightweight') === loadingMode.value)));
const trialCounts = computed(() => [...new Set(selectedRuns.value.map(run => run.settings.repetitions))].join(' / '));
const smallSample = computed(() => selectedRuns.value.some(run => run.settings.repetitions < 10));
const views = { interaction: 'Interaction', startup: 'Page startup', requests: 'Requests', expansion: 'Section expansion', payloads: 'Payloads' };
const runTotals = run => ({ successful: run.summaries.reduce((sum, row) => sum + row.trials, 0),
  attempted: run.summaries.reduce((sum, row) => sum + row.attemptedTrials, 0) });
</script>

<template>
  <div class="performance-results">
    <template v-if="kind === 'renderer'">
      <p class="table-note">Milliseconds per render. Median with IQR beneath; p95 is shown separately.</p>
      <div class="table-scroll" tabindex="0" role="region" aria-label="HTML renderer results">
        <table>
          <caption class="visually-hidden">Stored-fixture HTML rendering</caption>
          <thead><tr><th scope="col">Tooltip</th><th scope="col">Render time</th><th scope="col">p95</th></tr></thead>
          <tbody><tr v-for="row in snapshot.renderer.summaries" :key="row.caseId">
            <th scope="row">{{ row.label }}</th><td><BenchmarkMetric :value="row" /></td><td>{{ formatNumber(row.p95Ms) }}</td>
          </tr></tbody>
        </table>
      </div>
      <details class="run-details"><summary>Renderer run details</summary>
        <p>Recorded {{ formatDate(snapshot.renderer.generatedAt) }}. {{ snapshot.renderer.settings.samples }} samples
          × {{ snapshot.renderer.settings.operationsPerSample }} operations per sample, after warm-up.</p>
        <p>Package {{ snapshot.renderer.packageVersion }} · {{ snapshot.renderer.environment.node }} · {{ snapshot.renderer.environment.platform }} · {{ snapshot.renderer.environment.cpu }}</p>
        <p>Commit <code>{{ snapshot.renderer.gitCommit?.slice(0, 12) ?? 'unavailable' }}</code><span v-if="snapshot.renderer.gitWorkingTreeDirty"> with local changes</span>.</p>
      </details>
    </template>
    <template v-else>
      <div class="controls">
        <label class="page-size">Page size
          <select v-model="elements" aria-label="Page size"><option v-for="size in pageSizes" :key="size" :value="size">{{ size.toLocaleString('en-US') }} elements / {{ Math.ceil(size * 0.8) }} IDs</option></select>
        </label>
        <label class="page-size">Section loading
          <select v-model="loadingMode" aria-label="Section loading"><option v-for="mode in sectionModes" :key="mode" :value="mode">{{ loadingLabel(mode) }}</option></select>
        </label>
        <fieldset><legend>Measurements</legend><div class="view-buttons">
          <button v-for="(label, key) in views" :key="key" type="button" :aria-pressed="view === key" @click="view = key">{{ label }}</button>
        </div></fieldset>
      </div>
      <p id="benchmark-table-note" class="table-note" aria-live="polite">
        {{ elements.toLocaleString('en-US') }} elements · {{ uniqueIdentifiers }} unique IDs. Median with IQR beneath.
        {{ view === 'requests' ? 'POSTs are batch counts; provider response is in ms.' : view === 'payloads' ? 'Response bodies in decimal MB, excluding headers.' : view === 'expansion' ? 'Expansion times in ms; requests count GETs and POSTs.' : 'All times in ms.' }}
      </p>
      <p v-if="selectedRuns.length" class="table-note">{{ trialCounts }} measured trials per scenario.<span v-if="smallSample"> Small sample: useful for exercising the workload, not stable latency conclusions.</span></p>
      <p v-if="!groups.length" class="table-note" role="status">This page size and loading mode has not been measured in the published snapshot. Run and publish the matching live and fixture benchmarks to populate it.</p>
      <p v-if="retainedCache" class="table-note">This workload exceeds the records retained in the bounded cache. Prefetched records may be evicted and fetched again during hovering.</p>
      <div v-if="groups.length" class="table-scroll" tabindex="0" role="region" aria-label="Browser benchmark results">
        <table aria-describedby="benchmark-table-note">
          <caption class="visually-hidden">{{ views[view] }} for {{ elements }} annotated elements, {{ loadingLabel(loadingMode) }}</caption>
          <thead><tr><th scope="col" class="strategy-column">Prefetch</th><th scope="col" class="source-column">Source</th>
            <th v-for="column in columns" :key="column.key" scope="col">{{ column.label }}</th>
          </tr></thead>
          <tbody v-for="group in groups" :key="group.strategy">
            <tr v-for="(row, index) in group.rows" :key="row.condition">
              <th v-if="index === 0" :rowspan="group.rows.length" scope="rowgroup" class="strategy"><code>{{ group.strategy }}</code></th>
              <th scope="row" class="source">{{ row.source }}</th>
              <td v-for="column in columns" :key="column.key"><BenchmarkMetric :value="row[column.key]" :unit="column.unit ?? 'ms'" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="view === 'startup'" class="table-note">DOM loaded and tooltips ready start at navigation. Prefetch complete starts after initialization and includes scrolling on large smart pages. These are not paint timings.</p>
      <p v-if="view === 'expansion'" class="table-note">The first expansion opens GeneRIFs on the cached-repeat tooltip. Lazy mode requests missing fields; eager mode uses the initial data. Repeat expansion should issue no request. DOM timing excludes paint.</p>
      <p v-if="view === 'payloads'" class="table-note">Before expansion includes prefetch and opening hovers. First expansion shows the data deferred until GeneRIFs is opened. Live bodies are encoded network bytes; fixture bodies are decoded JSON.</p>
      <p v-if="view === 'requests'" class="table-note">Provider response includes network and body download for live requests. Fixtures are served locally.</p>
      <details v-if="view === 'requests' && groups.length" class="run-details"><summary>Fetched IDs and cache retention</summary>
        <p>Distinct IDs fetched over the trial, compared with entries retained immediately after prefetch. A bounded cache need not retain every fetched record.</p>
        <div class="table-scroll" tabindex="0" role="region" aria-label="Fetched IDs and cache retention"><table>
          <thead><tr><th scope="col">Prefetch</th><th scope="col">Source</th><th scope="col">Fetched IDs</th><th scope="col">Retained cache</th></tr></thead>
          <tbody v-for="group in groups" :key="group.strategy"><tr v-for="(row, index) in group.rows" :key="row.condition">
            <th v-if="index === 0" :rowspan="group.rows.length" scope="rowgroup"><code>{{ group.strategy }}</code></th>
            <th scope="row">{{ row.source }}</th><td><BenchmarkMetric :value="row.distinctRecordsFetched" unit="count" /></td>
            <td><BenchmarkMetric :value="row.cacheEntriesAfterPrefetch" unit="count" /></td>
          </tr></tbody>
        </table></div>
      </details>
      <details v-if="selectedRuns.length" class="run-details"><summary>Browser run details</summary>
        <section v-for="run in selectedRuns" :key="run.condition + run.generatedAt" class="run">
          <h4>{{ sourceLabel(run.condition) }}</h4>
          <p v-if="run.retained">Latest opt-in stress measurement, retained from an earlier refresh. Its date and environment apply to these rows.</p>
          <p>{{ formatDate(run.startedAt) }} to {{ formatDate(run.generatedAt) }}.</p>
          <p>{{ run.settings.repetitions }} measured trials after {{ run.settings.warmups }} warm-ups per scenario.
            {{ runTotals(run).successful }}/{{ runTotals(run).attempted }} successful trials across this run; {{ run.warmupFailures }} failed warm-ups.</p>
          <p>Package {{ run.packageVersion }} · Chromium {{ run.environment.browserVersion }} · {{ run.environment.node }} · {{ run.environment.platform }} · {{ run.environment.cpu }}</p>
          <p>Network: {{ run.settings.networkLabel ?? 'Local fixture interception' }}. Commit <code>{{ run.gitCommit?.slice(0, 12) ?? 'unavailable' }}</code><span v-if="run.gitWorkingTreeDirty"> with local changes</span>. Measurement version {{ run.measurementVersion }}.</p>
        </section>
        <p><a :href="snapshotUrl" download="bio-tooltips-benchmark-results.json">Download the results snapshot (JSON)</a> for all summaries, settings and input hashes.</p>
      </details>
    </template>
  </div>
</template>

<style scoped>
.performance-results { margin: 1.25rem 0 2rem; }
.controls { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 1rem 1.5rem; }
.page-size, fieldset { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; }
fieldset { margin: 0; padding: 0; border: 0; min-width: 0; }
legend { margin-bottom: 0.4rem; padding: 0; }
select, button { border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg-soft); padding: 0.45rem 0.65rem; color: var(--vp-c-text-1); font: inherit; }
select { min-height: 38px; }
.view-buttons { display: flex; flex-wrap: wrap; gap: 0.35rem; }
button { cursor: pointer; }
button[aria-pressed="true"] { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
button:focus-visible, select:focus-visible, .table-scroll:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
.table-note { color: var(--vp-c-text-2); font-size: 0.85rem; line-height: 1.6; }
.table-scroll { position: relative; overflow-x: auto; border: 1px solid var(--vp-c-divider); border-radius: 8px; }
.performance-results table { display: table; width: 100%; margin: 0; border-collapse: collapse; font-size: 0.9rem; }
.performance-results th, .performance-results td { border: 0; padding: 0.7rem 0.65rem; text-align: right; vertical-align: middle; }
thead th { background: var(--vp-c-bg-soft); font-size: 0.78rem; line-height: 1.4; font-weight: 600; }
tbody + tbody { border-top: 2px solid var(--vp-c-divider); }
tbody tr + tr { border-top: 1px solid var(--vp-c-divider); }
.performance-results tr { background: var(--vp-c-bg); border: 0; transition: none; }
.performance-results tr:nth-child(2n) { background: var(--vp-c-bg-soft); }
.performance-results td { font-size: inherit; }
th:first-child, .source { text-align: left; }
.strategy-column { width: 76px; }
.source-column { width: 78px; }
.strategy { background: var(--vp-c-bg-soft); vertical-align: middle; }
.source { font-size: 0.8rem; font-weight: 500; white-space: nowrap; }
.run-details { margin-top: 1rem; border-top: 1px solid var(--vp-c-divider); padding-top: 0.75rem; }
summary { cursor: pointer; font-size: 0.9rem; font-weight: 600; }
.run-details p { font-size: 0.85rem; line-height: 1.7; color: var(--vp-c-text-2); overflow-wrap: anywhere; }
.run h4 { margin: 1rem 0 0; border: 0; }
.visually-hidden { position: absolute; top: 0; left: 0; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 480px) {
  .performance-results table { font-size: 0.8rem; }
  .performance-results th, .performance-results td { padding: 0.6rem 0.25rem; }
  thead th { font-size: 0.7rem; }
  .source { font-size: 0.72rem; }
  :deep(.range) { font-size: 0.7rem; }
  .strategy-column, .source-column { width: auto; }
}
</style>
