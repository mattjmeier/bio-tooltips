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
    document.getSelection()?.removeAllRanges();
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
    expect(reference.hasAttribute('data-gt-tooltip-reference')).toBe(true);

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
    expect(reference.hasAttribute('data-gt-tooltip-reference')).toBe(false);
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

  it('clears trigger text selected by a short tap but preserves long-press selection', () => {
    const { reference } = createController();
    const selection = document.getSelection()!;
    const selectReference = () => {
      const range = document.createRange();
      range.selectNodeContents(reference);
      selection.removeAllRanges();
      selection.addRange(range);
    };

    reference.dispatchEvent(new Event('touchstart'));
    selectReference();
    vi.advanceTimersByTime(100);
    reference.dispatchEvent(new Event('touchend'));
    vi.runAllTimers();
    expect(selection.rangeCount).toBe(0);

    reference.dispatchEvent(new Event('touchstart'));
    selectReference();
    vi.advanceTimersByTime(600);
    reference.dispatchEvent(new Event('touchend'));
    vi.runAllTimers();
    expect(selection.rangeCount).toBe(1);
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

  it('stays open when clicking whitespace after focusing a control in the panel', () => {
    const { controller } = createController();
    controller.show();
    vi.runAllTimers();
    expect(controller.status).toBe('open');

    // A focusable control inside the panel holds focus (e.g. the pin button or "Show more").
    const control = document.createElement('button');
    controller.content.append(control);
    control.focus();
    expect(document.activeElement).toBe(control);

    // Clicking empty space blurs the control and drops focus to <body>.
    document.activeElement.blur();
    expect(document.activeElement).toBe(document.body);
    controller.root.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    vi.runAllTimers();

    expect(controller.status).toBe('open');
  });

  it('closes when keyboard focus leaves the panel for a real external control', () => {
    const { controller } = createController();
    controller.show();
    vi.runAllTimers();

    const control = document.createElement('button');
    controller.content.append(control);
    control.focus();

    // Tabbing to a focusable control outside the panel moves focus to a real element,
    // not <body>, so the panel should close.
    const external = document.createElement('button');
    document.body.append(external);
    external.focus();
    expect(document.activeElement).toBe(external);
    controller.root.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    vi.runAllTimers();

    expect(controller.status).toBe('idle');
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

  it('recovers from a peer dismissal that is interrupted while closing', () => {
    const { reference, controller } = createController({ hideDuration: 250 });
    controller.show();
    vi.runAllTimers();
    expect(controller.status).toBe('open');

    // A peer tooltip opens and dismisses this one; the unmount is now pending.
    controller.dismiss();
    expect(controller.status).toBe('closing');
    expect(controller.state.isMounted).toBe(true);
    expect(controller._peerDismissed).toBe(true);

    // The cursor drifts back over the still-animating panel before it unmounts.
    // This used to cancel the pending unmount and strand the tooltip in
    // 'closing' with _peerDismissed stuck true, so it never unmounted and
    // `show()` ignored hover forever (the "permanently disabled" bug).
    vi.advanceTimersByTime(100);
    controller.root.dispatchEvent(new MouseEvent('mouseenter'));

    vi.runAllTimers();
    expect(controller.status).toBe('idle');
    expect(controller.state.isMounted).toBe(false);
    expect(controller._peerDismissed).toBe(false);

    // A fresh hover of the trigger opens it again.
    reference.dispatchEvent(new MouseEvent('mouseenter'));
    vi.runAllTimers();
    expect(controller.status).toBe('open');
  });
});
