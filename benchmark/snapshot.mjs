const metadataKeys = ['schemaVersion', 'measurementVersion', 'packageVersion', 'gitCommit',
  'gitWorkingTreeDirty', 'inputSha256', 'startedAt', 'generatedAt', 'environment', 'settings'];
const pick = (object, keys) => Object.fromEntries(keys.filter(key => key in object).map(key => [key, object[key]]));

function finiteNumbers(value) {
  if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('Results contain non-finite numbers.');
  if (value && typeof value === 'object') Object.values(value).forEach(finiteNumbers);
}

export function createPublishedSnapshot(renderer, live, fixture) {
  for (const result of [renderer, live, fixture]) {
    if (!result || !result.packageVersion || !result.environment || !result.settings
      || !Number.isFinite(Date.parse(result.generatedAt))) throw new Error('Missing benchmark metadata.');
    finiteNumbers(result);
  }
  const browser = [live, fixture].map((run, index) => {
    const condition = index === 0 ? 'live' : 'fixture';
    if (run.schemaVersion !== 2 || run.measurementVersion !== 2 || run.condition !== condition) {
      throw new Error(`Expected current ${condition} browser measurements.`);
    }
    if (!run.summaries?.length || run.summaries.some(row => row.failedTrials !== 0
      || row.trials < 1 || row.trials !== row.attemptedTrials || row.trials !== run.settings.repetitions)) {
      throw new Error('Only complete, successful measured runs can refresh the published snapshot.');
    }
    const expected = run.settings.pageSizes.flatMap(elements => ['none', 'smart', 'all'].map(strategy => `${elements}:${strategy}`)).sort().join(',');
    const actual = run.summaries.map(row => `${row.annotatedElements}:${row.strategy}`).sort().join(',');
    if (actual !== expected) throw new Error('Browser results must contain every configured scenario exactly once.');
    for (const row of run.summaries) {
      for (const key of ['pageLoad', 'readiness', 'interactionToContent', 'interactionToVisible', 'warmCacheInteraction',
        ...(row.strategy === 'none' ? [] : ['prefetchCompletion']), ...(condition === 'live' ? ['providerRequest'] : [])]) {
        if (!row[key] || !['medianMs', 'q1Ms', 'q3Ms'].every(stat => typeof row[key][stat] === 'number' && Number.isFinite(row[key][stat]))) {
          throw new Error(`Missing or invalid timing summary: ${key}.`);
        }
      }
    }
    return { ...pick(run, metadataKeys), condition, summaries: run.summaries,
      warmupFailures: run.warmupFailures?.length ?? 0 };
  });
  if (renderer.schemaVersion !== 2 || !renderer.rendererResults?.length) throw new Error('Expected renderer-only results.');
  const scenarios = run => run.summaries.map(row => `${row.annotatedElements}:${row.strategy}`).sort().join(',');
  if (scenarios(live) !== scenarios(fixture)) throw new Error('Live and fixture scenarios must match.');
  if (new Set([renderer, live, fixture].map(run => run.packageVersion)).size !== 1
    || new Set([renderer, live, fixture].map(run => run.gitCommit)).size !== 1) {
    throw new Error('Published runs must use the same package version and Git commit.');
  }
  return { schemaVersion: 1,
    renderer: { ...pick(renderer, metadataKeys), summaries: renderer.rendererResults.map(row =>
      pick(row, ['caseId', 'label', 'operations', 'observations', 'medianMs', 'q1Ms', 'q3Ms', 'p95Ms', 'htmlBytes'])) },
    browser };
}
