export type MyChemPrimitive = string | number | boolean;
export type MyChemRecordValue =
  | MyChemPrimitive
  | MyChemRecord
  | MyChemRecordValue[]
  | null
  | undefined;

export interface MyChemRecord {
  [key: string]: MyChemRecordValue;
}

export interface SourceValue<T> {
  value: T;
  source: string;
  sourcePath: string;
  url?: string;
  quality?: 'preferred' | 'alternate' | 'conflict' | 'derived';
}

export interface ResolvedField<T> {
  label: string;
  canonical: SourceValue<T>;
  alternatives: SourceValue<T>[];
  resolution: 'single' | 'agreement' | 'precision-difference' | 'conflict';
}

export interface MyChemInfoResult extends MyChemRecord {
  _id: string;
  query?: string;
  name?: string | string[];
  inchi?: string;
  inchikey?: string;
  formula?: string;
  chembl?: {
    molecule_chembl_id?: string;
    pref_name?: string;
    [key: string]: MyChemRecordValue;
  };
  chebi?: {
    id?: string;
    name?: string;
    [key: string]: MyChemRecordValue;
  };
  drugbank?: {
    id?: string;
    name?: string;
    description?: string;
    [key: string]: MyChemRecordValue;
  };
  pubchem?: {
    cid?: number | string;
    [key: string]: MyChemRecordValue;
  };
  unii?: {
    unii?: string;
    preferred_term?: string;
    [key: string]: MyChemRecordValue;
  };
}

export type MyChemScope =
  | 'name'
  | 'inchikey'
  | 'inchi'
  | 'chebi.id'
  | 'chembl.molecule_chembl_id'
  | 'drugbank.id'
  | 'pubchem.cid'
  | 'unii.unii';

export type MyChemLookupMode = 'id' | 'best-guess';
