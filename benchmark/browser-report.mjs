const metric = value => value ? `${format(value.medianMs)} (${format(value.q1Ms)}–${format(value.q3Ms)})` : '—';
const count = value => value ? `${format(value.median)} (${format(value.q1)}–${format(value.q3)})` : '—';
const mb = value => String(Number((value / 1e6).toFixed(value < 10000 ? 4 : 2)));
const megabytes = value => value ? `${mb(value.median)} (${mb(value.q1)}–${mb(value.q3)})` : '—';
const format = value => String(Number(value.toFixed(value < 10 ? 3 : 1)));
const cell = value => String(value).replaceAll('|', '\\|').replace(/[\r\n]+/g, ' ');

export function renderLiveSection(result) {
  return renderBrowserSection(result ? [result] : []);
}

function renderBrowserSection(results) {
  if (!results.length) return '';
  const source = result => result.condition === 'fixture' ? 'Fixture' : 'Live API';
  const rows = results.flatMap(result => result.summaries.map(row => ({ result, row })))
    .sort((left, right) => left.row.annotatedElements - right.row.annotatedElements
      || ['none', 'smart', 'all'].indexOf(left.row.strategy) - ['none', 'smart', 'all'].indexOf(right.row.strategy));
  return [
    '## Browser prefetch: live API and fixtures', '',
    'Metrics show median (IQR) across successful trials. Hover metrics summarize within-trial medians across five distinct identifiers, followed by a duplicate-identifier cache hit. Source labels identify each independently recorded run.', '',
    '| Source | Strategy | Elements | Unique IDs | Successful / attempted trials | DOM loaded (ms) | Tooltips ready (ms) | Prefetch complete (ms) | Mouseenter → content (ms) | Mouseenter → visible DOM (ms) | Repeat cached → content (ms) | Provider POST → body complete (ms) | Response bodies (MB) | Prefetch POSTs | Hover POSTs | Failed trials |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...rows.map(({ result, row }) => `| ${source(result)} | ${row.strategy} | ${row.annotatedElements} | ${row.uniqueIdentifiers} | ${row.trials} / ${row.attemptedTrials} | ${metric(row.pageLoad)} | ${metric(row.readiness)} | ${metric(row.prefetchCompletion)} | ${metric(row.interactionToContent)} | ${metric(row.interactionToVisible)} | ${metric(row.warmCacheInteraction)} | ${metric(row.providerRequest)} | ${megabytes(row.transferredBytes)} | ${count(row.prefetchRequests)} | ${count(row.interactionRequests)} | ${row.failedTrials} |`),
    '',
    ...results.flatMap(result => [
      `### ${source(result)} run`, '',
      `Run: ${result.startedAt} to ${result.generatedAt}. Measurement version: ${result.measurementVersion ?? 'unversioned'}. Measured attempts per scenario: ${result.settings.repetitions}; warm-ups: ${result.settings.warmups}.`, '',
      `Environment: ${cell(result.environment.browserVersion)}; ${cell(result.environment.node)}; ${cell(result.environment.platform)}; ${cell(result.environment.cpu)}. Network: ${cell(result.settings.networkLabel ?? 'Local fixture interception')}.`, '',
      ...(result.metadataLimitations ?? []).map(note => `- Metadata limitation: ${cell(note)}`),
      ...result.rawObservations.filter(row => row.error).map(row => `- Failed ${row.strategy}/${row.annotatedElements}, trial ${row.trial}: ${cell(row.error)}`),
      ...(result.warmupFailures ?? []).map(row => `- Failed warm-up ${row.strategy}/${row.annotatedElements}: ${cell(row.error)}`),
      '',
    ]),
    'Live API rows use real human gene symbols and normal MyGene.info POST requests, with no interception or artificial request delay. Fixture rows use the same symbols and page workload, fulfilling intercepted requests immediately from the curated TP53 record. Fixture payloads are relabeled copies, not the corresponding live records, and ignore requested field selection. Differences include payload content, size, parsing and rendering as well as network traffic; they are not a paired estimate of network overhead.', '',
    'DOM loaded is navigation start to DOMContentLoaded. Tooltips ready is navigation start to the end of tooltip initialization, excluding background prefetch. These are DOM/application milestones, not browser paint or complete visual rendering times.', '',
    'Each trial starts with a fresh document/application cache and disabled browser HTTP cache. Connections and provider caches may be reused. Optional visuals, preloading and animations are disabled. Prefetch completion includes scrolling and the 200 ms observer debounce for large smart pages. Hover timing starts at the actual mouseenter event; visible DOM timing is not paint or animation completion. Request columns count POST batch calls, not records.', '',
    'Provider timing is live browser request start to response body completion, including network/download, not server processing time. Its within-trial median is summarized across successful trials. Live response bodies sum encoded network bytes excluding headers; fixture bodies count decoded JSON bytes (decimal MB for both), so byte columns are not directly equivalent. Failed trials are excluded from latency summaries and retained in each source JSON; failed warm-ups are recorded separately.', '',
    'Runs retain their own dates and environments. Live observations depend on host, network and provider state and are not service guarantees. Compare matching measurement versions and settings.', '',
  ].join('\n');
}

export function renderFieldSelectionSection(result) {
  if (!result) return '';
  return [
    '## Live field selection: reference versus no GeneRIFs', '',
    `Run: ${result.startedAt} to ${result.generatedAt}. Measurement version: ${result.measurementVersion ?? "unversioned"}. Network: ${cell(result.settings.networkLabel)}.`, '',
    `Environment: ${cell(result.environment.browserVersion)}; ${cell(result.environment.node)}; ${cell(result.environment.platform)}; ${cell(result.environment.cpu)}.`, '',
    `Measured attempts per variant/scenario: ${result.settings.repetitions}; warm-ups: ${result.settings.warmups}. Variants alternate order within each matched scenario/trial. Each trial uses a fresh document/application cache and the same five distinct hovers plus a duplicate cache hit.`, '',
    '| Fields | Strategy | Elements | Unique IDs | Successful / attempted | Prefetch complete (ms) | Mouseenter → content (ms) | Mouseenter → visible DOM (ms) | Provider POST → body complete (ms) | Response bodies (MB) | Prefetch POSTs | Hover POSTs | Failed trials |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...result.summaries.map(row => `| ${cell(row.fieldVariant)} | ${row.strategy} | ${row.annotatedElements} | ${row.uniqueIdentifiers} | ${row.trials} / ${row.attemptedTrials} | ${metric(row.prefetchCompletion)} | ${metric(row.interactionToContent)} | ${metric(row.interactionToVisible)} | ${metric(row.providerRequest)} | ${megabytes(row.transferredBytes)} | ${count(row.prefetchRequests)} | ${count(row.interactionRequests)} | ${row.failedTrials} |`),
    '',
    'This is an opt-in live field comparison, not a fixture simulation. The benchmark overrides only the outgoing POST fields parameter: reference is the fixed reference field list (not fields=all); without-generif removes only generif. The exact lists are saved in JSON settings.fieldsByVariant. All other request parameters, display settings, page sizes and prefetch strategies are unchanged. GeneRIF display is disabled in both variants. This isolates network/JSON costs of that field; it does not validate automatic section-aware selection or lazy expansion.', '',
    'Metrics show median (IQR) across successful trials. Hover and provider timings first take a within-trial median. Response bodies sum encoded network bytes excluding headers (decimal MB); these are not decoded JSON sizes. No artificial delay or response replacement is used. HTTP cache is disabled; connections and provider caches may be reused. Alternating order reduces drift but is not randomization. Payload size and latency vary by gene and provider state.', '',
    'Failures are excluded from latency summaries and retained in browser-fields-latest.json with variant/trial and effective outgoing field lists. Reports from other modes retain their own run dates and environments.', '',
    ...(result.metadataLimitations ?? []).map(note => `- Metadata limitation: ${cell(note)}`),
    ...result.rawObservations.filter(row => row.error).map(row => `- Failed ${cell(row.fieldVariant)}/${row.strategy}/${row.annotatedElements}, trial ${row.trial}: ${cell(row.error)}`),
    ...(result.warmupFailures ?? []).map(row => `- Failed warm-up ${cell(row.fieldVariant)}/${row.strategy}/${row.annotatedElements}: ${cell(row.error)}`),
    '',
  ].join('\n');
}

export function combineBrowserReports(fixture, live, fieldSelection) {
  // Never fold old delay-based measurements into the fixture/live comparison.
  const results = [live, fixture].filter(result => result?.measurementVersion === 2
    && ['live', 'fixture'].includes(result.condition));
  return ['# Browser benchmark results', renderBrowserSection(results)
    || 'No current live API or fixture browser result is saved.', renderFieldSelectionSection(fieldSelection)]
    .filter(Boolean).join('\n\n').trimEnd() + '\n';
}

export function browserCsvRows(summaries) {
  return summaries.flatMap(summary => {
    const base = { ...(summary.source ? { source: summary.source } : {}), ...(summary.fieldVariant ? { fieldVariant: summary.fieldVariant } : {}), strategy: summary.strategy, annotatedElements: summary.annotatedElements, uniqueIdentifiers: summary.uniqueIdentifiers, attemptedTrials: summary.attemptedTrials, failedTrials: summary.failedTrials };
    const rows = ['pageLoad', 'initialization', 'readiness', 'prefetchCompletion', 'interactionToContent', 'interactionToVisible', 'warmCacheInteraction', 'providerRequest', 'initializationRequests', 'totalRequests', 'prefetchRequests', 'distinctRecordsFetched', 'transferredBytes', 'interactionRequests', 'repeatInteractionRequests', 'cacheHits'].flatMap(metric => {
      const values = summary[metric];
      if (!values) return [];
      return [{ ...base, metric, observations: values.observations, median: values.median ?? values.medianMs, q1: values.q1 ?? values.q1Ms, q3: values.q3 ?? values.q3Ms, p95: values.p95 ?? values.p95Ms, units: metric === 'transferredBytes' ? 'bytes' : /Requests|Records|Hits/.test(metric) ? 'count' : 'ms' }];
    });
    // Retain completely failed scenarios in CSV without inventing zero latency.
    return rows.length ? rows : [{ ...base, metric: 'trial-count', observations: summary.trials, units: 'count' }];
  });
}
