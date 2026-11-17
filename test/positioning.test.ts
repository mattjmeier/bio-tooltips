import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const floating = vi.hoisted(() => ({
  arrow: vi.fn((options: unknown) => ({ name: 'arrow', options })),
  autoPlacement: vi.fn((options: unknown) => ({ name: 'autoPlacement', options })),
  autoUpdate: vi.fn((_reference: Element, _floating: HTMLElement, update: () => void) => {
    update();
    return floating.cleanup;
  }),
  cleanup: vi.fn(),
  computePosition: vi.fn().mockResolvedValue({
    x: 12,
    y: 34,
    placement: 'top',
    strategy: 'absolute',
    middlewareData: { arrow: { x: 7, y: 2 } },
  }),
  flip: vi.fn((options: unknown) => ({ name: 'flip', options })),
  offset: vi.fn((options: unknown) => ({ name: 'offset', options })),
  shift: vi.fn((options: unknown) => ({ name: 'shift', options })),
  size: vi.fn((options: unknown) => ({ name: 'size', options })),
}));

vi.mock('@floating-ui/dom', () => floating);

import { getDefaultFallbackPlacements, startPositioning } from '../src/core/positioning';

function elements() {
  const reference = document.createElement('button');
  const root = document.createElement('div');
  const box = document.createElement('div');
  const content = document.createElement('div');
  const arrow = document.createElement('div');
  root.append(box);
  box.append(content, arrow);
  document.body.append(reference, root);
  return { reference, root, box, content, arrow };
}

describe('Floating UI positioning adapter', () => {
  beforeEach(() => {
    document.body.replaceChildren();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    floating.computePosition.mockReset().mockResolvedValue({
      x: 12, y: 34, placement: 'top', strategy: 'absolute', middlewareData: { arrow: { x: 7, y: 2 } },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  it('uses fixed placement middleware and applies coordinates and arrow data', async () => {
    const nodes = elements();
    const active = startPositioning(nodes, {
      tooltip: {
        placement: 'bottom',
        fallbackPlacements: ['top', 'right', 'left'],
        offset: 10,
        viewportPadding: 8,
        strategy: 'absolute',
      },
      constrainToViewport: true,
      maxWidth: 430,
    });
    await active.update();

    expect(floating.flip).toHaveBeenCalledWith(expect.objectContaining({
      fallbackPlacements: ['top', 'right', 'left'],
      padding: 8,
    }));
    expect(floating.autoPlacement).not.toHaveBeenCalled();
    expect(nodes.root.style.left).toBe('12px');
    expect(nodes.root.style.top).toBe('34px');
    expect(nodes.box.dataset.placement).toBe('top');
    expect(nodes.arrow.style.left).toBe('7px');
    expect(nodes.arrow.style.bottom).toBe('-4px');

    active.destroy();
    active.destroy();
    expect(floating.cleanup).toHaveBeenCalledTimes(1);
  });

  it('uses automatic placement and constrains content to available size', () => {
    const nodes = elements();
    startPositioning(nodes, {
      tooltip: {
        placement: 'auto',
        allowedPlacements: ['top', 'bottom'],
        viewportPadding: 12,
      },
      constrainToViewport: true,
      maxHeight: 500,
    });

    expect(floating.autoPlacement).toHaveBeenCalledWith(expect.objectContaining({
      allowedPlacements: ['top', 'bottom'],
      padding: 12,
    }));
    expect(floating.flip).not.toHaveBeenCalled();

    const sizeOptions = floating.size.mock.calls[0][0] as {
      apply: (dimensions: { availableWidth: number; availableHeight: number }) => void;
    };
    sizeOptions.apply({ availableWidth: 320, availableHeight: 240 });
    expect(nodes.content.style.maxHeight).toBe('240px');
    expect(nodes.box.style.maxWidth).toBe('320px');
    expect(nodes.box.style.getPropertyValue('--gt-available-width')).toBe('320px');
  });

  it('uses a full-width vertical placement for top-level tooltips on narrow viewports', async () => {
    vi.stubGlobal('innerWidth', 390);
    const nodes = elements();
    const active = startPositioning(nodes, {
      tooltip: {
        placement: 'right',
        fallbackPlacements: ['left', 'bottom', 'top'],
        viewportPadding: 8,
      },
      constrainToViewport: true,
      maxWidth: 350,
      isTopLevel: true,
    });

    expect(floating.flip).toHaveBeenCalledWith(expect.objectContaining({
      fallbackPlacements: ['top'],
    }));

    const sizeOptions = floating.size.mock.calls[0][0] as {
      apply: (dimensions: { availableWidth: number; availableHeight: number }) => void;
    };
    sizeOptions.apply({ availableWidth: 374, availableHeight: 280 });
    expect(nodes.box.style.width).toBe('350px');
    expect(nodes.content.style.maxHeight).toBe('280px');

    await active.update();
    expect(floating.computePosition).toHaveBeenLastCalledWith(
      nodes.reference,
      nodes.root,
      expect.objectContaining({ placement: 'bottom' })
    );
  });

  it.each(['destroy', 'detach'])('ignores late coordinates after %s and skips subsequent computations', async action => {
    let resolve!: (result: unknown) => void;
    floating.computePosition.mockReturnValue(new Promise(done => { resolve = done; }));
    const nodes = elements();
    const active = startPositioning(nodes, { tooltip: {}, constrainToViewport: true });
    const pending = active.update();
    const sizeOptions = floating.size.mock.calls[0][0] as { apply: (dimensions: { availableWidth: number; availableHeight: number }) => void };
    const calls = floating.computePosition.mock.calls.length;
    if (action === 'destroy') active.destroy();
    else nodes.root.remove();
    resolve({ x: 999, y: 999, placement: 'left', middlewareData: { arrow: { y: 10 } } });
    await pending;
    expect(nodes.root.style.left).toBe('');
    expect(nodes.root.style.top).toBe('');
    expect(nodes.box.dataset.placement).toBeUndefined();
    await active.update();
    expect(floating.computePosition).toHaveBeenCalledTimes(calls);
    if (action === 'destroy') {
      sizeOptions.apply({ availableWidth: 1, availableHeight: 1 });
      expect(nodes.box.style.maxWidth).toBe('350px');
      expect(nodes.content.style.maxHeight).toBe('');
    }
    active.destroy();
    expect(floating.cleanup).toHaveBeenCalledTimes(1);
  });

  it.each([undefined, 180])('honors unconstrained height configuration %s and clamps negative available widths', maxHeight => {
    const nodes = elements();
    nodes.content.style.maxHeight = '99px';
    const active = startPositioning(nodes, { tooltip: {}, constrainToViewport: false, maxHeight });
    const sizeOptions = floating.size.mock.calls[0][0] as { apply: (dimensions: { availableWidth: number; availableHeight: number }) => void };
    sizeOptions.apply({ availableWidth: -10, availableHeight: -20 });
    expect(nodes.box.style.maxWidth).toBe('0px');
    expect(nodes.box.style.getPropertyValue('--gt-available-width')).toBe('0px');
    expect(nodes.box.style.getPropertyValue('--gt-available-height')).toBe('0px');
    expect(nodes.content.style.maxHeight).toBe(maxHeight ? '180px' : '');
    active.destroy();
  });

  it('caps constrained dimensions and never sets negative content height', () => {
    const nodes = elements();
    const active = startPositioning(nodes, { tooltip: {}, constrainToViewport: true, maxWidth: 400, maxHeight: 200 });
    const sizeOptions = floating.size.mock.calls[0][0] as { apply: (dimensions: { availableWidth: number; availableHeight: number }) => void };
    sizeOptions.apply({ availableWidth: 600, availableHeight: 500 });
    expect(nodes.box.style.maxWidth).toBe('400px');
    expect(nodes.content.style.maxHeight).toBe('200px');
    sizeOptions.apply({ availableWidth: 200, availableHeight: -5 });
    expect(nodes.content.style.maxHeight).toBe('0px');
    active.destroy();
  });

  it('uses the visual viewport for compact top placement but preserves side placements for nested tooltips', async () => {
    vi.stubGlobal('innerWidth', 1024);
    vi.stubGlobal('visualViewport', { width: 500 });
    const nodes = elements();
    const active = startPositioning(nodes, {
      tooltip: { placement: 'top-start', strategy: 'fixed', zIndex: 123 },
      constrainToViewport: true, isTopLevel: true,
    });
    await active.update();
    expect(floating.flip).toHaveBeenLastCalledWith(expect.objectContaining({ fallbackPlacements: ['bottom'] }));
    expect(floating.computePosition).toHaveBeenLastCalledWith(nodes.reference, nodes.root, expect.objectContaining({ placement: 'top', strategy: 'fixed' }));
    expect(nodes.root.style.position).toBe('fixed');
    expect(nodes.root.style.zIndex).toBe('123');
    active.destroy();
    const nestedNodes = elements();
    const nested = startPositioning(nestedNodes, { tooltip: { placement: 'right' }, constrainToViewport: true, isTopLevel: false });
    await nested.update();
    expect(floating.computePosition).toHaveBeenLastCalledWith(nestedNodes.reference, nestedNodes.root, expect.objectContaining({ placement: 'right' }));
    nested.destroy();
  });

  it('clears obsolete arrow coordinates as placement and middleware data change', async () => {
    const nodes = elements();
    const active = startPositioning(nodes, { tooltip: {}, constrainToViewport: true });
    await active.update();
    floating.computePosition.mockResolvedValue({ x: 10, y: 20, placement: 'right', middlewareData: { arrow: { y: 8 } } });
    await active.update();
    expect(nodes.arrow.style.left).toBe('-4px');
    expect(nodes.arrow.style.top).toBe('8px');
    expect(nodes.arrow.style.bottom).toBe('');
    floating.computePosition.mockResolvedValue({ x: 10, y: 20, placement: 'bottom', middlewareData: {} });
    await active.update();
    expect(nodes.arrow.style.left).toBe('');
    expect(nodes.arrow.style.top).toBe('-4px');
    expect(nodes.arrow.style.bottom).toBe('');
    active.destroy();
  });

  it('selects fallback sides for aligned as well as unaligned placements', () => {
    expect(getDefaultFallbackPlacements('left-start')).toEqual(['right', 'bottom', 'top']);
    expect(getDefaultFallbackPlacements('right-end')).toEqual(['left', 'bottom', 'top']);
    expect(getDefaultFallbackPlacements('top-start')).toEqual(['bottom', 'right', 'left']);
    expect(getDefaultFallbackPlacements('bottom-end')).toEqual(['top', 'right', 'left']);
  });
});
