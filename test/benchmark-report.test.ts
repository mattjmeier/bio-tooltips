import { describe, expect, it } from 'vitest';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { captureProvenance } from '../benchmark/provenance.mjs';
import { percentile, summarize, toCsv } from '../benchmark/report.mjs';
import { browserCsvRows, combineBrowserReports, renderLiveSection, renderFieldSelectionSection } from '../benchmark/browser-report.mjs';
import { applyFieldSelection, fieldsForVariant, fieldVariantOrder, referenceGeneFields } from '../benchmark/field-selection.mjs';
import { identifiersForPage, liveGeneSymbols } from '../benchmark/live-genes.mjs';
import { loadingConfig } from '../benchmark/scenarios.mjs';

describe('benchmark report aggregation', () => {
  it('reports interpolated median, quartiles, p95 and observation count', () => {
    expect(summarize([4, 1, 3, 2])).toEqual({
      observations: 4,
      medianMs: 2.5,
      q1Ms: 1.75,
      q3Ms: 3.25,
      p95Ms: 3.8499999999999996,
      meanMs: 2.5,
    });
  });

  it('handles a single observation and rejects invalid aggregates', () => {
    expect(percentile([7], 0.95)).toBe(7);
    expect(() => summarize([])).toThrow('At least one observation');
    expect(() => percentile([1, 2], 1.1)).toThrow('between 0 and 1');
    expect(() => percentile([1, 2], NaN)).toThrow('between 0 and 1');
    for (const value of [NaN, Infinity, -Infinity, undefined]) {
      expect(() => summarize([1, value])).toThrow('finite numbers');
    }
  });

  it('exports stable CSV headers and escapes quotes, commas and newlines', () => {
    expect(toCsv([{ scenario: 'cold, first', note: 'line "one"\ntwo' }])).toBe(
      'scenario,note\n"cold, first","line ""one""\ntwo"\n'
    );
  });
});

describe('live browser benchmark data and reporting', () => {
  it('uses real identifiers, five distinct initial hovers, and a duplicate sixth trigger', () => {
    expect(liveGeneSymbols).toHaveLength(800);
    expect(new Set(liveGeneSymbols).size).toBe(800);
    for (const size of [10, 100, 1000]) {
      const identifiers = identifiersForPage(size);
      expect(identifiers).toHaveLength(size);
      expect(new Set(identifiers).size).toBe(size * 0.8);
      expect(identifiers.slice(0, 5)).toEqual(['TP53', 'BRCA1', 'EGFR', 'MYC', 'MAPK1']);
      expect(identifiers[5]).toBe(identifiers[0]);
      expect(identifiers.every(identifier => liveGeneSymbols.includes(identifier))).toBe(true);
    }
    expect(() => identifiersForPage(2000)).toThrow('at most 800 distinct');
  });

  it('changes loading strategy while preserving the same enabled, collapsed GeneRIF display', () => {
    const lazy = loadingConfig('lazy'); const eager = loadingConfig('eager');
    expect(lazy.display).toEqual(eager.display);
    expect(lazy.display.generifs).toBe('collapsed');
    expect(lazy.sectionLoading).toBe('lazy');
    expect(eager.sectionLoading).toBe('eager');
    expect(loadingConfig('lightweight').display.generifs).toBe(false);
    expect(() => loadingConfig('unknown')).toThrow();
  });

  it('combines live and fixture rows with source labels and retains failures without zero latencies', () => {
    const live = {
      measurementVersion: 2, condition: 'live',
      startedAt: '2026-11-16T12:00:00Z', generatedAt: '2026-11-16T12:01:00Z',
      environment: { browserVersion: 'Chromium', node: 'v24', platform: 'linux', cpu: 'test' },
      settings: { repetitions: 2, warmups: 1, networkLabel: 'test|network\nlocation unspecified' },
      summaries: [{ strategy: 'none', annotatedElements: 10, uniqueIdentifiers: 8, trials: 0, attemptedTrials: 2, failedTrials: 2 }],
      rawObservations: [{ strategy: 'none', annotatedElements: 10, trial: 1, error: 'HTTP 503' }],
      warmupFailures: [{ strategy: 'none', annotatedElements: 10, error: 'Network failure' }],
    };
    const section = renderLiveSection(live);
    expect(section).toContain('| Live API | Lightweight | none | 10 | 8 | 0 / 2 | — |');
    expect(section).toContain('HTTP 503');
    expect(section).toContain('Failed warm-up');
    expect(section).toContain('test\\|network location unspecified');
    expect(section).toContain('no interception or artificial request delay');
    const fixture = { ...live, condition: 'fixture', startedAt: 'fixture-start',
      environment: { ...live.environment, cpu: 'fixture CPU' } };
    const combined = combineBrowserReports(fixture, live);
    expect(combined).toContain('| Live API | Lightweight | none |');
    expect(combined).toContain('| Fixture | Lightweight | none |');
    expect(combined.match(/\| Source \| Section loading \| Strategy \| Elements \| Unique IDs/g)).toHaveLength(1);
    expect(browserCsvRows([{ ...live.summaries[0], source: 'live' }])[0]).toMatchObject({ source: 'live' });
    expect(combined).toContain('fixture-start');
    expect(combined).toContain('fixture CPU');
    expect(combined).toContain('not a paired estimate of network overhead');
    expect(combineBrowserReports(null, live)).toContain('| Live API | Lightweight | none |');
    expect(combineBrowserReports(fixture, null)).toContain('| Fixture | Lightweight | none |');
    expect(combineBrowserReports(null, null)).toContain('No current live API or fixture');
    expect(combineBrowserReports({ ...fixture, measurementVersion: 1 }, null)).not.toContain('| Fixture |');
    expect(combineBrowserReports({ ...fixture, condition: 'controlled' }, null)).not.toContain('| Fixture |');
    expect(renderLiveSection(null)).toBe('');
    expect(browserCsvRows(live.summaries)).toEqual([{
      strategy: 'none', annotatedElements: 10, uniqueIdentifiers: 8,
      attemptedTrials: 2, failedTrials: 2, metric: 'trial-count', observations: 0, units: 'count',
    }]);
  });

  it('trims trailing decimal zeros while preserving fractional timings, counts and small payloads', () => {
    const timing = { medianMs: 1.8, q1Ms: 0.875, q3Ms: 2 };
    const result = {
      condition: 'live', startedAt: 'start', generatedAt: 'end',
      settings: { repetitions: 2, warmups: 0 },
      environment: { browserVersion: 'browser', node: 'node', platform: 'linux', cpu: 'CPU' },
      rawObservations: [],
      summaries: [{ strategy: 'none', annotatedElements: 10, uniqueIdentifiers: 8,
        trials: 2, attemptedTrials: 2, failedTrials: 0,
        pageLoad: { medianMs: 22, q1Ms: 20, q3Ms: 24 },
        readiness: { medianMs: 18, q1Ms: 17, q3Ms: 19 },
        interactionToContent: timing, prefetchCompletion: { medianMs: 100, q1Ms: 99.5, q3Ms: 101 },
        prefetchRequests: { median: 1, q1: 0.30000000000000004, q3: 2 },
        transferredBytes: { median: 3000, q1: 0, q3: 1000000 } }],
    };
    for (const report of [renderLiveSection(result), renderFieldSelectionSection(result)]) {
      expect(report).toContain('1.8 (0.875–2)');
      expect(report).toContain('100 (99.5–101)');
      expect(report).toContain('1 (0.3–2)');
      expect(report).toContain('0.003 (0–1)');
      expect(report).not.toContain('1.800');
      expect(report).not.toContain('0.30000000000000004');
    }
    const browserReport = renderLiveSection(result);
    expect(browserReport).toContain('| DOM loaded (ms) | Tooltips ready (ms) |');
    expect(browserReport).toContain('| 22 (20–24) | 18 (17–19) |');
    expect(browserReport).toContain('not browser paint');
    // Presentation rounding must not change the raw CSV measurements.
    expect(browserCsvRows(result.summaries).find(row => row.metric === 'prefetchRequests')?.q1)
      .toBe(0.30000000000000004);
  });

  it('places matching live/fixture scenarios together and preserves small response sizes', () => {
    const run = {
      measurementVersion: 2, condition: 'live', startedAt: 'start', generatedAt: 'end',
      settings: { repetitions: 1, warmups: 0 },
      environment: { browserVersion: 'browser', node: 'node', platform: 'linux', cpu: 'CPU' },
      rawObservations: [],
      summaries: [10, 100].map(annotatedElements => ({ strategy: 'none', annotatedElements,
        uniqueIdentifiers: annotatedElements * 0.8, trials: 1, attemptedTrials: 1, failedTrials: 0,
        transferredBytes: { median: 3000, q1: 3000, q3: 3000 } })),
    };
    const report = combineBrowserReports({ ...run, condition: 'fixture' }, run);
    const rows = report.split('\n').filter(line => /^\| (Live API|Fixture) \|/.test(line));
    expect(rows.map(row => row.split(' | ').slice(0, 4).join(' | '))).toEqual([
      '| Live API | Lightweight | none | 10', '| Fixture | Lightweight | none | 10',
      '| Live API | Lightweight | none | 100', '| Fixture | Lightweight | none | 100',
    ]);
    expect(report).toContain('0.003 (0.003–0.003)');
  });
});


describe('live field selection benchmark', () => {
  it('removes only generif and preserves every other POST parameter', () => {
    const original = new URLSearchParams({ q: 'TP53,BRCA1', species: '9606', scopes: 'symbol', fields: 'summary', extra: 'a+b & c' });
    const full = new URLSearchParams(applyFieldSelection(original.toString(), 'reference'));
    const limited = new URLSearchParams(applyFieldSelection(original.toString(), 'without-generif'));
    expect(full.get('fields')!.split(',')).toEqual(referenceGeneFields);
    expect(limited.get('fields')!.split(',')).toEqual(referenceGeneFields.filter(field => field !== 'generif'));
    full.delete('fields'); limited.delete('fields'); original.delete('fields');
    expect([...full]).toEqual([...original]); expect([...limited]).toEqual([...original]);
    expect(fieldsForVariant('reference')).toContain('exons');
    expect(() => fieldsForVariant('unknown')).toThrow('Unknown field');
  });

  it('alternates matched variant order without changing the field definitions', () => {
    expect(fieldVariantOrder(0)).toEqual(['reference', 'without-generif']);
    expect(fieldVariantOrder(1)).toEqual(['without-generif', 'reference']);
    expect(fieldVariantOrder(2)).toEqual(fieldVariantOrder(0));
    const fields = fieldsForVariant('reference'); fields.pop();
    expect(fieldsForVariant('reference')).toEqual(referenceGeneFields);
  });

  it('keeps the field-selection table separate and preserves variant identity in CSV and failures', () => {
    const result = {
      startedAt: 'start', generatedAt: 'end',
      settings: { repetitions: 2, warmups: 1, networkLabel: 'network' },
      environment: { browserVersion: 'Chromium', node: 'node', platform: 'linux', cpu: 'CPU' },
      summaries: [{ fieldVariant: 'without-generif', strategy: 'all', annotatedElements: 100,
        uniqueIdentifiers: 80, trials: 0, attemptedTrials: 2, failedTrials: 2 }],
      rawObservations: [{ fieldVariant: 'without-generif', strategy: 'all', annotatedElements: 100, trial: 2, error: 'HTTP 503' }],
      warmupFailures: [{ fieldVariant: 'reference', strategy: 'none', annotatedElements: 10, error: 'offline' }],
    };
    expect(renderFieldSelectionSection(null)).toBe('');
    const section = renderFieldSelectionSection(result);
    expect(section).toContain('| without-generif | all | 100 | 80 | 0 / 2 | — |');
    expect(section).toContain('Failed without-generif/all/100, trial 2: HTTP 503');
    expect(section).toContain('Failed warm-up reference/none/10: offline');
    expect(section).toContain('benchmark overrides only');
    const combined = combineBrowserReports(null, { ...result, condition: 'live', measurementVersion: 2 }, result);
    expect(combined.indexOf('## Browser prefetch')).toBeLessThan(combined.indexOf('## Live field selection'));
    expect(combined).toContain('| Live API | Lightweight | all |');
    expect(browserCsvRows(result.summaries)[0]).toMatchObject({ fieldVariant: 'without-generif', metric: 'trial-count', observations: 0 });
    const success = { ...result.summaries[0], trials: 1, transferredBytes: { observations: 1, median: 100, q1: 100, q3: 100, p95: 100 } };
    expect(browserCsvRows([success])[0]).toMatchObject({ fieldVariant: 'without-generif', metric: 'transferredBytes', median: 100, units: 'bytes' });
  });
});


describe('benchmark provenance', () => {
  it('identifies exact input contents even without a Git checkout', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'bio-benchmark-provenance-'));
    try {
      await writeFile(path.join(root, 'input.json'), 'abc');
      const first = await captureProvenance(root, ['input.json']);
      expect(first.gitCommit).toBeNull();
      expect(first.gitWorkingTreeDirty).toBeNull();
      expect(first.inputSha256['input.json']).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
      await writeFile(path.join(root, 'input.json'), 'different');
      const second = await captureProvenance(root, ['input.json']);
      expect(second.inputSha256['input.json']).not.toBe(first.inputSha256['input.json']);
    } finally { await rm(root, { recursive: true, force: true }); }
  });
});
