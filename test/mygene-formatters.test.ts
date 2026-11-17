import { describe, expect, it } from 'vitest';
import {
  formatDomains, formatGeneRIFs, formatPathways, formatStructures, formatTranscripts,
} from '../src/providers/mygene/formatters';

describe('MyGene annotation formatting', () => {
  it.each([
    { source: 'reactome' as const, prefix: 'https://reactome.org/content/detail/' },
    { source: 'kegg' as const, prefix: 'https://www.genome.jp/dbget-bin/www_bget?path:' },
    { source: 'wikipathways' as const, prefix: 'https://www.wikipathways.org/pathways/' },
  ])('deduplicates $source pathways by ID and sorts the updated names without mutating input', ({ source, prefix }) => {
    const pathways = [
      { id: 'p1', name: 'Outdated name' }, { id: 'p2', name: 'Alpha' },
      { id: 'p1', name: 'Zeta' }, { id: 'p3', name: 'Alpha' },
    ];
    const original = structuredClone(pathways);
    expect(formatPathways(pathways, source)).toEqual([
      { name: 'Alpha', url: `${prefix}p2` },
      { name: 'Alpha', url: `${prefix}p3` },
      { name: 'Zeta', url: `${prefix}p1` },
    ]);
    expect(pathways).toEqual(original);
    expect(formatPathways({ id: 'p1', name: 'Single' }, source)).toEqual([{ name: 'Single', url: `${prefix}p1` }]);
    expect(formatPathways(undefined, source)).toEqual([]);
  });

  it('normalizes singleton domains and deduplicates and sorts arrays by domain ID', () => {
    const domain = { id: 'IPR1', short_desc: 'Zinc finger', desc: 'Zinc binding domain' };
    const alpha = { id: 'IPR2', short_desc: 'Alpha domain', desc: 'Alpha domain description' };
    expect(formatDomains(undefined)).toEqual([]);
    expect(formatDomains(domain)).toEqual([{ name: 'Zinc finger', url: 'https://www.ebi.ac.uk/interpro/entry/InterPro/IPR1' }]);
    expect(formatDomains([domain, alpha, { ...domain, short_desc: 'Updated zinc finger' }])).toEqual([
      { name: 'Alpha domain', url: 'https://www.ebi.ac.uk/interpro/entry/InterPro/IPR2' },
      { name: 'Updated zinc finger', url: 'https://www.ebi.ac.uk/interpro/entry/InterPro/IPR1' },
    ]);
  });

  it.each([
    { kind: 'transcripts', format: formatTranscripts, prefix: 'https://www.ensembl.org/id/' },
    { kind: 'structures', format: formatStructures, prefix: 'https://www.rcsb.org/structure/' },
  ])('normalizes absent and singleton $kind and sorts a copy of the identifiers', ({ format, prefix }) => {
    expect(format(undefined)).toEqual([]);
    expect(format('ID1')).toEqual([{ name: 'ID1', url: `${prefix}ID1` }]);
    const ids = ['ID2', 'ID1'];
    expect(format(ids)).toEqual([{ name: 'ID1', url: `${prefix}ID1` }, { name: 'ID2', url: `${prefix}ID2` }]);
    expect(ids).toEqual(['ID2', 'ID1']);
  });

  it('links GeneRIF publications while preserving the annotation order and repeated publication IDs', () => {
    const first = { text: 'Zinc finger activity', pubmed: 123 };
    const second = { text: 'Another finding from the same paper', pubmed: 123 };
    expect(formatGeneRIFs(undefined)).toEqual([]);
    expect(formatGeneRIFs(first)).toEqual([{ name: first.text, url: 'https://pubmed.ncbi.nlm.nih.gov/123' }]);
    expect(formatGeneRIFs([first, second])).toEqual([
      { name: first.text, url: 'https://pubmed.ncbi.nlm.nih.gov/123' },
      { name: second.text, url: 'https://pubmed.ncbi.nlm.nih.gov/123' },
    ]);
  });
});
