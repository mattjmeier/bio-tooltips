import { describe, expect, it } from 'vitest';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { captureProvenance } from '../benchmark/provenance.mjs';
import { percentile, summarize, toCsv } from '../benchmark/report.mjs';
import { browserCsvRows, combineBrowserReports, renderLiveSection, renderFieldSelectionSection } from '../benchmark/browser-report.mjs';
import { applyFieldSelection, fieldsForVariant, fieldVariantOrder, referenceGeneFields } from '../benchmark/field-selection.mjs';
import { identifiersForPage, liveGeneSymbols } from '../benchmark/live-genes.mjs';

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
    expect(liveGeneSymbols).toHaveLength(80);
    expect(new Set(liveGeneSymbols).size).toBe(80);
    for (const size of [10, 100]) {
      const identifiers = identifiersForPage(size, true);
      expect(identifiers).toHaveLength(size);
      expect(new Set(identifiers).size).toBe(size * 0.8);
      expect(identifiers.slice(0, 5)).toEqual(['TP53', 'BRCA1', 'EGFR', 'MYC', 'MAPK1']);
      expect(identifiers[5]).toBe(identifiers[0]);
      expect(identifiers.every(identifier => liveGeneSymbols.includes(identifier))).toBe(true);
    }
    expect(() => identifiersForPage(500, true)).toThrow('at most 80 distinct');
    expect(identifiersForPage(500)).toHaveLength(500);
  });

  it('keeps controlled and live runs separate and reports failures without zero-valued latencies', () => {
    const live = {
      startedAt: '2026-11-16T12:00:00Z', generatedAt: '2026-11-16T12:01:00Z',
      environment: { browserVersion: 'Chromium', node: 'v24', platform: 'linux', cpu: 'test' },
      settings: { repetitions: 2, warmups: 1, networkLabel: 'test|network\nlocation unspecified' },
      summaries: [{ strategy: 'none', annotatedElements: 10, uniqueIdentifiers: 8, trials: 0, attemptedTrials: 2, failedTrials: 2 }],
      rawObservations: [{ strategy: 'none', annotatedElements: 10, trial: 1, error: 'HTTP 503' }],
      warmupFailures: [{ strategy: 'none', annotatedElements: 10, error: 'Network failure' }],
    };
    const section = renderLiveSection(live);
    expect(section).toContain('| none | 10 | 8 | 0 / 2 | — |');
    expect(section).toContain('HTTP 503');
    expect(section).toContain('Failed warm-up');
    expect(section).toContain('test\\|network location unspecified');
    expect(section).toContain('No interception or artificial request delay');
    const combined = combineBrowserReports('# Controlled\n\nOriginal results\n', live);
    expect(combined).toContain('Original results\n\n## Live MyGene.info');
    expect(combineBrowserReports(null, live)).toContain('No controlled browser result is saved');
    expect(renderLiveSection(null)).toBe('');
    expect(browserCsvRows(live.summaries)).toEqual([{
      strategy: 'none', annotatedElements: 10, uniqueIdentifiers: 8,
      attemptedTrials: 2, failedTrials: 2, metric: 'trial-count', observations: 0, units: 'count',
    }]);
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

  it('keeps all three report conditions separate and preserves variant identity in CSV and failures', () => {
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
    expect(combineBrowserReports('# Controlled', null, result)).toContain('# Controlled\n\n## Live field selection');
    const combined = combineBrowserReports('# Controlled', result, result);
    expect(combined.indexOf('## Live MyGene.info')).toBeLessThan(combined.indexOf('## Live field selection'));
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
