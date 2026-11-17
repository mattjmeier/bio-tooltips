import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TooltipController, type TooltipControllerOptions } from '../src/core/tooltip-controller';
import { getOpenTopLevelTooltips } from '../src/core/tooltip-registry';

vi.mock('../src/core/positioning', () => ({
  getDefaultFallbackPlacements: () => ['left', 'bottom', 'top'],
  startPositioning: () => ({ update: async () => {}, destroy: () => {} }),
}));

const controllers: TooltipController[] = [];
function create(options: Partial<TooltipControllerOptions> = {}) {
  const reference = document.createElement('button');
  document.body.append(reference);
  const controller = new TooltipController(reference, {
    content: '<button>First</button><button>Last</button>', theme: 'light',
    tooltip: { showDuration: 0, hideDuration: 0 }, ...options,
  });
  controllers.push(controller);
  return controller;
}
function key(target: EventTarget, value: string, shiftKey = false) {
  const event = new KeyboardEvent('keydown', { key: value, shiftKey, bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => { cb(0); return 1; });
});
afterEach(() => {
  controllers.splice(0).reverse().forEach(controller => controller.destroy());
  vi.clearAllTimers(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe('controller lifecycle transitions', () => {
  it('allows show and hide hooks to veto transitions and retry after the veto is removed', () => {
    const onShow = vi.fn().mockReturnValueOnce(false);
    const onHide = vi.fn().mockReturnValueOnce(false);
    const controller = create({ hooks: { onShow, onHide } });
    controller.open();
    expect(controller.status).toBe('idle');
    expect(controller.state.isMounted).toBe(false);
    controller.open();
    expect(controller.status).toBe('open');
    controller.close();
    expect(controller.status).toBe('open');
    expect(controller.root.hasAttribute('inert')).toBe(false);
    controller.close();
    vi.runAllTimers();
    expect(controller.status).toBe('idle');
    expect(onShow).toHaveBeenCalledTimes(2);
    expect(onHide).toHaveBeenCalledTimes(2);
  });

  it('reruns show hooks on an interrupted close and delivers only the latest shown callback', () => {
    const onShow = vi.fn();
    const onShown = vi.fn();
    const controller = create({ tooltip: { showDuration: 100, hideDuration: 200 }, hooks: { onShow, onShown } });
    controller.open();
    vi.advanceTimersByTime(50);
    controller.close();
    controller.open();
    expect(onShow).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(50);
    expect(onShown).not.toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    expect(onShown).toHaveBeenCalledTimes(1);
    vi.runAllTimers();
    expect(controller.status).toBe('open');
    expect(controller.state.isMounted).toBe(true);
  });

  it.each(['mouseenter', 'focus'])('reinstalls show lifecycle on trigger %s during a close transition', type => {
    const onShow = vi.fn();
    const controller = create({ tooltip: { showDuration: 0, hideDuration: 200 }, hooks: { onShow } });
    controller.open();
    controller.close();
    controller.reference.dispatchEvent(new Event(type));
    expect(controller.status).toBe('open');
    expect(onShow).toHaveBeenCalledTimes(2);
    vi.runAllTimers();
    expect(controller.state.isMounted).toBe(true);
  });

  it('pins a closed tooltip when opening finishes and preserves it against peer dismissal', () => {
    const controller = create();
    controller.setPinned(true);
    vi.runAllTimers();
    expect(controller.status).toBe('open');
    expect(controller.root.dataset.pinned).toBe('true');
    controller.dismiss();
    vi.runAllTimers();
    expect(controller.status).toBe('open');
    controller.close();
    vi.runAllTimers();
    expect(controller.status).toBe('idle');
  });

  it('fully unmounts if a show hook vetoes reopening during the close transition', () => {
    const onShow = vi.fn().mockReturnValueOnce(undefined).mockReturnValueOnce(false);
    const controller = create({ tooltip: { hideDuration: 200 }, hooks: { onShow } });
    controller.open();
    controller.close();
    controller.open();
    vi.runAllTimers();
    expect(controller.status).toBe('idle');
    expect(controller.state.isMounted).toBe(false);
    expect(controller.state.isShown).toBe(false);
    expect(controller.reference.getAttribute('aria-expanded')).toBe('false');
    expect(getOpenTopLevelTooltips().has(controller)).toBe(false);
    controller.open();
    expect(controller.status).toBe('open');
  });

  it('destroys children added after parent teardown and safely removes absent children', () => {
    const parent = create();
    const child = create();
    parent.removeNestedTooltip(child);
    parent.destroy();
    parent.addNestedTooltip(child);
    expect(child.state.isDestroyed).toBe(true);
    expect(parent._nestedTooltips).toHaveLength(0);
    expect(getOpenTopLevelTooltips().has(parent)).toBe(false);
  });

  it('supports timer-based visibility when requestAnimationFrame is unavailable', () => {
    vi.stubGlobal('requestAnimationFrame', undefined);
    const controller = create();
    controller.open();
    vi.runAllTimers();
    expect(controller.state.isVisible).toBe(true);
    expect(controller.box.dataset.state).toBe('visible');
    controller.destroy();
    vi.runAllTimers();
    expect(controller.root.isConnected).toBe(false);
  });

  it('propagates theme changes to nested tooltips and applies updated accessible names', () => {
    const parent = create();
    parent.open();
    const child = create({ parent });
    parent.addNestedTooltip(child);
    child.open();
    parent.updateOptions({ theme: 'dark', accessibleName: 'Updated gene details' });
    expect(parent.box.dataset.theme).toBe('dark');
    expect(child.box.dataset.theme).toBe('dark');
    expect(parent.box.getAttribute('aria-label')).toBe('Updated gene details');
  });

  it('keeps the pointer bridge open while crossing the gap and dismisses after leaving it', () => {
    const controller = create({ tooltip: { hideDelay: 100, hideDuration: 0 }, interactiveDebounce: 0 });
    controller.open();
    const rect = (left: number, top: number, width: number, height: number) => ({
      left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON() {},
    });
    vi.spyOn(controller.reference, 'getBoundingClientRect').mockReturnValue(rect(0, 0, 50, 20));
    vi.spyOn(controller.root, 'getBoundingClientRect').mockReturnValue(rect(0, 40, 100, 100));
    controller.reference.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 25, clientY: 30 }));
    vi.advanceTimersByTime(150);
    expect(controller.status).toBe('open');
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 200 }));
    vi.runAllTimers();
    expect(controller.status).toBe('idle');
  });
});

describe('drawer keyboard resizing', () => {
  it('supports detent navigation, boundary clamping, and accessible size announcements', () => {
    const controller = create({ presentation: 'drawer' });
    controller.open();
    const handle = controller.root.querySelector<HTMLButtonElement>('.gt-drawer-handle')!;
    const value = () => Number(handle.getAttribute('aria-valuenow'));
    const reading = value();
    expect(key(handle, 'End').defaultPrevented).toBe(true);
    const maximum = value();
    expect(maximum).toBe(Number(handle.getAttribute('aria-valuemax')));
    expect(handle.getAttribute('aria-valuetext')).toContain('Expanded drawer');
    key(handle, 'PageUp');
    expect(value()).toBe(maximum);
    key(handle, 'Home');
    const minimum = value();
    expect(minimum).toBe(Number(handle.getAttribute('aria-valuemin')));
    key(handle, 'PageDown');
    expect(value()).toBe(minimum);
    key(handle, 'PageUp');
    expect(value()).toBeGreaterThan(minimum);
    expect(value()).toBeLessThan(reading);
    key(handle, 'PageDown');
    expect(value()).toBe(minimum);
    key(handle, 'ArrowUp');
    const step = value() - minimum;
    key(handle, 'ArrowUp', true);
    expect(value()).toBe(minimum + step * 3);
    key(handle, 'ArrowDown', true);
    expect(value()).toBe(minimum + step);
    expect(key(handle, 'x').defaultPrevented).toBe(false);
  });
});

describe('non-modal keyboard exit', () => {
  it('returns Shift+Tab to the trigger and sends forward Tab to the next external control', () => {
    const controller = create();
    const after = document.createElement('button');
    document.body.append(after);
    controller.enter();
    key(controller.box, 'Tab', true);
    expect(document.activeElement).toBe(controller.reference);
    controller.enter();
    const last = controller.content.querySelectorAll('button')[1];
    last.focus();
    expect(key(last, 'Tab').defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(after);
  });

  it('closes at the page boundary when a panel has no focusable controls', () => {
    const controller = create({ content: '<p>No interactive content</p>' });
    controller.enter();
    key(controller.box, 'Tab');
    expect(document.activeElement).toBe(controller.reference);
    vi.runAllTimers();
    expect(controller.state.isMounted).toBe(false);
  });
});

describe('Escape dispatcher', () => {
  it('respects a previously handled Escape and ignores unrelated keys', () => {
    const controller = create();
    controller.open();
    const handled = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    handled.preventDefault();
    document.dispatchEvent(handled);
    key(document, 'Enter');
    expect(controller.status).toBe('open');
    key(document, 'Escape');
    expect(controller.status).toBe('closing');
  });

  it('prefers the hovered panel when no panel owns focus, then closes the remaining visible panel', () => {
    const first = create();
    const second = create();
    first.open(); second.open();
    first.root.dispatchEvent(new MouseEvent('mouseenter'));
    expect(key(document, 'Escape').defaultPrevented).toBe(true);
    expect(first.status).toBe('closing');
    expect(second.status).toBe('open');
    key(document, 'Escape');
    expect(second.status).toBe('closing');
    const unhandled = key(document, 'Escape');
    expect(unhandled.defaultPrevented).toBe(false);
  });

  it('removes the global Escape listener after the last controller is destroyed and reinstalls it on a later open', () => {
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    const first = create();
    first.open();
    const handler = add.mock.calls.find(([type]) => type === 'keydown')![1];
    first.destroy();
    expect(remove).toHaveBeenCalledWith('keydown', handler);
    const second = create();
    second.open();
    key(document, 'Escape');
    expect(second.status).toBe('closing');
  });
});
