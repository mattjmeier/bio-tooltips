import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { gzipSync } from 'node:zlib';
import { captureProvenance } from './provenance.mjs';
import { renderTooltipHTML as renderGeneTooltip } from '../dist/bio-tooltips.mygene.esm.js';
import { renderTooltipHTML as renderChemicalTooltip } from '../dist/bio-tooltips.mychem.esm.js';
import { summarize, toCsv } from './report.mjs';

const benchmarkDirectory = path.dirname(fileURLToPath(import.meta.url));
const fixtureDirectory = path.join(benchmarkDirectory, 'fixtures');
const resultsDirectory = path.join(benchmarkDirectory, 'results');

const samples = readPositiveInteger('BENCH_SAMPLES', 100);
const operationsPerSample = readPositiveInteger('BENCH_OPS_PER_SAMPLE', 20);

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

const provenance = await captureProvenance(path.join(benchmarkDirectory, '..'), [
  'package.json', 'package-lock.json', 'esbuild.config.js',
  'benchmark/run.mjs', 'benchmark/report.mjs', 'benchmark/provenance.mjs',
  ...cases.map(benchmarkCase => `benchmark/fixtures/${benchmarkCase.fixture}`),
  'dist/bio-tooltips.esm.js', 'dist/bio-tooltips.mygene.esm.js',
  'dist/bio-tooltips.mychem.esm.js', 'dist/bio-tooltips.css',
]);

const loadedCases = await Promise.all(cases.map(async benchmarkCase => {
  const fixturePath = path.join(fixtureDirectory, benchmarkCase.fixture);
  const fixture = JSON.parse(await readFile(fixturePath, 'utf8'));
  return { ...benchmarkCase, data: fixture.data, fixtureMetadata: fixture._benchmark };
}));

const rendererResults = [];
const rawObservations = [];
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
    rawObservations.push({ benchmark: 'renderer', caseId: benchmarkCase.id, trial: sample + 1, durationMs: renderDurations.at(-1), units: 'ms/operation' });
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
}

const result = {
  schemaVersion: 2,
  generatedAt: new Date().toISOString(),
  packageVersion: JSON.parse(await readFile(path.join(benchmarkDirectory, '..', 'package.json'), 'utf8')).version,
  ...provenance,
  methodology: {
    renderer: 'Stored provider record to generated tooltip HTML. Each sample is divided by the number of operations in its batch.',
    caveat: 'Stored-fixture rendering excludes network requests and browser paint. Use the browser benchmark for live API and fixture comparisons.',
  },
  settings: {
    samples,
    operationsPerSample,
  },
  environment: {
    node: process.version,
    platform: `${os.platform()} ${os.release()} ${os.arch()}`,
    cpu: os.cpus()[0]?.model ?? 'unknown',
    logicalCpus: os.cpus().length,
    totalMemoryBytes: os.totalmem(),
  },
  rendererResults,
  artifactResults,
  rawObservations,
};

await mkdir(resultsDirectory, { recursive: true });
const jsonPath = path.join(resultsDirectory, 'latest.json');
const markdownPath = path.join(resultsDirectory, 'latest.md');
const csvPath = path.join(resultsDirectory, 'latest.csv');
await writeFile(jsonPath, `${JSON.stringify(result, null, 2)}\n`);
await writeFile(markdownPath, renderMarkdown(result));
await writeFile(csvPath, toCsv([
  ...rendererResults.map(row => ({ benchmark: 'renderer', caseId: row.caseId, condition: 'stored-fixture', observations: row.observations, medianMs: row.medianMs, q1Ms: row.q1Ms, q3Ms: row.q3Ms, p95Ms: row.p95Ms, units: 'ms/operation' })),
]));

console.log(renderMarkdown(result));
console.log(`Raw results: ${jsonPath}`);
console.log(`Markdown table: ${markdownPath}`);

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
  ];
  return `${lines.join('\n')}\n`;
}

function format(value) {
  return value.toFixed(value < 10 ? 3 : 1);
}

function readPositiveInteger(name, fallback) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }
  return value;
}
