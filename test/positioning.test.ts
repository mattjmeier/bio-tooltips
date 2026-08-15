import { beforeEach, describe, expect, it, vi } from 'vitest';

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

import { startPositioning } from '../src/core/positioning';

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
});
