import { loadingLabel } from './scenarios.mjs';
export { loadingLabel };

// Presentation helpers shared by the docs component and its checks.
export const browserViews = {
  interaction: [
    { key: 'interactionToContent', label: 'Hover → content' },
    { key: 'interactionToVisible', label: 'Hover → visible DOM' },
    { key: 'warmCacheInteraction', label: 'Cached repeat' },
  ],
  expansion: [
    { key: 'sectionExpansion', label: 'First GeneRIF expansion' },
    { key: 'repeatSectionExpansion', label: 'Repeat expansion' },
    { key: 'sectionExpansionRequests', label: 'Expansion requests', unit: 'count' },
  ],
  payloads: [
    { key: 'initialResponseBytes', label: 'Before expansion (MB)', unit: 'MB' },
    { key: 'sectionResponseBytes', label: 'First expansion (MB)', unit: 'MB' },
    { key: 'transferredBytes', label: 'Total body (MB)', unit: 'MB' },
  ],
  startup: [
    { key: 'pageLoad', label: 'DOM loaded' },
    { key: 'readiness', label: 'Tooltips ready' },
    { key: 'prefetchCompletion', label: 'Prefetch complete' },
  ],
  requests: [
    { key: 'prefetchRequests', label: 'Prefetch POSTs', unit: 'count' },
    { key: 'interactionRequests', label: 'Hover POSTs', unit: 'count' },
    { key: 'providerRequest', label: 'Provider response' },
  ],
};

export const sourceLabel = condition => condition === 'live' ? 'Live API' : 'Fixture';
export const formatNumber = (value, digits = value < 10 ? 3 : 1) => String(Number(value.toFixed(digits)));
export function formatMetric(value, unit = 'ms') {
  if (!value) return null;
  const scale = unit === 'MB' ? 1e6 : 1;
  const format = number => formatNumber(number / scale, unit === 'MB' ? (number < 10000 ? 4 : 2) : undefined);
  return {
    median: format(value.medianMs ?? value.median),
    range: `${format(value.q1Ms ?? value.q1)}–${format(value.q3Ms ?? value.q3)}`,
  };
}

export function groupBrowserRows(runs, elements, loadingMode = 'lightweight') {
  return ['none', 'smart', 'all'].map(strategy => ({
    strategy,
    rows: runs.flatMap(run => run.summaries
      .filter(row => row.annotatedElements === elements && row.strategy === strategy && (row.loadingMode ?? 'lightweight') === loadingMode)
      .map(row => ({ ...row, condition: run.condition, source: sourceLabel(run.condition) }))),
  })).filter(group => group.rows.length);
}

export function formatDate(value) {
  return value.replace('T', ' ').replace(/\.\d+Z$/, ' UTC').replace(/Z$/, ' UTC');
}
