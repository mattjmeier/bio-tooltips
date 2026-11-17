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
    for (const elements of [10, 100]) {
      const groups = groupBrowserRows(published.browser, elements);
      expect(groups.map(group => group.strategy)).toEqual(['none', 'smart', 'all']);
      for (const group of groups) {
        expect(group.rows.map(row => row.source)).toEqual(['Live API', 'Fixture']);
        expect(group.rows.every(row => row.annotatedElements === elements)).toBe(true);
        for (const column of Object.values(browserViews).flat()) {
          for (const row of group.rows) {
            const original = published.browser.find(run => run.condition === row.condition).summaries
              .find(result => result.annotatedElements === elements && result.strategy === group.strategy);
            expect(row[column.key]).toEqual(original[column.key]);
          }
        }
      }
    }
    expect(groupBrowserRows(published.browser, 500)).toEqual([]);
  });

  it('formats real zeros, missing values, IQRs and small payloads distinctly', () => {
    expect(formatMetric(null)).toBeNull();
    expect(formatMetric({ medianMs: 1.8, q1Ms: 0.875, q3Ms: 2 })).toEqual({ median: '1.8', range: '0.875–2' });
    expect(formatMetric({ median: 0, q1: 0, q3: 0 }, 'count')).toEqual({ median: '0', range: '0–0' });
    expect(formatMetric({ median: 3000, q1: 2800, q3: 3200 }, 'MB')).toEqual({ median: '0.003', range: '0.0028–0.0032' });
  });
});
