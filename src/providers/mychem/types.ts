export interface MyChemInfoResult {
  _id: string;
  query?: string;
  name?: string | string[];
  inchi?: string;
  inchikey?: string;
  formula?: string;
  chembl?: {
    molecule_chembl_id?: string;
    pref_name?: string;
  };
  chebi?: {
    id?: string;
    name?: string;
  };
  drugbank?: {
    id?: string;
    name?: string;
    description?: string;
  };
  pubchem?: {
    cid?: number | string;
  };
  unii?: {
    unii?: string;
    preferred_term?: string;
  };
}

export type MyChemScope = 'name' | 'inchikey' | 'chebi' | 'chembl' | 'drugbank' | 'pubchem' | 'unii';
