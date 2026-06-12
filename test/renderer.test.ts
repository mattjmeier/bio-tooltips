import { describe, it, expect, vi } from 'vitest';
import { renderTooltipHTML } from '../src/providers/mygene/renderer';
import { renderTooltipHTML as renderMyChemTooltipHTML } from '../src/providers/mychem/renderer';
import type { MyGeneInfoResult } from '../src/providers/mygene/types';
import type { MyChemInfoResult } from '../src/providers/mychem/types';

// Mock the asset imports
vi.mock('../src/assets/NLM-square-logo.svg', () => ({
  default: 'mock-ncbi-logo-svg-content',
}));
vi.mock('../src/assets/ebang-400dpi.png', () => ({
  default: 'mock-ensembl-logo.png',
}));
// vi.mock('../src/assets/Wikipedia-logo.svg', () => ({
//   default: 'mock-wiki-logo.png',
// }));
// TODO - finish adding wikipedia tests

// A complete mock object for thorough testing
const mockGeneData: MyGeneInfoResult = {
  _id: '7157',
  query: 'TP53',
  symbol: 'TP53',
  name: 'tumor protein p53',
  summary: 'This is a summary that is long enough to be truncated by the default settings.',
  taxid: 9606,
  genomic_pos: { chr: '17', start: 7661779, end: 7687538, strand: -1 },
  ensembl: { gene: 'ENSG00000141510' }
};

// Define a constant ID to make tests deterministic
const MOCK_UNIQUE_ID = 'test-id-12345';

describe('renderTooltipHTML', () => {
  it('should return "not found" message for null or undefined data', () => {
    expect(renderTooltipHTML(null)).toContain('Gene not found.');
    expect(renderTooltipHTML(undefined)).toContain('Gene not found.');
  });

  it('should render a full gene data object correctly', () => {
    const html = renderTooltipHTML(mockGeneData, { uniqueId: MOCK_UNIQUE_ID });
    expect(html).toContain('<strong>TP53</strong>');
    expect(html).toContain('(tumor protein p53)');
    expect(html).toContain('This is a summary');
  });
  
  it('should render species information when enabled', () => {
    const html = renderTooltipHTML(mockGeneData, { display: { species: true }, uniqueId: MOCK_UNIQUE_ID });
    expect(html).toContain('gene-tooltip-species');
    expect(html).toContain('🧑'); // Human icon
    expect(html).toContain('Human, <em>Homo sapiens</em>');
  });

  it('should NOT render species information when disabled', () => {
    const html = renderTooltipHTML(mockGeneData, { display: { species: false }, uniqueId: MOCK_UNIQUE_ID });
    expect(html).not.toContain('gene-tooltip-species');
  });
  
  it('should render location information when enabled', () => {
    const html = renderTooltipHTML(mockGeneData, { display: { location: true }, uniqueId: MOCK_UNIQUE_ID });
    expect(html).toContain('gene-tooltip-location');
    expect(html).toContain('<span class="gene-tooltip-location-chr">chr17</span>');
    expect(html).toContain('<span class="gene-tooltip-location-pos">7,661,779-7,687,538</span>');
  });
  
  it('should NOT render location information when disabled', () => {
    const html = renderTooltipHTML(mockGeneData, { display: { location: false }, uniqueId: MOCK_UNIQUE_ID });
    expect(html).not.toContain('gene-tooltip-location');
  });
  
  it('should include the ideogram container when ideogram is enabled', () => {
    const html = renderTooltipHTML(mockGeneData, { 
      display: { location: true, ideogram: true },
      uniqueId: MOCK_UNIQUE_ID // Pass the static ID
    });
    expect(html).toContain('gene-tooltip-ideo');
    // Assert against the static ID instead of the old, hardcoded one
    expect(html).toContain(`id="gene-tooltip-ideo-${MOCK_UNIQUE_ID}"`);
  });
  
  it('should truncate the summary by default and add the correct class and style', () => {
    const html = renderTooltipHTML(mockGeneData, { uniqueId: MOCK_UNIQUE_ID });
    expect(html).toContain('class="gene-tooltip-summary"');
    expect(html).toContain('style="--line-clamp: 4;"');
  });
  
  
  it('should truncate the summary with a custom value', () => {
    const html = renderTooltipHTML(mockGeneData, { truncate: 3, uniqueId: MOCK_UNIQUE_ID });
    expect(html).toContain('class="gene-tooltip-summary"');
    expect(html).toContain('style="--line-clamp: 3;"');
  });
  
  it('should render external links by default and hide them based on display options', () => {
    // Default: both should be visible
    let html = renderTooltipHTML(mockGeneData, { uniqueId: MOCK_UNIQUE_ID });
    expect(html).toContain('href="https://www.ncbi.nlm.nih.gov/gene/7157"');
    expect(html).toContain('src="data:image/svg+xml,mock-ncbi-logo-svg-content"');
    expect(html).toContain('href="https://www.ensembl.org/id/ENSG00000141510"');
    expect(html).toContain('src="mock-ensembl-logo.png"');

    // Disable NCBI
    html = renderTooltipHTML(mockGeneData, { display: { links: { ncbi: false } }, uniqueId: MOCK_UNIQUE_ID });
    expect(html).not.toContain('href="https://www.ncbi.nlm.nih.gov/gene/7157"');
    expect(html).toContain('href="https://www.ensembl.org/id/ENSG00000141510"');

    // Disable Ensembl
    html = renderTooltipHTML(mockGeneData, { display: { links: { ensembl: false } }, uniqueId: MOCK_UNIQUE_ID });
    expect(html).toContain('href="https://www.ncbi.nlm.nih.gov/gene/7157"');
    expect(html).not.toContain('href="https://www.ensembl.org/id/ENSG00000141510"');
    
    // Disable both
    html = renderTooltipHTML(mockGeneData, { display: { links: { ncbi: false, ensembl: false } }, uniqueId: MOCK_UNIQUE_ID });
    expect(html).not.toContain('gene-tooltip-links-container');
  });
});

describe('renderMyChemTooltipHTML', () => {
  it('renders source-aware chemical sections without duplicating agreed values', () => {
    const mockChemicalData: MyChemInfoResult = {
      _id: '1983',
      query: 'acetaminophen',
      name: ['Acetaminophen', 'Paracetamol'],
      formula: 'C8H9NO2',
      inchikey: 'RZVAJINKPMORJF-UHFFFAOYSA-N',
      pubchem: {
        cid: 1983,
        molecular_formula: 'C8H9NO2',
        molecular_weight: 151.16,
        exact_mass: 151.0633,
        isomeric_smiles: 'CC(=O)NC1=CC=C(C=C1)O',
        xlogp: 0.5,
        tpsa: 49.3,
        h_bond_donor_count: 2,
        h_bond_acceptor_count: 2,
      },
      chembl: {
        molecule_chembl_id: 'CHEMBL112',
        pref_name: 'ACETAMINOPHEN',
        molecule_type: 'Small molecule',
        molecule_properties: {
          full_molformula: 'C8H9NO2',
          full_mwt: '151.16',
          alogp: '0.49',
        },
        molecule_structures: {
          canonical_smiles: 'CC(=O)NC1=CC=C(O)C=C1',
          standard_inchi_key: 'RZVAJINKPMORJF-UHFFFAOYSA-N',
        },
      },
      chebi: {
        id: 'CHEBI:46195',
        name: 'paracetamol',
        definition: 'A member of the class of phenols.',
        role: ['analgesic', 'antipyretic'],
      },
      drugbank: {
        id: 'DB00316',
        name: 'Acetaminophen',
        description: 'A common analgesic and antipyretic drug.',
        groups: ['approved'],
        indication: 'Used for temporary relief of pain and fever.',
        mechanism_of_action: 'Inhibits prostaglandin synthesis.',
        toxicity: 'Overdose may cause liver injury.',
      },
      sider: {
        side_effect: [{ name: 'Nausea' }],
      },
    };

    const html = renderMyChemTooltipHTML(mockChemicalData, {
      uniqueId: 'mychem-test',
      display: { sourcePaths: true },
    });

    expect(html).toContain('<strong>Acetaminophen</strong>');
    expect(html).toContain('Structure & Properties');
    expect(html).toContain('C8H9NO2');
    expect(html).toContain('3 sources');
    expect(html).toContain('compare sources');
    expect(html).toContain('Pharmacology & Targets');
    expect(html).toContain('Reported side effects');
    expect(html).toContain('Identifiers & External Records');
    expect(html).toContain('https://pubchem.ncbi.nlm.nih.gov/compound/1983');
    expect(html).toContain('Data from MyChem.info');
  });
});
