import { beforeEach, describe, expect, it, vi } from 'vitest';

const updatePosition = vi.fn().mockResolvedValue(undefined);
const destroyPositioner = vi.fn();

vi.mock('../src/core/positioning', () => ({
  startPositioning: vi.fn(() => ({
    update: updatePosition,
    destroy: destroyPositioner,
  })),
}));

import { TooltipController } from '../src/core/tooltip-controller';
import type { TooltipOptions } from '../src/core/config';
import { initializeThemeObserver } from '../src/ui/theme';

const immediateOptions: TooltipOptions = {
  placement: 'bottom',
  fallbackPlacements: ['top', 'right', 'left'],
  offset: 10,
  viewportPadding: 8,
  showDelay: 0,
  hideDelay: 0,
  showDuration: 0,
  hideDuration: 0,
  zIndex: 9999,
  appendTo: () => document.body,
};

function createController(overrides: Partial<TooltipOptions> = {}) {
  const reference = document.createElement('button');
  reference.textContent = 'TP53';
  document.body.append(reference);
  const controller = new TooltipController(reference, {
    content: '<strong>TP53</strong>',
    tooltip: { ...immediateOptions, ...overrides } as TooltipOptions,
    theme: 'light',
    interactiveDebounce: 0,
  });
  return { reference, controller };
}

describe('TooltipController', () => {
  beforeEach(() => {
    document.body.replaceChildren();
    document.documentElement.classList.remove('dark');
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    updatePosition.mockClear();
    destroyPositioner.mockClear();
  });

  it('lazily mounts owned markup and restores reference attributes on destroy', () => {
    const { reference, controller } = createController();
    expect(document.querySelector('[data-gt-tooltip-root]')).toBeNull();
    expect(reference.getAttribute('aria-expanded')).toBe('false');

    controller.show();
    vi.runAllTimers();

    expect(controller.status).toBe('open');
    expect(reference.getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('.gt-tooltip-box')?.getAttribute('role')).toBe('tooltip');
    expect(document.querySelector('.gt-tooltip-content')?.innerHTML).toContain('TP53');

    controller.destroy();
    controller.destroy();
    expect(document.querySelector('[data-gt-tooltip-root]')).toBeNull();
    expect(reference.hasAttribute('aria-expanded')).toBe(false);
    expect(destroyPositioner).toHaveBeenCalledTimes(1);
  });

  it('supports delayed opening and cancels it when hiding', () => {
    const { controller } = createController({ showDelay: 100 });
    controller.show();
    vi.advanceTimersByTime(50);
    controller.hide();
    vi.runAllTimers();

    expect(controller.state.isMounted).toBe(false);
    expect(controller.status).toBe('idle');
  });

  it('opens for hover, focus, and touch triggers', () => {
    const { reference, controller } = createController();
    for (const event of [
      new MouseEvent('mouseenter'),
      new FocusEvent('focus'),
      new Event('touchstart'),
    ]) {
      event === undefined;
      reference.dispatchEvent(event);
      vi.runAllTimers();
      expect(controller.state.isShown).toBe(true);
      controller.hide();
      vi.runAllTimers();
    }
  });

  it('keeps interactive content open while the pointer moves into the panel', () => {
    const { reference, controller } = createController();
    reference.dispatchEvent(new MouseEvent('mouseenter'));
    vi.runAllTimers();

    reference.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }));
    controller.root.dispatchEvent(new MouseEvent('mouseenter'));
    vi.runAllTimers();

    expect(controller.status).toBe('open');
  });

  it('repositions resized interactive content and keeps its previous pointer bridge', async () => {
    const { controller } = createController();
    controller.show();
    vi.runAllTimers();

    Object.defineProperty(controller.root, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ left: 100, right: 300, top: 100, bottom: 300, width: 200, height: 200, x: 100, y: 100, toJSON() {} }),
    });
    controller.content.dispatchEvent(new CustomEvent('gt:content-resize', { bubbles: true }));
    await Promise.resolve();
    expect(updatePosition).toHaveBeenCalled();

    Object.defineProperty(controller.root, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ left: 100, right: 300, top: -120, bottom: 80, width: 200, height: 200, x: 100, y: -120, toJSON() {} }),
    });
    controller.root.dispatchEvent(new MouseEvent('mouseleave', {
      clientX: 180,
      clientY: 180,
      relatedTarget: document.body,
    }));
    vi.runAllTimers();

    expect(controller.status).toBe('open');
  });

  it('keeps a parent open while a nested tooltip is visible', () => {
    const { controller: parent } = createController();
    parent.show();
    vi.runAllTimers();

    const childReference = document.createElement('button');
    parent.content.append(childReference);
    const child = new TooltipController(childReference, {
      content: 'Nested content',
      tooltip: { ...immediateOptions, appendTo: parent.root },
      theme: parent.theme,
      parent,
    });
    parent.addNestedTooltip(child);
    child.show();
    vi.runAllTimers();
    parent.hide();
    vi.runAllTimers();

    expect(parent.status).toBe('open');
    parent.destroy();
    expect(child.state.isDestroyed).toBe(true);
  });

  it('pins, updates content and theme, then hides when unpinned', () => {
    const { controller } = createController();
    controller.show();
    vi.runAllTimers();
    controller.setPinned(true);
    controller.hide();
    vi.runAllTimers();
    expect(controller.status).toBe('open');

    controller.setContent('<em>Updated</em>');
    controller.setTheme('dark');
    expect(controller.content.innerHTML).toContain('Updated');
    expect(controller.box.dataset.theme).toBe('dark');

    controller.setPinned(false);
    vi.runAllTimers();
    expect(controller.status).toBe('idle');
  });

  it('propagates automatic theme changes to the owned shell', async () => {
    const { controller } = createController();
    controller._themeIntent = 'auto';
    const disconnect = initializeThemeObserver([controller], true);

    document.documentElement.classList.add('dark');
    await Promise.resolve();
    expect(controller.box.dataset.theme).toBe('dark');

    disconnect();
    controller.destroy();
  });
});
