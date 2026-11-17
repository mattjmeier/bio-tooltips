const metric = value => value ? `${format(value.medianMs)} (${format(value.q1Ms)}–${format(value.q3Ms)})` : '—';
const count = value => value ? `${value.median} (${value.q1}–${value.q3})` : '—';
const megabytes = value => value ? `${(value.median / 1e6).toFixed(2)} (${(value.q1 / 1e6).toFixed(2)}–${(value.q3 / 1e6).toFixed(2)})` : '—';
const format = value => value.toFixed(value < 10 ? 3 : 1);
const cell = value => String(value).replaceAll('|', '\\|').replace(/[\r\n]+/g, ' ');

export function renderLiveSection(result) {
  if (!result) return '';
  return [
    '## Live MyGene.info API (observational)', '',
    `Run: ${result.startedAt} to ${result.generatedAt}. Measurement version: ${result.measurementVersion ?? "unversioned"}. Provider: https://mygene.info/v3/query; species: human (9606); scopes: symbol. No interception or artificial request delay.`, '',
    `Environment: ${cell(result.environment.browserVersion)}; ${cell(result.environment.node)}; ${cell(result.environment.platform)}; ${cell(result.environment.cpu)}. Network: ${cell(result.settings.networkLabel)}.`, '',
    `Measured attempts per scenario: ${result.settings.repetitions}; warm-ups: ${result.settings.warmups}. Each successful trial measures five distinct hovers followed by a duplicate-identifier cache hit. Metrics show median (IQR) across successful trials; hover metrics summarize within-trial medians.`, '',
    '| Strategy | Elements | Unique IDs | Successful / attempted trials | Ready (ms) | Prefetch complete (ms) | Mouseenter → content (ms) | Mouseenter → visible DOM (ms) | Repeat cached → content (ms) | Provider POST → body complete (ms) | Response bodies (MB) | Prefetch POSTs | Hover POSTs | Failed trials |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...result.summaries.map(row => `| ${row.strategy} | ${row.annotatedElements} | ${row.uniqueIdentifiers} | ${row.trials} / ${row.attemptedTrials} | ${metric(row.readiness)} | ${metric(row.prefetchCompletion)} | ${metric(row.interactionToContent)} | ${metric(row.interactionToVisible)} | ${metric(row.warmCacheInteraction)} | ${metric(row.providerRequest)} | ${megabytes(row.transferredBytes)} | ${count(row.prefetchRequests)} | ${count(row.interactionRequests)} | ${row.failedTrials} |`),
    '',
    'Real human gene symbols and normal library POST requests are used. Browser HTTP cache is disabled and each trial has a fresh document/application cache. DNS, TLS connections and provider-side caches may be reused; this is not a guaranteed cold-connection experiment. Optional visuals/preloading and entrance/exit animations are disabled, as in the controlled run. Live and controlled records differ, so timings are not a paired estimate of network overhead.', '',
    'Provider timing is browser request start to response body completion (including network and download); it is not server processing time. Its per-trial median is summarized across successful trials. Response bodies sum encoded network body bytes across the trial, excluding headers (decimal MB); controlled fixture bytes use a different, decoded measure. Prefetch completion includes the runner’s scroll sequence and 200 ms observer debounce for large smart pages. Request columns count POST batch calls, not records. Failed trials are excluded from latency summaries and retained with request status/error details in browser-live-latest.json; failed warm-ups are recorded separately.', '',
    'These observations depend on the recorded date, host, network and provider state. They are not service guarantees. When combined with controlled results, each condition retains its own run date and environment.', '',
    ...(result.metadataLimitations ?? []).map(note => `- Metadata limitation: ${cell(note)}`),
    ...result.rawObservations.filter(row => row.error).map(row => `- Failed ${row.strategy}/${row.annotatedElements}, trial ${row.trial}: ${cell(row.error)}`),
    ...(result.warmupFailures ?? []).map(row => `- Failed warm-up ${row.strategy}/${row.annotatedElements}: ${cell(row.error)}`),
    '',
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

export function combineBrowserReports(controlledMarkdown, live, fieldSelection) {
  const controlled = controlledMarkdown || '# Browser benchmark results\n\nNo controlled browser result is saved.\n';
  return [controlled.trimEnd(), renderLiveSection(live).trimEnd(), renderFieldSelectionSection(fieldSelection).trimEnd()].filter(Boolean).join('\n\n') + '\n';
}

export function browserCsvRows(summaries) {
  return summaries.flatMap(summary => {
    const base = { ...(summary.fieldVariant ? { fieldVariant: summary.fieldVariant } : {}), strategy: summary.strategy, annotatedElements: summary.annotatedElements, uniqueIdentifiers: summary.uniqueIdentifiers, attemptedTrials: summary.attemptedTrials, failedTrials: summary.failedTrials };
    const rows = ['pageLoad', 'initialization', 'readiness', 'prefetchCompletion', 'interactionToContent', 'interactionToVisible', 'warmCacheInteraction', 'providerRequest', 'initializationRequests', 'totalRequests', 'prefetchRequests', 'distinctRecordsFetched', 'transferredBytes', 'interactionRequests', 'repeatInteractionRequests', 'cacheHits'].flatMap(metric => {
      const values = summary[metric];
      if (!values) return [];
      return [{ ...base, metric, observations: values.observations, median: values.median ?? values.medianMs, q1: values.q1 ?? values.q1Ms, q3: values.q3 ?? values.q3Ms, p95: values.p95 ?? values.p95Ms, units: metric === 'transferredBytes' ? 'bytes' : /Requests|Records|Hits/.test(metric) ? 'count' : 'ms' }];
    });
    // Retain completely failed scenarios in CSV without inventing zero latency.
    return rows.length ? rows : [{ ...base, metric: 'trial-count', observations: summary.trials, units: 'count' }];
  });
}
