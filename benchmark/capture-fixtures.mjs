import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const fixtureDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');
const captures = [
  {
    file: 'mygene-tp53.json',
    provider: 'MyGene.info',
    entity: 'TP53',
    query: '7157',
    url: 'https://mygene.info/v3/gene/7157?fields=_id,symbol,name,summary,taxid,genomic_pos,pathway,interpro,exons,ensembl,pdb,generif,wikipedia',
    normalize: data => ({ ...data, query: 'TP53' }),
  },
  {
    file: 'mygene-brca1.json',
    provider: 'MyGene.info',
    entity: 'BRCA1',
    query: '672',
    url: 'https://mygene.info/v3/gene/672?fields=_id,symbol,name,summary,taxid,genomic_pos,pathway,interpro,exons,ensembl,pdb,generif,wikipedia',
    normalize: data => ({ ...data, query: 'BRCA1' }),
  },
  {
    file: 'mychem-aspirin.json',
    provider: 'MyChem.info',
    entity: 'aspirin',
    query: '2244',
    url: 'https://mychem.info/v1/chem/2244?fields=_id,name,synonyms,smiles,inchi,inchikey,formula,cas,rxcui,chembl,chebi,drugbank,pubchem,unii,ndc,drugcentral,sider,aeolus',
    normalize: data => ({ ...data, query: '2244' }),
  },
];

for (const capture of captures) {
  const response = await fetch(capture.url, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`${capture.provider} returned HTTP ${response.status} for ${capture.entity}.`);
  }

  const previous = JSON.parse(await readFile(path.join(fixtureDirectory, capture.file), 'utf8'));
  const payload = {
    _benchmark: {
      provider: capture.provider,
      entity: capture.entity,
      query: capture.query,
      captured: new Date().toISOString(),
      sourceUrl: capture.url,
      previousCapture: previous._benchmark?.captured,
    },
    data: capture.normalize(await response.json()),
  };

  await writeFile(
    path.join(fixtureDirectory, capture.file),
    `${JSON.stringify(payload, null, 2)}\n`
  );
  console.log(`Updated ${capture.file}`);
}
