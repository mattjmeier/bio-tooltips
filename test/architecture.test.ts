import { describe, expect, it } from 'vitest';
import { renderTooltipShell } from '../src/core/renderer';
import { renderCollapsibleSection } from '../src/core/sections';
import { myGeneProfile } from '../src/providers/mygene/profile';
import { myGeneSections } from '../src/providers/mygene/sections';
import { defaultConfig, mergeConfig, type MyGeneInfoResult } from '../src/config';
import { formatTranscripts } from '../src/providers/mygene';
import { renderTooltipHTML } from '../src/renderer';

const mockGeneData: MyGeneInfoResult = {
  _id: '7157',
  query: 'TP53',
  symbol: 'TP53',
  name: 'tumor protein p53',
  taxid: 9606,
};

describe('architecture compatibility', () => {
  it('core renderer wraps arbitrary content', () => {
    const html = renderTooltipShell(
      'core-test',
      renderCollapsibleSection('Mock Section', '<p>Provider content</p>', 'core-test', true, false)
    );

    expect(html).toContain('data-tooltip-id="core-test"');
    expect(html).toContain('data-section="mock-section"');
    expect(html).toContain('<p>Provider content</p>');
  });

  it('MyGene profile returns provider-keyed cache keys', () => {
    const key = myGeneProfile.provider.getCacheKey({
      query: 'TP53',
      context: { taxid: 9606 },
    });

    expect(key).toBe('mygene:TP53_9606');
  });

  it('top-level compatibility exports still work', () => {
    const config = mergeConfig({ truncateSummary: 2 });
    const transcripts = formatTranscripts(['ENST1']);
    const html = renderTooltipHTML(mockGeneData, { uniqueId: 'compat-test' });

    expect(defaultConfig.api).toBe('mygene');
    expect(config.truncateSummary).toBe(2);
    expect(transcripts[0].url).toBe('https://www.ensembl.org/id/ENST1');
    expect(html).toContain('<strong>TP53</strong>');
  });

  it('MyGene sections are registered in render order', () => {
    expect(myGeneSections.map(section => section.key)).toEqual([
      'summary',
      'location',
      'geneTrack',
      'pathways',
      'domains',
      'transcripts',
      'structures',
      'generifs',
      'linksSection',
    ]);
  });
});
