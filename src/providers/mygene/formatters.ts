import type { GeneRIF, MyGeneInterproDomain, MyGenePathway } from './types.js';

// Helper to ensure data is an array
export function asArray<T>(data: T | T[] | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

// Helper to get unique items based on a key
export function getUniqueItems<T>(items: T[], key: keyof T): T[] {
  return [...new Map(items.map(item => [item[key], item])).values()];
}

export type FormattedItem = { name: string; url: string };

export function formatPathways(
  pathways: MyGenePathway[] | MyGenePathway | undefined,
  source: 'reactome' | 'kegg' | 'wikipathways'
): FormattedItem[] {
  if (!pathways) return [];
  const uniqueRaw = getUniqueItems(asArray(pathways), 'id');
  return uniqueRaw.map(p => {
    let url = '#';
    if (source === 'reactome') url = `https://reactome.org/content/detail/${p.id}`;
    if (source === 'kegg') url = `https://www.genome.jp/dbget-bin/www_bget?path:${p.id}`;
    if (source === 'wikipathways') url = `https://www.wikipathways.org/pathways/${p.id}`;
    return { name: p.name, url };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

export function formatDomains(domains: MyGeneInterproDomain[] | MyGeneInterproDomain | undefined): FormattedItem[] {
  if (!domains) return [];
  const uniqueRaw = getUniqueItems(asArray(domains), 'id');
  return uniqueRaw.map(d => ({
    name: d.short_desc,
    url: `https://www.ebi.ac.uk/interpro/entry/InterPro/${d.id}`
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export function formatTranscripts(transcripts: string[] | string | undefined): FormattedItem[] {
  return asArray(transcripts)
    .map(id => ({ name: id, url: `https://www.ensembl.org/id/${id}` }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function formatStructures(pdbs: string[] | string | undefined): FormattedItem[] {
  return asArray(pdbs)
    .map(id => ({ name: id, url: `https://www.rcsb.org/structure/${id}` }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// GeneRIFs are slightly different and require a specific formatter
export function formatGeneRIFs(generifs: GeneRIF[] | GeneRIF | undefined): FormattedItem[] {
    return asArray(generifs).map((rif: GeneRIF) => ({
        name: rif.text,
        url: `https://pubmed.ncbi.nlm.nih.gov/${rif.pubmed}`
    }));
}
