declare module '@rdkit/rdkit' {
  interface RDKitMol {
    get_svg(): string;
    delete?: () => void;
  }

  interface RDKitModule {
    get_mol(smiles: string): RDKitMol | null;
  }

  export default function initRDKitModule(options?: Record<string, unknown>): Promise<RDKitModule>;
  export function initRDKitModule(options?: Record<string, unknown>): Promise<RDKitModule>;
}
