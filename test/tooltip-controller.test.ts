import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const updatePosition = vi.fn().mockResolvedValue(undefined);
const destroyPositioner = vi.fn();

vi.mock('../src/core/positioning', () => ({
  startPositioning: vi.fn(() => ({
    update: updatePosition,
    destroy: destroyPositioner,
  })),
}));

import { TooltipController, createStaticTooltip } from '../src/core/tooltip-controller';
import type { TooltipOptions } from '../src/core/config';
import { getOpenTopLevelTooltips } from '../src/core/tooltip-registry';
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

  afterEach(() => {
    [...getOpenTopLevelTooltips()].forEach(controller => controller.destroy());
    vi.clearAllTimers();
    vi.useRealTimers();
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
    expect(document.querySelector('.gt-tooltip-box')?.getAttribute('role')).toBe('dialog');
    expect(document.querySelector('.gt-tooltip-content')?.innerHTML).toContain('TP53');

    controller.destroy();
    controller.destroy();
    expect(document.querySelector('[data-gt-tooltip-root]')).toBeNull();
    expect(reference.hasAttribute('aria-expanded')).toBe(false);
    expect(reference.hasAttribute('data-gt-tooltip-reference')).toBe(false);
    expect(destroyPositioner).toHaveBeenCalledTimes(1);
  });

  it('makes plain text dialog triggers keyboard reachable and restores author attributes', () => {
    const reference = document.createElement('span');
    reference.textContent = 'BRCA1';
    reference.setAttribute('aria-controls', 'author-control');
    reference.setAttribute('tabindex', '2');
    document.body.append(reference);
    const controller = new TooltipController(reference, {
      content: 'Details', tooltip: immediateOptions, theme: 'light', accessibleName: 'Gene details',
    });
    expect(reference.getAttribute('role')).toBe('button');
    expect(reference.getAttribute('aria-haspopup')).toBe('dialog');
    expect(reference.getAttribute('aria-controls')).toContain('author-control');
    reference.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(controller.status).toBe('open');
    expect(document.activeElement).toBe(controller.box);
    expect(controller.box.getAttribute('role')).toBe('dialog');
    expect(controller.box.getAttribute('aria-label')).toBe('Gene details');
    controller.destroy();
    expect(reference.getAttribute('tabindex')).toBe('2');
    expect(reference.getAttribute('role')).toBeNull();
    expect(reference.getAttribute('aria-controls')).toBe('author-control');
  });

  it('uses tooltip semantics for static descriptive tooltips', () => {
    const reference = document.createElement('span');
    document.body.append(reference);
    const controller = createStaticTooltip(reference, 'Description', {
      tooltip: immediateOptions, theme: 'light',
    });
    controller.show();
    vi.runAllTimers();
    expect(controller.box.getAttribute('role')).toBe('tooltip');
    expect(reference.getAttribute('aria-describedby')).toContain(controller.box.id);
    expect(reference.hasAttribute('aria-expanded')).toBe(false);
    controller.destroy();
  });

  it('uses a non-modal bottom drawer without starting anchored positioning', () => {
    const { reference, controller } = createController();
    controller.updateOptions({ presentation: 'drawer' });
    controller.enter();

    expect(controller.root.dataset.presentation).toBe('drawer');
    expect(controller.isDrawerPresentation()).toBe(true);
    expect(controller.root.querySelector('.gt-tooltip-arrow')).not.toBeNull();
    expect(updatePosition).not.toHaveBeenCalled();

    const inside = document.createElement('button');
    controller.content.append(inside);
    inside.click();
    expect(controller.status).toBe('open');
    reference.click();
    expect(controller.status).toBe('open');

    document.body.click();
    expect(controller.status).toBe('closing');
    vi.runAllTimers();
    expect(controller.status).toBe('idle');
  });

  it('resolves an explicitly requested drawer during construction and keeps its z-index', () => {
    const reference = document.createElement('button');
    document.body.append(reference);
    const controller = new TooltipController(reference, {
      content: 'Details',
      presentation: 'drawer',
      tooltip: { ...immediateOptions, zIndex: 4321 },
      theme: 'light',
    });

    expect(controller.root.dataset.presentation).toBe('drawer');
    controller.enter();
    expect(controller.root.style.zIndex).toBe('4321');
    expect(updatePosition).not.toHaveBeenCalled();
    controller.destroy();
  });

  it('lets a new top-level tooltip dismiss a keyboard-focused drawer', () => {
    const { reference, controller } = createController();
    controller.updateOptions({ presentation: 'drawer' });
    controller.enter();
    expect(document.activeElement).toBe(controller.box);

    controller.dismiss();

    expect(controller.status).toBe('closing');
    expect(document.activeElement).toBe(reference);
  });

  it('switches automatic presentation at the inclusive 600px breakpoint and cleans up', () => {
    let listener: ((event: MediaQueryListEvent) => void) | undefined;
    const removeListener = vi.fn();
    const mediaQuery = {
      matches: true,
      addEventListener: vi.fn((_type: string, callback: (event: MediaQueryListEvent) => void) => {
        listener = callback;
      }),
      removeEventListener: removeListener,
    } as unknown as MediaQueryList;
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery));

    const { controller } = createController();
    controller.updateOptions({ presentation: 'auto' });
    expect(controller.root.dataset.presentation).toBe('drawer');

    mediaQuery.matches = false;
    listener?.({ matches: false } as MediaQueryListEvent);
    expect(controller.root.dataset.presentation).toBe('popover');

    controller.updateOptions({ presentation: 'drawer' });
    mediaQuery.matches = false;
    listener?.({ matches: false } as MediaQueryListEvent);
    expect(controller.root.dataset.presentation).toBe('drawer');

    controller.destroy();
    expect(removeListener).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });

  it('keeps nested tooltip controllers anchored when the parent is a drawer', () => {
    const { controller: parent } = createController();
    parent.updateOptions({ presentation: 'drawer' });
    parent.enter();
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

    expect(parent.isDrawerPresentation()).toBe(true);
    expect(child.isDrawerPresentation()).toBe(false);
    expect(child.root.dataset.presentation).toBe('popover');
  });

  it('closes the focused dialog on Escape and returns focus to its trigger', () => {
    const { reference, controller } = createController();
    reference.click();
    expect(document.activeElement).toBe(controller.box);
    controller.box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    vi.runAllTimers();
    expect(controller.status).toBe('idle');
    expect(document.activeElement).toBe(reference);
  });

  it('keeps focus-owned content open on pointer departure and peer dismissal', () => {
    const { controller } = createController();
    controller.enter();
    controller.root.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }));
    controller.dismiss();
    vi.runAllTimers();
    expect(controller.status).toBe('open');
    expect(document.activeElement).toBe(controller.box);
  });

  it('keeps an explicitly closing panel inert despite late pointer and resize events', () => {
    const { reference, controller } = createController({ hideDuration: 100 });
    controller.enter();
    controller.close();
    expect(document.activeElement).toBe(reference);
    expect(controller.root.hasAttribute('inert')).toBe(true);
    controller.root.dispatchEvent(new MouseEvent('mouseenter'));
    controller.root.dispatchEvent(new CustomEvent('gt:content-resize'));
    vi.runAllTimers();
    expect(controller.status).toBe('idle');
    expect(controller.root.isConnected).toBe(false);
    reference.click();
    expect(controller.status).toBe('open');
    expect(document.activeElement).toBe(controller.box);
  });

  it('closes only the focused child and skips its closing content during parent Tab exit', () => {
    const { reference, controller: parent } = createController();
    const after = document.createElement('button');
    document.body.append(after);
    parent.setContent('<button id="child-ref">Child</button><button id="parent-last">Last</button>');
    parent.enter();
    const childReference = parent.root.querySelector<HTMLButtonElement>('#child-ref')!;
    const child = new TooltipController(childReference, {
      parent, tooltip: { ...immediateOptions, hideDuration: 100, appendTo: parent.root },
      theme: 'light', content: '<input aria-label="Filter">',
    });
    parent.addNestedTooltip(child);
    child.enter();
    child.box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.activeElement).toBe(childReference);
    expect(parent.status).toBe('open');
    const last = parent.root.querySelector<HTMLButtonElement>('#parent-last')!;
    last.focus();
    last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(after);
    expect(reference.isConnected).toBe(true);
  });

  it('dismisses a hover child before a focused parent without moving focus', () => {
    const { controller: parent } = createController();
    parent.setContent('<button>More</button>');
    parent.enter();
    const child = new TooltipController(parent.content.querySelector('button')!, {
      parent, tooltip: { ...immediateOptions, appendTo: parent.root }, theme: 'light',
    });
    parent.addNestedTooltip(child);
    child.show();
    vi.runAllTimers();
    parent.box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(child.status).toBe('closing');
    expect(parent.status).toBe('open');
    expect(document.activeElement).toBe(parent.box);
  });

  it('preserves focus on the persistent box when asynchronous content replaces a control', () => {
    const { controller } = createController();
    controller.setContent('<button>Loading action</button>');
    controller.enter();
    controller.content.querySelector('button')!.focus();
    controller.setContent('<p>Loaded</p>');
    expect(document.activeElement).toBe(controller.box);
  });

  it('retains author roles and tab order while enhancing plain triggers', () => {
    const reference = document.createElement('span');
    reference.setAttribute('role', 'link');
    reference.tabIndex = -1;
    const controller = new TooltipController(reference, { theme: 'light', tooltip: immediateOptions });
    expect(reference.getAttribute('role')).toBe('link');
    expect(reference.tabIndex).toBe(-1);
    controller.destroy();
  });

  it('preserves native link activation and enters its panel with ArrowDown', () => {
    const reference = document.createElement('a');
    reference.href = '#target';
    document.body.append(reference);
    const controller = new TooltipController(reference, { theme: 'light', tooltip: immediateOptions });
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    reference.dispatchEvent(enter);
    expect(enter.defaultPrevented).toBe(false);
    reference.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(controller.box);
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

  it('closes the parent after the last child tooltip finishes hiding when the pointer has left', () => {
    const { controller: parent } = createController();
    parent.show();
    vi.runAllTimers();
    expect(parent.status).toBe('open');

    const childReference = document.createElement('button');
    parent.content.append(childReference);
    const child = new TooltipController(childReference, {
      content: 'Nested content',
      tooltip: { ...immediateOptions, appendTo: parent.root, hideDelay: 0 },
      theme: parent.theme,
      parent,
      interactiveDebounce: 75,
    });
    parent.addNestedTooltip(child);
    child.show();
    vi.runAllTimers();
    expect(child.status).toBe('open');

    // Pointer leaves both the child and the parent in the same instant.
    // The child schedules its closeNow after a 75 ms debounce; the parent's
    // hide() sees the child still in visibleChildren and defers.
    childReference.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }));
    parent.root.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }));
    // Nothing has closed yet — parent must still be open.
    vi.advanceTimersByTime(50);
    expect(parent.status).toBe('open');

    // The child's debounce elapses; closeNow fires and removes it from
    // visibleChildren. The parent should now complete its deferred hide.
    vi.advanceTimersByTime(30);
    vi.runAllTimers();
    expect(parent.status).toBe('idle');
    expect(parent.state.isMounted).toBe(false);
  });

  it('does not close the parent when the pointer re-enters before the child finishes hiding', () => {
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
      interactiveDebounce: 75,
    });
    parent.addNestedTooltip(child);
    child.show();
    vi.runAllTimers();

    // Pointer leaves, triggering the deferred-hide path.
    childReference.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }));
    parent.root.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }));

    // User quickly mouses back over the parent panel.
    parent.root.dispatchEvent(new MouseEvent('mouseenter'));

    // Child debounce elapses — parent should stay open because the pointer returned.
    vi.advanceTimersByTime(100);
    vi.runAllTimers();
    expect(parent.status).toBe('open');

    parent.destroy();
  });

  it('allows a parent to own only one visible nested tooltip at a time', () => {
    const { controller: parent } = createController();
    parent.show();
    vi.runAllTimers();

    const firstReference = document.createElement('button');
    const secondReference = document.createElement('button');
    parent.content.append(firstReference, secondReference);
    const createChild = (reference: Element, content: string) => {
      const child = new TooltipController(reference, {
        content,
        tooltip: { ...immediateOptions, appendTo: parent.root },
        theme: parent.theme,
        parent,
      });
      parent.addNestedTooltip(child);
      return child;
    };
    const firstChild = createChild(firstReference, 'First exon');
    const secondChild = createChild(secondReference, 'Second exon');

    firstChild.show();
    vi.runAllTimers();
    expect(firstChild.status).toBe('open');

    secondChild.show();
    vi.runAllTimers();

    expect(firstChild.status).toBe('idle');
    expect(firstChild.state.isMounted).toBe(false);
    expect(secondChild.status).toBe('open');
    expect(parent.status).toBe('open');
    expect(parent.root.querySelectorAll('[data-gt-tooltip-root]')).toHaveLength(1);
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
  it.each(['close', 'destroy'] as const)('returns focus outside body-mounted descendants when a parent is %s', action => {
    const { reference, controller: parent } = createController();
    parent.enter();
    const trigger = document.createElement('button');
    parent.content.append(trigger);
    const child = new TooltipController(trigger, {
      content: '<input aria-label="Search">',
      tooltip: immediateOptions,
      theme: parent.theme,
      parent,
    });
    parent.addNestedTooltip(child);
    child.enter();
    child.content.querySelector('input')!.focus();
    parent[action]();
    expect(document.activeElement).toBe(reference);
    expect(child.state.isDestroyed).toBe(true);
    vi.runAllTimers();
    expect(parent.state.isMounted).toBe(false);
  });

});
