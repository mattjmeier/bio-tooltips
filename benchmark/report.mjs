export function summarize(values) {
  if (values.length === 0) throw new Error('At least one observation is required.');
  if (!values.every(Number.isFinite)) throw new Error('Observations must be finite numbers.');
  const sorted = [...values].sort((left, right) => left - right);
  const meanMs = sorted.reduce((sum, value) => sum + value, 0) / sorted.length;
  return {
    observations: sorted.length,
    medianMs: percentile(sorted, 0.5),
    q1Ms: percentile(sorted, 0.25),
    q3Ms: percentile(sorted, 0.75),
    p95Ms: percentile(sorted, 0.95),
    meanMs,
  };
}

export function percentile(sorted, proportion) {
  if (sorted.length === 0) throw new Error('At least one observation is required.');
  if (!Number.isFinite(proportion) || proportion < 0 || proportion > 1) throw new Error('Percentile must be between 0 and 1.');
  if (sorted.length === 1) return sorted[0];
  const position = (sorted.length - 1) * proportion;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const weight = position - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function toCsv(rows) {
  if (rows.length === 0) return '';
  const columns = [...new Set(rows.flatMap(row => Object.keys(row)))];
  const quote = value => {
    const text = value === null || typeof value === 'undefined' ? '' : String(value);
    return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  return `${columns.map(quote).join(',')}\n${rows.map(row => columns.map(column => quote(row[column])).join(',')).join('\n')}\n`;
}

