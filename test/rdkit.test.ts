import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRDKitStructureRenderer, renderRDKitStructureSVG } from '../src/mychem-rdkit';

const { exports } = vi.hoisted(() => ({ exports: { default: undefined, initRDKitModule: undefined } as Record<string, unknown> }));
vi.mock('@rdkit/rdkit', () => exports);

afterEach(() => {
  exports.default = undefined;
  exports.initRDKitModule = undefined;
  vi.restoreAllMocks();
});

describe('RDKit molecule lifetime', () => {
  it('normalizes SVG and releases the WASM molecule after rendering', () => {
    const mol = { get_svg: vi.fn(() => ' \n<?xml version="1.0"?>\n <svg>molecule</svg> '), delete: vi.fn() };
    const module = { get_mol: vi.fn(() => mol) };
    expect(renderRDKitStructureSVG(module, 'CCO')).toBe('<svg>molecule</svg>');
    expect(module.get_mol).toHaveBeenCalledWith('CCO');
    expect(mol.delete).toHaveBeenCalledTimes(1);
  });

  it('releases the molecule even when SVG rendering throws', () => {
    const error = new Error('SVG failed');
    const mol = { get_svg: () => { throw error; }, delete: vi.fn() };
    expect(() => renderRDKitStructureSVG({ get_mol: () => mol }, 'CCO')).toThrow(error);
    expect(mol.delete).toHaveBeenCalledTimes(1);
  });

  it('propagates molecule construction failures', () => {
    const error = new Error('Invalid molecule');
    expect(() => renderRDKitStructureSVG({ get_mol: () => { throw error; } }, 'bad')).toThrow(error);
  });

  it('returns no image for an invalid molecule or empty SVG', () => {
    expect(renderRDKitStructureSVG({ get_mol: () => null }, 'bad')).toBeUndefined();
    const mol = { get_svg: () => '  ', delete: vi.fn() };
    expect(renderRDKitStructureSVG({ get_mol: () => mol }, 'CCO')).toBeUndefined();
    expect(mol.delete).toHaveBeenCalledTimes(1);
  });

  it('supports injected modules without a delete method and escapes accessible markup', async () => {
    const module = { get_mol: vi.fn(() => ({ get_svg: () => '<svg/>' })) };
    const render = await createRDKitStructureRenderer({ module, className: 'custom" onclick="bad' });
    const html = render({ smiles: 'CCO', alt: 'A "quoted" <molecule>', structure: { kind: 'smiles', value: 'CCO' }, data: { _id: 'ethanol' } });
    const container = document.createElement('div');
    container.innerHTML = html!;
    const image = container.querySelector('[role="img"]')!;
    expect(image.getAttribute('class')).toBe('custom" onclick="bad');
    expect(image.hasAttribute('onclick')).toBe(false);
    expect(image.getAttribute('aria-label')).toBe('A "quoted" <molecule>');
    expect(image.querySelector('svg')).not.toBeNull();
    expect(render({ alt: 'No SMILES', structure: { kind: 'cid', value: '1' }, data: { _id: '1' } })).toBeUndefined();
    expect(module.get_mol).toHaveBeenCalledTimes(1);
  });
});

describe('RDKit optional dependency initialization', () => {
  it.each(['default', 'initRDKitModule'])('loads the %s initializer and passes WASM configuration through', async key => {
    const module = { get_mol: vi.fn(() => null) };
    const initialize = vi.fn().mockResolvedValue(module);
    exports[key] = initialize;
    const moduleOptions = { locateFile: (path: string) => `/assets/${path}` };
    const render = await createRDKitStructureRenderer({ moduleOptions });
    expect(initialize).toHaveBeenCalledExactlyOnceWith(moduleOptions);
    expect(render({ smiles: 'bad', alt: 'Invalid', structure: { kind: 'smiles', value: 'bad' }, data: { _id: 'bad' } })).toBeUndefined();
  });

  it('rejects unsupported dependency exports with an actionable error', async () => {
    exports.default = {};
    await expect(createRDKitStructureRenderer()).rejects.toThrow('initRDKitModule export was not found');
  });

  it('propagates initialization failures and permits a later retry', async () => {
    const error = new Error('WASM download failed');
    const initialize = vi.fn().mockRejectedValueOnce(error).mockResolvedValueOnce({ get_mol: () => null });
    exports.default = initialize;
    await expect(createRDKitStructureRenderer()).rejects.toBe(error);
    await expect(createRDKitStructureRenderer()).resolves.toBeTypeOf('function');
    expect(initialize).toHaveBeenCalledTimes(2);
  });
});
