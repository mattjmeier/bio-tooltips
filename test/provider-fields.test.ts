import { describe, expect, it } from 'vitest';
import { getMyGeneFieldPlan } from '../src/providers/mygene/fields';
import { mergeConfig as geneConfig } from '../src/providers/mygene/config';
import { getMyChemFieldPlan } from '../src/providers/mychem/fields';
import { mergeConfig as chemConfig } from '../src/providers/mychem/config';

const geneSectionsOff = {
  summary: false, location: false, geneTrack: false, pathways: false, domains: false,
  transcripts: false, structures: false, generifs: false, linksSection: false,
} as const;
const chemSectionsOff = {
  identity: false, structureProperties: false, detailedProperties: false, summary: false,
  synonyms: false, classes: false, pharmacology: false, regulatory: false,
  safety: false, identifiers: false,
} as const;

describe('MyGene field selection', () => {
  it.each([
    { ensembl: false, wikipedia: true, expected: ['wikipedia.url_stub'] },
    { ensembl: true, wikipedia: false, expected: ['ensembl.gene'] },
    { ensembl: false, wikipedia: false, expected: [] },
  ])('requests only enabled external annotations: $expected', ({ ensembl, wikipedia, expected }) => {
    const config = geneConfig({ display: {
      ...geneSectionsOff, linksSection: 'collapsed', links: { ncbi: true, ensembl, wikipedia },
    } });
    const collapsed = getMyGeneFieldPlan(config);
    expect(collapsed.initial).toEqual(['_id', 'query', 'symbol', 'name', 'taxid']);
    expect(collapsed.deferred).toEqual({ links: expected });

    const expanded = getMyGeneFieldPlan({ ...config, display: { ...config.display, linksSection: 'expanded' } });
    expect(expanded.initial).toEqual([...collapsed.initial, ...expected]);
    expect(expanded.deferred).toEqual({});
  });

  it('keeps default link annotations when optional link settings are omitted', () => {
    const config = geneConfig({ display: { ...geneSectionsOff, linksSection: 'expanded' } });
    const plan = getMyGeneFieldPlan({ ...config, display: { ...config.display, links: undefined } });
    expect(plan.initial).toEqual(['_id', 'query', 'symbol', 'name', 'taxid', 'ensembl.gene', 'wikipedia.url_stub']);
  });

  it('loads linked transcript IDs for the gene model even when the Transcripts section is hidden', () => {
    const plan = getMyGeneFieldPlan(geneConfig({ display: {
      ...geneSectionsOff, geneTrack: 'expanded',
    } }));
    expect(plan.initial).toEqual([
      '_id', 'query', 'symbol', 'name', 'taxid', 'exons', 'genomic_pos', 'ensembl.transcript',
    ]);
    expect(plan.deferred).toEqual({});
  });

  it('keeps shared location data eager while deferring the gene model, and removes disabled links entirely', () => {
    const plan = getMyGeneFieldPlan(geneConfig({ display: {
      ...geneSectionsOff, location: 'expanded', geneTrack: 'collapsed',
    } }));
    expect(plan.initial).toEqual(['_id', 'query', 'symbol', 'name', 'taxid', 'genomic_pos']);
    expect(plan.deferred).toEqual({ 'gene-model': ['exons', 'genomic_pos', 'ensembl.transcript'] });
    expect(plan.initial).not.toContain('ensembl.gene');
    expect(plan.initial).not.toContain('wikipedia.url_stub');
  });
});

describe('MyChem field selection', () => {
  it('loads the full record for raw JSON even when every ordinary section is disabled', () => {
    expect(getMyChemFieldPlan(chemConfig({ display: { ...chemSectionsOff, rawJson: true } }))).toEqual({
      initial: ['all'], deferred: {},
    });
  });

  it.each([
    { identity: false, structureProperties: 'expanded' as const },
    { identity: 'expanded' as const, structureProperties: false },
  ])('omits identity badge annotations when identity=$identity and structure=$structureProperties', display => {
    const plan = getMyChemFieldPlan(chemConfig({ display: { ...chemSectionsOff, ...display } }));
    expect(plan.initial).toContain('drugbank.name');
    expect(plan.initial).not.toContain('chembl.molecule_type');
    expect(plan.initial).not.toContain('drugbank.groups');
    expect(plan.initial).not.toContain('chembl.max_phase');
    expect(plan.deferred).toEqual({});
    if (display.structureProperties) {
      expect(plan.initial).toContain('pubchem.molecular_formula');
      expect(plan.initial).toContain('pubchem.cid');
    } else {
      expect(plan.initial).not.toContain('pubchem.molecular_formula');
      expect(plan.initial).not.toContain('pubchem.cid');
    }
  });

  it('promotes collapsed annotations to initial loading when collapsing is disabled, preserving deduplication', () => {
    const config = chemConfig({ display: {
      ...chemSectionsOff, structureProperties: 'expanded', detailedProperties: 'collapsed',
      safety: 'collapsed',
    } });
    const lazy = getMyChemFieldPlan(config);
    expect(lazy.initial).toContain('drugbank.calculated_properties');
    expect(lazy.initial).not.toContain('aeolus.outcomes');
    expect(lazy.deferred['detailed-properties']).toContain('drugbank.calculated_properties');
    expect(lazy.deferred['safety-&-reported-effects']).toContain('aeolus.outcomes');

    const eager = getMyChemFieldPlan({ ...config, display: { ...config.display, collapsible: false } });
    expect(eager.deferred).toEqual({});
    expect(eager.initial).toContain('pubchem.xlogp');
    expect(eager.initial).toContain('aeolus.outcomes');
    expect(eager.initial.filter(field => field === 'drugbank.calculated_properties')).toHaveLength(1);
    expect(eager.initial).not.toContain('drugbank.targets');
  });
});


describe('section loading mode', () => {
  it.each([
    { name: 'gene', config: geneConfig, plan: getMyGeneFieldPlan },
    { name: 'chemical', config: chemConfig, plan: getMyChemFieldPlan },
  ])('defaults to lazy and eagerly includes the same enabled fields for $name', ({ config, plan }) => {
    const lazyConfig = config();
    expect(lazyConfig.sectionLoading).toBe('lazy');
    const lazy = plan(lazyConfig as never);
    expect(Object.keys(lazy.deferred).length).toBeGreaterThan(0);
    const eagerConfig = config({ sectionLoading: 'eager' });
    const eager = plan(eagerConfig as never);
    expect(eager.deferred).toEqual({});
    expect(new Set(eager.initial)).toEqual(new Set([...lazy.initial, ...Object.values(lazy.deferred).flat()]));
    expect(eager.initial).toHaveLength(new Set(eager.initial).size);
    expect(eagerConfig.display).toEqual(lazyConfig.display);
    expect(eager.initial).not.toContain('all');
  });

  it('keeps disabled gene annotations omitted in eager mode, including when sections are explicitly collapsed', () => {
    const plan = getMyGeneFieldPlan(geneConfig({ sectionLoading: 'eager', display: {
      ...geneSectionsOff, pathways: 'collapsed', generifs: 'collapsed',
    }, pathwaySource: 'reactome' }));
    expect(plan.deferred).toEqual({});
    expect(plan.initial).toContain('generif');
    expect(plan.initial).toContain('pathway.reactome');
    expect(plan.initial).not.toContain('exons');
    expect(plan.initial).not.toContain('summary');
    expect(plan.initial).not.toContain('pathway.kegg');
  });

  it('keeps disabled chemical annotations omitted in eager mode and preserves raw JSON full-record loading', () => {
    const plan = getMyChemFieldPlan(chemConfig({ sectionLoading: 'eager', display: {
      ...chemSectionsOff, safety: 'collapsed',
    } }));
    expect(plan.deferred).toEqual({});
    expect(plan.initial).toContain('drugbank.toxicity');
    expect(plan.initial).not.toContain('drugbank.targets');
    expect(plan.initial).not.toContain('pubchem.xlogp');
    expect(getMyChemFieldPlan(chemConfig({ sectionLoading: 'eager', display: { rawJson: true } })))
      .toEqual({ initial: ['all'], deferred: {} });
  });
});
