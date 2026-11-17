import { createFieldPlan } from '../../core/fields.js';
import type { MyChemTooltipConfig } from './config.js';

const names = ['name', 'drugbank.name', 'chembl.pref_name', 'chebi.name', 'unii.preferred_term', 'pubchem.iupac'];
const synonyms = ['synonyms', 'pubchem.synonyms', 'drugbank.synonyms', 'chebi.synonyms', 'chembl.molecule_synonyms'];
// These also preserve best-guess molecule ranking, independent of visible sections.
export const myChemLookupFields = ['_id', '_score', ...names, ...synonyms,
  'pubchem.cid', 'inchikey', 'inchi', 'smiles', 'chembl.molecule_chembl_id',
  'chebi.id', 'drugbank.id', 'unii.unii', 'ndc.productndc', 'ndc.proprietaryname',
  'ndc.nonproprietaryname', 'ndc.substancename'];
const compactProperties = [
  'formula', 'pubchem.molecular_formula', 'chembl.molecule_properties.full_molformula',
  'chebi.formulae.formula', 'chebi.formulae', 'pubchem.molecular_weight',
  'chembl.molecule_properties.full_mwt', 'chembl.molecule_properties.mw_freebase', 'chebi.mass',
  'pubchem.exact_mass', 'chebi.mon_mass', 'smiles',
  'pubchem.isomeric_smiles', 'pubchem.canonical_smiles', 'chembl.molecule_structures.canonical_smiles',
  'chebi.smiles', 'inchikey', 'pubchem.inchikey',
  'chembl.molecule_structures.standard_inchi_key', 'chebi.inchikey', 'drugbank.calculated_properties',
  'drugbank.experimental_properties',
];
const detailedProperties = [
  'pubchem.xlogp', 'chembl.molecule_properties.alogp', 'pubchem.tpsa',
  'chembl.molecule_properties.psa', 'pubchem.h_bond_donor_count', 'chembl.molecule_properties.hbd',
  'pubchem.h_bond_acceptor_count', 'chembl.molecule_properties.hba', 'pubchem.rotatable_bond_count',
  'chembl.molecule_properties.rtb', 'pubchem.charge', 'pubchem.defined_atom_stereo_count',
  'pubchem.undefined_atom_stereo_count', 'drugbank.calculated_properties', 'drugbank.experimental_properties',
];
const identifiers = [
  'pubchem.cid', 'chembl.molecule_chembl_id', 'chebi.id',
  'drugbank.id', 'unii.unii', 'drugbank.unii',
  'cas', 'drugbank.cas_number', 'rxcui',
  'unii.rxcui', 'drugcentral.rxcui', 'inchikey',
  'pubchem.inchikey', 'chembl.molecule_structures.standard_inchi_key', 'chebi.inchikey',
  'smiles', 'pubchem.isomeric_smiles', 'chembl.molecule_structures.canonical_smiles',
  'chebi.smiles',
];

export function getMyChemFieldPlan(config: MyChemTooltipConfig) {
  if (config.display.rawJson) return { initial: ['all'], deferred: {} };
  const base = ['_id', 'query', ...names];
  if (config.display.identity !== false && config.display.structureProperties !== false) {
    base.push('chembl.molecule_type', 'drugbank.groups', 'chembl.max_phase', 'pubchem.cid', 'drugbank.categories', 'chebi.role', 'inchikey', 'chembl.molecule_chembl_id', 'chebi.id', 'drugbank.id', 'unii.unii');
  }
  return createFieldPlan(base, [
    { key: 'structureProperties', title: 'Structure & Properties', fields: [...compactProperties, 'pubchem.cid', 'unii.pubchem', 'drugbank.external_identifiers.pubchem', 'inchi', 'pubchem.inchi', 'chembl.molecule_structures.standard_inchi', 'chebi.inchi'] },
    { key: 'detailedProperties', title: 'Detailed Properties', fields: detailedProperties },
    { key: 'summary', title: 'Summary', fields: ['drugbank.description', 'chebi.definition', 'pubchem.description', 'drugbank.pharmacodynamics'] },
    { key: 'synonyms', title: 'Synonyms', fields: synonyms },
    { key: 'classes', title: 'Chemical Classes', fields: ['chebi.role', 'chebi.class', 'drugbank.atc_codes', 'chembl.molecule_type', 'chembl.therapeutic_flag', 'drugcentral.drug_use.category', 'drugcentral.categories', 'drugcentral.class.name'] },
    { key: 'pharmacology', title: 'Pharmacology & Targets', fields: ['drugbank.mechanism_of_action', 'drugbank.indication', 'drugbank.targets', 'drugcentral.mechanism_of_action', 'drugcentral.indications', 'drugcentral.drug_use.indication', 'drugcentral.bioactivity', 'chembl.target.name', 'chembl.activities.standard_value'] },
    { key: 'regulatory', title: 'Regulatory / Products', fields: ['drugbank.groups', 'chembl.max_phase', 'chembl.first_approval', 'drugbank.products', 'drugcentral.approval.product', 'drugcentral.ndc.product_ndc', 'drugcentral.omop_relationship.orphan', 'drugcentral.orphan'] },
    { key: 'safety', title: 'Safety & Reported Effects', fields: ['sider.side_effect', 'drugbank.toxicity', 'aeolus.outcomes', 'aeolus.adverse_events'] },
    { key: 'identifiers', title: 'Identifiers & External Records', fields: identifiers },
  ], config.display, config.sectionLoading);
}
