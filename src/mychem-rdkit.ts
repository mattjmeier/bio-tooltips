import type { MyChemStructureRenderer } from './providers/mychem/config.js';
import { escapeAttr } from './providers/mychem/formatters.js';

interface RDKitMol {
  get_svg(): string;
  delete?: () => void;
}

interface RDKitModule {
  get_mol(smiles: string): RDKitMol | null;
}

export interface RDKitStructureRendererOptions {
  module?: RDKitModule;
  moduleOptions?: Record<string, unknown>;
  className?: string;
}

export async function createRDKitStructureRenderer(
  options: RDKitStructureRendererOptions = {}
): Promise<MyChemStructureRenderer> {
  const rdkit = options.module ?? await loadRDKitModule(options.moduleOptions);
  const className = options.className ?? 'gt-chem-structure-rdkit';

  return ({ smiles, alt }) => {
    if (!smiles) return undefined;

    const svg = renderRDKitStructureSVG(rdkit, smiles);
    if (!svg) return undefined;

    return `<div class="${escapeAttr(className)}" role="img" aria-label="${escapeAttr(alt)}">${svg}</div>`;
  };
}

export function renderRDKitStructureSVG(rdkit: RDKitModule, smiles: string): string | undefined {
  let mol: RDKitMol | null = null;

  try {
    mol = rdkit.get_mol(smiles);
    return normalizeSVG(mol?.get_svg());
  } finally {
    mol?.delete?.();
  }
}

function normalizeSVG(svg: string | undefined): string | undefined {
  return svg?.replace(/^\s*<\?xml[^>]*>\s*/i, '').trim() || undefined;
}

async function loadRDKitModule(moduleOptions: Record<string, unknown> | undefined): Promise<RDKitModule> {
  const rdkitImport = await import('@rdkit/rdkit');
  const initRDKitModule = getRDKitInitializer(rdkitImport);

  return initRDKitModule(moduleOptions);
}

function getRDKitInitializer(rdkitImport: unknown): (options?: Record<string, unknown>) => Promise<RDKitModule> {
  const candidate = rdkitImport as {
    default?: unknown;
    initRDKitModule?: unknown;
  };

  if (typeof candidate.default === 'function') {
    return candidate.default as (options?: Record<string, unknown>) => Promise<RDKitModule>;
  }

  if (typeof candidate.initRDKitModule === 'function') {
    return candidate.initRDKitModule as (options?: Record<string, unknown>) => Promise<RDKitModule>;
  }

  throw new Error('Unable to initialize @rdkit/rdkit: initRDKitModule export was not found.');
}
