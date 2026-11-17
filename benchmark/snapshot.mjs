import { scenarioKey } from './scenarios.mjs';
const metadataKeys = ['schemaVersion', 'measurementVersion', 'packageVersion', 'gitCommit',
  'gitWorkingTreeDirty', 'retained', 'inputSha256', 'startedAt', 'generatedAt', 'environment', 'settings'];
const pick = (object, keys) => Object.fromEntries(keys.filter(key => key in object).map(key => [key, object[key]]));

function finiteNumbers(value) {
  if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('Results contain non-finite numbers.');
  if (value && typeof value === 'object') Object.values(value).forEach(finiteNumbers);
}

export function createPublishedSnapshot(renderer, ...runs) {
  for (const result of [renderer, ...runs]) {
    if (!result || !result.packageVersion || !result.environment || !result.settings
      || !Number.isFinite(Date.parse(result.generatedAt))) throw new Error('Missing benchmark metadata.');
    finiteNumbers(result);
  }
  const browser = runs.map(run => {
    const condition = run.condition;
    if (!['live', 'fixture'].includes(condition)) throw new Error('Expected live or fixture browser measurements.');
    if (run.retained && (run.measurementVersion !== 3 || run.settings.pageSizes.some(size => size !== 1000))) throw new Error('Only measured stress results may be retained from an earlier refresh.');
    if (run.schemaVersion !== 2 || ![2, 3].includes(run.measurementVersion)) {
      throw new Error(`Expected current ${condition} browser measurements.`);
    }
    if (!run.summaries?.length || run.summaries.some(row => row.failedTrials !== 0
      || row.trials < 1 || row.trials !== row.attemptedTrials || row.trials !== run.settings.repetitions)) {
      throw new Error('Only complete, successful measured runs can refresh the published snapshot.');
    }
    const modes = run.measurementVersion === 2 ? ['lightweight'] : run.settings.sectionLoadingModes;
    if (!modes?.length || modes.some(mode => !['lightweight', 'lazy', 'eager'].includes(mode))) throw new Error('Missing or invalid loading modes.');
    const expected = run.settings.pageSizes.flatMap(annotatedElements => ['none', 'smart', 'all'].flatMap(strategy => modes.map(loadingMode => scenarioKey({ annotatedElements, strategy, loadingMode })))).sort().join(',');
    const actual = run.summaries.map(row => scenarioKey(row, run.measurementVersion)).sort().join(',');
    if (actual !== expected) throw new Error('Browser results must contain every configured scenario exactly once.');
    for (const row of run.summaries) {
      for (const key of ['pageLoad', 'readiness', 'interactionToContent', 'interactionToVisible', 'warmCacheInteraction',
        ...(row.strategy === 'none' ? [] : ['prefetchCompletion']), ...(condition === 'live' ? ['providerRequest'] : []),
        ...(run.measurementVersion === 3 && row.loadingMode !== 'lightweight' ? ['sectionExpansion', 'repeatSectionExpansion'] : [])]) {
        if (!row[key] || !['medianMs', 'q1Ms', 'q3Ms'].every(stat => typeof row[key][stat] === 'number' && Number.isFinite(row[key][stat]))) {
          throw new Error(`Missing or invalid timing summary: ${key}.`);
        }
      }
    }
    return { ...pick(run, metadataKeys), condition, summaries: run.summaries,
      warmupFailures: run.warmupFailures?.length ?? 0 };
  });
  if (renderer.schemaVersion !== 2 || !renderer.rendererResults?.length) throw new Error('Expected renderer-only results.');
  if (!browser.length) throw new Error('Browser results are required.');
  const pairs = new Map();
  const seen = new Set();
  for (const run of browser) {
    const key = `${run.packageVersion}:${run.gitCommit}:${run.measurementVersion}:${run.summaries.map(row => scenarioKey(row, run.measurementVersion)).sort().join(',')}`;
    const pair = pairs.get(key) ?? new Set();
    pair.add(run.condition); pairs.set(key, pair);
    for (const row of run.summaries) {
      const id = `${run.condition}:${scenarioKey(row, run.measurementVersion)}`;
      if (seen.has(id)) throw new Error('Published scenarios must not overlap.');
      seen.add(id);
    }
  }
  if ([...pairs.values()].some(pair => pair.size !== 2)) throw new Error('Live and fixture scenarios must match.');
  if (new Set([renderer, ...runs.filter(run => !run.retained)].map(run => run.packageVersion)).size !== 1
    || new Set([renderer, ...runs.filter(run => !run.retained)].map(run => run.gitCommit)).size !== 1) {
    throw new Error('Freshly measured runs must use the same package version and Git commit.');
  }
  return { schemaVersion: 1,
    renderer: { ...pick(renderer, metadataKeys), summaries: renderer.rendererResults.map(row =>
      pick(row, ['caseId', 'label', 'operations', 'observations', 'medianMs', 'q1Ms', 'q3Ms', 'p95Ms', 'htmlBytes'])) },
    browser };
}
