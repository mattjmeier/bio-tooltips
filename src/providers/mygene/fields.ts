import { createFieldPlan } from '../../core/fields.js';
import type { GeneTooltipConfig } from './config.js';

export function getMyGeneFieldPlan(config: GeneTooltipConfig) {
  const display = config.display;
  return createFieldPlan(['_id', 'query', 'symbol', 'name', 'taxid'], [
    { key: 'summary', title: 'Summary', fields: ['summary'] },
    { key: 'location', title: 'Location', fields: ['genomic_pos'] },
    { key: 'geneTrack', title: 'Gene Model', fields: ['exons', 'genomic_pos'] },
    { key: 'pathways', title: 'Pathways', fields: [`pathway.${config.pathwaySource}`] },
    { key: 'domains', title: 'Protein Domains', fields: ['interpro'] },
    { key: 'transcripts', title: 'Transcripts', fields: ['ensembl.transcript'] },
    { key: 'structures', title: 'PDB Structures', fields: ['pdb'] },
    { key: 'generifs', title: 'GeneRIFs', fields: ['generif'] },
    { key: 'linksSection', title: 'Links', fields: [
      ...(display.links?.ensembl !== false ? ['ensembl.gene'] : []),
      ...(display.links?.wikipedia !== false ? ['wikipedia.url_stub'] : []),
    ] },
  ], display);
}
