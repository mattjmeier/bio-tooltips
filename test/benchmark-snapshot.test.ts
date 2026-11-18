import { describe, expect, it } from 'vitest';
import published from '../benchmark/published/latest.json';
import { createPublishedSnapshot } from '../benchmark/snapshot.mjs';
import { browserViews, formatMetric, groupBrowserRows } from '../benchmark/presentation.mjs';

const inputs = () => [
  { ...structuredClone(published.renderer), rendererResults: structuredClone(published.renderer.summaries) },
  ...structuredClone(published.browser),
];

describe('published benchmark snapshot', () => {
  it('preserves aggregate measurements and provenance without publishing raw observations', () => {
    const [renderer, live, fixture] = inputs();
    live.rawObservations = [{ privateDiagnostic: 'local-only' }];
    const snapshot = createPublishedSnapshot(renderer, live, fixture);
    expect(snapshot.browser[0].summaries).toEqual(live.summaries);
    expect(snapshot.browser[0].inputSha256).toEqual(live.inputSha256);
    expect(snapshot.renderer.summaries).toEqual(published.renderer.summaries);
    expect(JSON.stringify(snapshot)).not.toContain('privateDiagnostic');
    expect(snapshot.browser[0]).not.toHaveProperty('rawObservations');
  });

  it('accepts a completed retry and preserves its attempted counts and session metadata', () => {
    const [renderer, live, fixture] = inputs();
    const row = live.summaries[0];
    row.failedTrials += 1;
    row.attemptedTrials += 1;
    live.retrySessions = [{ startedAt: live.startedAt, generatedAt: live.generatedAt }];
    const [saved] = createPublishedSnapshot(renderer, live, fixture).browser;
    expect(saved.retrySessions).toEqual(live.retrySessions);
    expect(saved.summaries[0].attemptedTrials).toBe(row.trials + 1);
    row.trials -= 1;
    expect(() => createPublishedSnapshot(renderer, live, fixture)).toThrow();
  });

  it('rejects failed, legacy, mismatched and invalid runs before replacing published data', () => {
    const edits = [
      (runs: any[]) => { runs[1].summaries[0].failedTrials = 1; },
      (runs: any[]) => { runs[1].summaries[0].trials = 0; },
      (runs: any[]) => { runs[1].measurementVersion = 1; },
      (runs: any[]) => { runs[1].summaries[0].readiness.medianMs = null; },
      (runs: any[]) => { runs[1].summaries.pop(); runs[2].summaries.pop(); },
      (runs: any[]) => { runs[2].condition = 'controlled'; },
      (runs: any[]) => { runs[2].summaries.pop(); },
      (runs: any[]) => { runs[0].packageVersion = '0.0.0'; },
      (runs: any[]) => { runs[2].gitCommit = 'another-commit'; },
      (runs: any[]) => { runs[1].generatedAt = 'invalid'; },
      (runs: any[]) => { runs[1].summaries[0].readiness.medianMs = NaN; },
    ];
    for (const edit of edits) {
      const runs = inputs();
      edit(runs);
      expect(() => createPublishedSnapshot(...runs)).toThrow();
    }
  });
});

describe('benchmark table presentation', () => {
  it('groups live/fixture rows by strategy and filters the page size without dropping measurements', () => {
    const sizes = [...new Set(published.browser.flatMap(run => run.settings.pageSizes))];
    for (const elements of sizes) {
      const modes = [...new Set(published.browser.flatMap(run => run.summaries.filter(row => row.annotatedElements === elements).map(row => row.loadingMode ?? 'lightweight')))];
      for (const mode of modes) {
        const groups = groupBrowserRows(published.browser, elements, mode);
        expect(groups.map(group => group.strategy)).toEqual(['none', 'smart', 'all']);
        for (const group of groups) {
          expect(group.rows.map(row => row.source)).toEqual(['Live API', 'Fixture']);
          expect(group.rows.every(row => row.annotatedElements === elements)).toBe(true);
          for (const column of Object.values(browserViews).flat()) {
            for (const row of group.rows) {
              const original = published.browser.filter(run => run.condition === row.condition).flatMap(run => run.summaries)
                .find(result => result.annotatedElements === elements && result.strategy === group.strategy && (result.loadingMode ?? 'lightweight') === mode);
              expect(row[column.key]).toEqual(original[column.key]);
            }
          }
        }
      }
    }
    expect(groupBrowserRows(published.browser, 500)).toEqual([]);
    expect(groupBrowserRows(published.browser, 1000, 'unknown')).toEqual([]);
  });

  it('formats real zeros, missing values, IQRs and small payloads distinctly', () => {
    expect(formatMetric(null)).toBeNull();
    expect(formatMetric({ medianMs: 1.8, q1Ms: 0.875, q3Ms: 2 })).toEqual({ median: '1.8', range: '0.875–2' });
    expect(formatMetric({ median: 0, q1: 0, q3: 0 }, 'count')).toEqual({ median: '0', range: '0–0' });
    expect(formatMetric({ median: 3000, q1: 2800, q3: 3200 }, 'MB')).toEqual({ median: '0.003', range: '0.0028–0.0032' });
  });
});


describe('matched loading and stress snapshots', () => {
  function currentRuns(elements = 10) {
    return inputs().slice(1, 3).map(run => ({ ...run, measurementVersion: 3,
      settings: { ...run.settings, pageSizes: [elements], sectionLoadingModes: ['lazy', 'eager'] },
      summaries: ['none', 'smart', 'all'].flatMap(strategy => ['lazy', 'eager'].map(loadingMode => {
        const source = run.summaries.find(row => row.strategy === strategy);
        return { ...source, loadingMode, annotatedElements: elements, uniqueIdentifiers: elements * 0.8,
          sectionExpansion: source.interactionToContent, repeatSectionExpansion: source.warmCacheInteraction,
          sectionExpansionRequests: { observations: source.trials, median: loadingMode === 'lazy' ? 1 : 0, q1: 0, q3: 1 },
          initialResponseBytes: source.transferredBytes, sectionResponseBytes: source.transferredBytes,
          distinctRecordsFetched: { median: elements * 0.8 }, cacheEntriesAfterPrefetch: { median: Math.min(elements * 0.8, 500) } };
      })),
    }));
  }

  it('publishes distinct fetched and retained counts for a paired 800-ID workload', () => {
    const [renderer] = inputs();
    const snapshot = createPublishedSnapshot(renderer, ...currentRuns(), ...currentRuns(1000));
    expect(snapshot.browser).toHaveLength(4);
    const groups = groupBrowserRows(snapshot.browser, 1000, 'lazy');
    expect(groups).toHaveLength(3);
    expect(groups[0].rows[0].distinctRecordsFetched.median).toBe(800);
    expect(groups[0].rows[0].cacheEntriesAfterPrefetch.median).toBe(500);
  });

  it('retains paired earlier stress observations without presenting them as a fresh routine run', () => {
    const [renderer] = inputs();
    const previous = currentRuns(1000).map(run => ({ ...run, retained: true, gitCommit: 'previous-stress-commit' }));
    const snapshot = createPublishedSnapshot(renderer, ...currentRuns(), ...previous);
    expect(snapshot.browser.filter(run => run.retained)).toHaveLength(2);
    previous[1].gitCommit = 'mismatched-commit';
    expect(() => createPublishedSnapshot(renderer, ...currentRuns(), ...previous)).toThrow('match');
    expect(() => createPublishedSnapshot(renderer, ...currentRuns().map(run => ({ ...run, retained: true })))).toThrow('stress');
  });

  it('rejects a missing loading mode, overlapping results, missing expansion data or an unpaired stress run', () => {
    const [renderer] = inputs();
    const missing = currentRuns(); missing[0].summaries.pop();
    expect(() => createPublishedSnapshot(renderer, ...missing)).toThrow();
    const expansion = currentRuns(); expansion[0].summaries[0].sectionExpansion = null;
    expect(() => createPublishedSnapshot(renderer, ...expansion)).toThrow('sectionExpansion');
    expect(() => createPublishedSnapshot(renderer, ...currentRuns(), ...currentRuns())).toThrow('overlap');
    expect(() => createPublishedSnapshot(renderer, ...currentRuns(), currentRuns(1000)[0])).toThrow('match');
  });
});
