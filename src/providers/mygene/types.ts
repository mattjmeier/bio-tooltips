export interface GenomicPosition {
  chr: string;
  start: number;
  end: number;
  strand: number;
}

export interface MyGenePathway {
  name: string;
  id: string;
}

export interface MyGeneInterproDomain {
  desc: string;
  id: string;
  short_desc: string;
}

export interface GeneRIF {
  pubmed: number;
  text: string;
}

export interface MyGeneExon {
  cdsend: number;
  cdsstart: number;
  chr: string;
  strand: number;
  txend: number;
  txstart: number;
  transcript: string;
  position?: [number, number][];
  start?: number;
  end?: number;
}

export interface MyGeneInfoResult {
  _id: string;
  query: string;
  symbol: string;
  name: string;
  summary?: string;
  taxid: number;
  genomic_pos?: GenomicPosition | GenomicPosition[];
  pathway?: {
    reactome?: MyGenePathway[] | MyGenePathway;
    kegg?: MyGenePathway[] | MyGenePathway;
    wikipathways?: MyGenePathway[] | MyGenePathway;
  };
  interpro?: MyGeneInterproDomain[] | MyGeneInterproDomain;
  exons?: MyGeneExon[];
  ensembl?: {
    gene: string;
    protein?: string[] | string;
    transcript?: string[] | string;
  };
  pdb?: string[] | string;
  wikipedia?: {
    url_stub?: string;
  };
  generif?: GeneRIF[] | GeneRIF;
}
