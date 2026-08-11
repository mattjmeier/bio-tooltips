import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { gzipSync } from 'node:zlib';
import { renderTooltipHTML as renderGeneTooltip } from '../dist/bio-tooltips.mygene.esm.js';
import { renderTooltipHTML as renderChemicalTooltip } from '../dist/bio-tooltips.mychem.esm.js';

const benchmarkDirectory = path.dirname(fileURLToPath(import.meta.url));
const fixtureDirectory = path.join(benchmarkDirectory, 'fixtures');
const resultsDirectory = path.join(benchmarkDirectory, 'results');

const samples = readPositiveInteger('BENCH_SAMPLES', 100);
const operationsPerSample = readPositiveInteger('BENCH_OPS_PER_SAMPLE', 20);
const pipelineTrials = readPositiveInteger('BENCH_PIPELINE_TRIALS', 25);
const controlledLatencyMs = readNonNegativeNumber('BENCH_LATENCY_MS', 50);

const cases = [
  {
    id: 'mygene-tp53',
    label: 'MyGene TP53',
    fixture: 'mygene-tp53.json',
    render: data => renderGeneTooltip(data, { uniqueId: 'benchmark-tp53' }),
  },
  {
    id: 'mygene-brca1',
    label: 'MyGene BRCA1',
    fixture: 'mygene-brca1.json',
    render: data => renderGeneTooltip(data, { uniqueId: 'benchmark-brca1' }),
  },
  {
    id: 'mychem-aspirin',
    label: 'MyChem aspirin',
    fixture: 'mychem-aspirin.json',
    render: data => renderChemicalTooltip(data, { uniqueId: 'benchmark-aspirin' }),
  },
];

const loadedCases = await Promise.all(cases.map(async benchmarkCase => {
  const fixturePath = path.join(fixtureDirectory, benchmarkCase.fixture);
  const fixture = JSON.parse(await readFile(fixturePath, 'utf8'));
  return { ...benchmarkCase, data: fixture.data, fixtureMetadata: fixture._benchmark };
}));

const rendererResults = [];
const pipelineResults = [];
const artifactResults = await Promise.all([
  ['Root ESM', 'bio-tooltips.esm.js'],
  ['MyGene ESM', 'bio-tooltips.mygene.esm.js'],
  ['MyChem ESM', 'bio-tooltips.mychem.esm.js'],
  ['Stylesheet', 'bio-tooltips.css'],
].map(async ([label, file]) => {
  const artifactPath = path.join(benchmarkDirectory, '..', 'dist', file);
  const contents = await readFile(artifactPath);
  const metadata = await stat(artifactPath);
  return {
    label,
    file,
    bytes: metadata.size,
    gzipBytes: gzipSync(contents).byteLength,
  };
}));

for (const benchmarkCase of loadedCases) {
  for (let index = 0; index < 100; index += 1) {
    benchmarkCase.render(benchmarkCase.data);
  }

  const renderDurations = [];
  let htmlBytes = 0;
  for (let sample = 0; sample < samples; sample += 1) {
    const start = performance.now();
    let html = '';
    for (let operation = 0; operation < operationsPerSample; operation += 1) {
      html = benchmarkCase.render(benchmarkCase.data);
    }
    renderDurations.push((performance.now() - start) / operationsPerSample);
    htmlBytes = Buffer.byteLength(html);
  }

  rendererResults.push({
    caseId: benchmarkCase.id,
    label: benchmarkCase.label,
    fixture: benchmarkCase.fixtureMetadata,
    htmlBytes,
    operations: samples * operationsPerSample,
    ...summarize(renderDurations),
  });

  for (const condition of ['uncached', 'prefetched', 'warm-cache']) {
    const durations = [];
    const preparationDurations = [];

    for (let trial = 0; trial < pipelineTrials; trial += 1) {
      if (condition === 'prefetched') {
        const preparationStart = performance.now();
        await delay(controlledLatencyMs);
        preparationDurations.push(performance.now() - preparationStart);
      }

      const start = performance.now();
      if (condition === 'uncached') {
        await delay(controlledLatencyMs);
      }
      benchmarkCase.render(benchmarkCase.data);
      durations.push(performance.now() - start);
    }

    pipelineResults.push({
      caseId: benchmarkCase.id,
      label: benchmarkCase.label,
      condition,
      trials: pipelineTrials,
      controlledLatencyMs,
      interaction: summarize(durations),
      preparation: preparationDurations.length > 0 ? summarize(preparationDurations) : null,
    });
  }
}

const result = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  methodology: {
    renderer: 'Stored provider record to generated tooltip HTML. Each sample is divided by the number of operations in its batch.',
    controlledPipeline: 'A deterministic data delay is included in uncached interaction time and completed before timing for prefetched interactions. Warm-cache and prefetched rows measure local render work.',
    caveat: 'The controlled pipeline isolates package behavior from internet variability; it is not a live MyGene.info or MyChem.info service measurement and does not measure browser paint.',
  },
  settings: {
    samples,
    operationsPerSample,
    pipelineTrials,
    controlledLatencyMs,
  },
  environment: {
    node: process.version,
    platform: `${os.platform()} ${os.release()} ${os.arch()}`,
    cpu: os.cpus()[0]?.model ?? 'unknown',
    logicalCpus: os.cpus().length,
    totalMemoryBytes: os.totalmem(),
  },
  rendererResults,
  pipelineResults,
  artifactResults,
};

await mkdir(resultsDirectory, { recursive: true });
const jsonPath = path.join(resultsDirectory, 'latest.json');
const markdownPath = path.join(resultsDirectory, 'latest.md');
await writeFile(jsonPath, `${JSON.stringify(result, null, 2)}\n`);
await writeFile(markdownPath, renderMarkdown(result));

console.log(renderMarkdown(result));
console.log(`Raw results: ${jsonPath}`);
console.log(`Markdown table: ${markdownPath}`);

function summarize(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const meanMs = sorted.reduce((sum, value) => sum + value, 0) / sorted.length;
  return {
    medianMs: percentile(sorted, 0.5),
    q1Ms: percentile(sorted, 0.25),
    q3Ms: percentile(sorted, 0.75),
    p95Ms: percentile(sorted, 0.95),
    meanMs,
  };
}

function percentile(sorted, proportion) {
  if (sorted.length === 1) return sorted[0];
  const position = (sorted.length - 1) * proportion;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const weight = position - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function renderMarkdown(result) {
  const lines = [
    '# Bio Tooltips benchmark results',
    '',
    `Generated: ${result.generatedAt}`,
    '',
    `Environment: ${result.environment.node}; ${result.environment.platform}; ${result.environment.cpu}`,
    '',
    '## Build artifacts',
    '',
    '| Artifact | Raw bytes | Gzip bytes |',
    '| --- | ---: | ---: |',
    ...result.artifactResults.map(row =>
      `| ${row.label} | ${row.bytes} | ${row.gzipBytes} |`
    ),
    '',
    '## Pure HTML rendering',
    '',
    '| Tooltip | Operations | Output bytes | Median (ms) | IQR (ms) | p95 (ms) |',
    '| --- | ---: | ---: | ---: | ---: | ---: |',
    ...result.rendererResults.map(row =>
      `| ${row.label} | ${row.operations} | ${row.htmlBytes} | ${format(row.medianMs)} | ${format(row.q1Ms)}–${format(row.q3Ms)} | ${format(row.p95Ms)} |`
    ),
    '',
    `## Controlled interaction pipeline (${result.settings.controlledLatencyMs} ms data latency)`,
    '',
    '| Tooltip | Condition | Trials | Interaction-to-content median (ms) | IQR (ms) | p95 (ms) |',
    '| --- | --- | ---: | ---: | ---: | ---: |',
    ...result.pipelineResults.map(row =>
      `| ${row.label} | ${row.condition} | ${row.trials} | ${format(row.interaction.medianMs)} | ${format(row.interaction.q1Ms)}–${format(row.interaction.q3Ms)} | ${format(row.interaction.p95Ms)} |`
    ),
    '',
    '> Controlled latency is included in the uncached condition and completed before interaction timing in the prefetched condition. These values do not represent live BioThings service latency or browser paint time.',
    '',
  ];
  return `${lines.join('\n')}\n`;
}

function format(value) {
  return value.toFixed(value < 10 ? 3 : 1);
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function readPositiveInteger(name, fallback) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }
  return value;
}

function readNonNegativeNumber(name, fallback) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a non-negative number.`);
  }
  return value;
}
