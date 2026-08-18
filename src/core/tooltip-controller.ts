import type { CoreTooltipConfig, TooltipOptions } from './config.js';
import { startPositioning, type ActivePositioner } from './positioning.js';
import { logTooltipTiming } from './timing.js';
import { registerTopLevelTooltip, unregisterTopLevelTooltip } from './tooltip-registry.js';

export type TooltipStatus = 'idle' | 'opening' | 'open' | 'closing' | 'destroyed';

export interface TooltipControllerHooks<TData> {
  onShow?: (instance: TooltipController<TData>) => false | void;
  onShown?: (instance: TooltipController<TData>) => void;
  onHide?: (instance: TooltipController<TData>) => false | void;
  onDestroy?: (instance: TooltipController<TData>) => void;
}

export interface TooltipControllerOptions<TData> {
  content?: string;
  tooltip: TooltipOptions;
  theme: string;
  constrainToViewport?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  interactiveBorder?: number;
  interactiveDebounce?: number;
  parent?: TooltipController<any>;
  hooks?: TooltipControllerHooks<TData>;
  // Full core config, used only to drive debugTimings / onTiming lifecycle logs.
  // Omitted for nested and static tooltips, which then stay silent.
  timingConfig?: CoreTooltipConfig;
}

export class TooltipController<TData = unknown> {
  readonly reference: Element;
  readonly root: HTMLDivElement;
  readonly box: HTMLDivElement;
  readonly content: HTMLDivElement;
  readonly arrow: HTMLDivElement;
  readonly state = {
    isMounted: false,
    isShown: false,
    isVisible: false,
    isDestroyed: false,
  };

  status: TooltipStatus = 'idle';
  theme: string;
  options: TooltipControllerOptions<TData>;

  _nestedTooltips: TooltipController<any>[] = [];
  _entityData?: TData | null;
  _uniqueId?: string;
  _themeIntent?: 'auto' | string;
  _sectionToggleHandler?: (event: Event) => void;
  _sectionKeydownHandler?: (event: KeyboardEvent) => void;
  _visualsRendered?: boolean;
  _visualRenderPromise?: Promise<void>;
  _renderedVisualSections?: Set<string>;
  _renderingVisualSections?: Set<string>;
  _timingStart?: number;
  _isPinned?: boolean;
  // True while this tooltip was dismissed because a sibling opened (the
  // "only one top-level tooltip at a time" rule). While set, hovering this
  // tooltip's own panel must not revive it — otherwise a sibling whose panel
  // overlaps this trigger would keep re-opening under the cursor. Cleared once
  // the tooltip is fully unmounted or genuinely opens again.
  _peerDismissed?: boolean;
  _pinButton?: HTMLElement | null;
  _visualViewportResizeHandler?: () => void;

  private readonly hooks: TooltipControllerHooks<TData>;
  private readonly timingConfig?: CoreTooltipConfig;
  private readonly cleanupListeners: Array<() => void> = [];
  private readonly visibleChildren = new Set<TooltipController<any>>();
  private readonly originalAriaExpanded: string | null;
  private readonly originalReferenceMarker: string | null;
  private showTimer?: ReturnType<typeof setTimeout>;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private shownTimer?: ReturnType<typeof setTimeout>;
  private unmountTimer?: ReturnType<typeof setTimeout>;
  private selectionClearTimer?: ReturnType<typeof setTimeout>;
  private touchStartedAt?: number;
  private positioner?: ActivePositioner;
  private parent?: TooltipController<any>;
  private pointerBridgeCleanup?: () => void;
  private preservedInteractiveRect?: DOMRect;

  constructor(reference: Element, options: TooltipControllerOptions<TData>) {
    this.reference = reference;
    this.options = options;
    this.hooks = options.hooks ?? {};
    this.timingConfig = options.timingConfig;
    this.theme = options.theme;
    this.parent = options.parent;
    this.originalAriaExpanded = reference.getAttribute('aria-expanded');
    this.originalReferenceMarker = reference.getAttribute('data-gt-tooltip-reference');

    this.root = document.createElement('div');
    this.root.dataset.gtTooltipRoot = '';
    this.root.style.visibility = 'hidden';

    this.box = document.createElement('div');
    this.box.className = 'gt-tooltip-box';
    this.box.dataset.state = 'hidden';
    this.box.dataset.theme = this.theme;
    this.box.setAttribute('role', 'tooltip');

    this.content = document.createElement('div');
    this.content.className = 'gt-tooltip-content';
    this.content.dataset.state = 'hidden';
    this.content.innerHTML = options.content ?? '';

    this.arrow = document.createElement('div');
    this.arrow.className = 'gt-tooltip-arrow';
    this.arrow.setAttribute('aria-hidden', 'true');

    this.box.append(this.content, this.arrow);
    this.root.append(this.box);
    this.reference.setAttribute('data-gt-tooltip-reference', '');
    this.reference.setAttribute('aria-expanded', 'false');
    this.installInteractions();
  }

  show(): void {
    if (this.state.isDestroyed || this.status === 'open' || this.status === 'opening') return;
    // A tooltip dismissed because a peer opened ("only one at a time") must not
    // be revived by a stray mouseenter while its old panel is still under the
    // cursor. The flag is cleared once it is fully unmounted or genuinely
    // reopens, so a deliberate re-hover of its trigger still works.
    if (this._peerDismissed) return;
    this.clearHideTimers();
    this.status = 'opening';
    if (this.timingConfig) {
      logTooltipTiming(this, this.timingConfig, 'show requested', {
        status: this.status,
        peerDismissed: Boolean(this._peerDismissed),
      });
    }
    const delay = this.options.tooltip.showDelay ?? 0;
    this.showTimer = setTimeout(() => this.openNow(), delay);
  }

  hide(): void {
    if (this.state.isDestroyed || this.status === 'idle' || this.status === 'closing') return;
    if (this._isPinned || this.visibleChildren.size > 0) return;
    this.clearShowTimer();
    const delay = Math.max(
      this.options.tooltip.hideDelay ?? 0,
      this.options.interactiveDebounce ?? 0
    );
    this.hideTimer = setTimeout(() => this.closeNow(), delay);
  }

  /**
   * Close this tooltip immediately, bypassing the interactive hide debounce and
   * the pointer bridge that otherwise keep an open panel alive while the cursor
   * drifts toward the next trigger. The engine calls this on the open siblings
   * whenever a tooltip opens so only one top-level tooltip is visible at a time.
   * Pinned tooltips are left untouched.
   *
   * The `_peerDismissed` flag marks this close as "lost to a sibling" so that
   * hovering this tooltip's own panel cannot revive it (its panel may still be
   * under the cursor, now covered by the sibling's panel). The flag is cleared
   * once the tooltip is fully unmounted or genuinely reopens.
   */
  dismiss(): void {
    if (this.state.isDestroyed || this.status === 'idle' || this.status === 'closing') return;
    if (this._isPinned) return;
    this._peerDismissed = true;
    if (this.timingConfig) {
      logTooltipTiming(this, this.timingConfig, 'dismissed by peer', { status: this.status });
    }
    this.clearShowTimer();
    this.clearHideTimers();
    this.closeNow();
  }

  setContent(content: string): void {
    if (this.state.isDestroyed) return;
    this.content.innerHTML = content;
    queueMicrotask(() => {
      void this.updatePosition();
    });
  }

  setTheme(theme: string): void {
    if (this.state.isDestroyed || this.theme === theme) return;
    this.theme = theme;
    this.box.dataset.theme = theme;
    this._nestedTooltips.forEach(child => child.setTheme(theme));
  }

  updateOptions(options: Partial<Omit<TooltipControllerOptions<TData>, 'tooltip'>> & { tooltip?: TooltipOptions }): void {
    if (this.state.isDestroyed) return;
    this.options = {
      ...this.options,
      ...options,
      tooltip: { ...this.options.tooltip, ...options.tooltip } as TooltipOptions,
    };
    if (options.theme) this.setTheme(options.theme);
    if (this.state.isMounted) this.restartPositioning();
  }

  async updatePosition(): Promise<void> {
    await this.positioner?.update();
  }

  addNestedTooltip(child: TooltipController<any>): void {
    if (this.state.isDestroyed) {
      child.destroy();
      return;
    }
    this._nestedTooltips.push(child);
  }

  removeNestedTooltip(child: TooltipController<any>): void {
    const index = this._nestedTooltips.indexOf(child);
    if (index >= 0) this._nestedTooltips.splice(index, 1);
    this.visibleChildren.delete(child);
  }

  destroyNestedTooltips(): void {
    const children = this._nestedTooltips.splice(0);
    children.forEach(child => child.destroy());
    this.visibleChildren.clear();
  }

  setPinned(pinned: boolean): void {
    this._isPinned = pinned;
    if (pinned) {
      this.clearHideTimers();
      this.show();
    } else {
      this.clearHideTimers();
      this.closeNow();
    }
  }

  destroy(): void {
    if (this.state.isDestroyed) return;
    this.status = 'destroyed';
    this.state.isDestroyed = true;
    this.state.isShown = false;
    this.state.isVisible = false;
    this.state.isMounted = false;
    this.clearAllTimers();
    // clearAllTimers() cancels the unmount timer that would otherwise drop this
    // tooltip from the shared set, so remove it here when it is torn down early.
    unregisterTopLevelTooltip(this);
    this.stopPositioning();
    this.destroyNestedTooltips();
    this.cleanupListeners.splice(0).forEach(cleanup => cleanup());
    this.hooks.onDestroy?.(this);
    this.root.remove();
    this.parent?.setChildVisible(this, false);
    this.parent?.removeNestedTooltip(this);
    if (this.originalAriaExpanded == null) {
      this.reference.removeAttribute('aria-expanded');
    } else {
      this.reference.setAttribute('aria-expanded', this.originalAriaExpanded);
    }
    if (this.originalReferenceMarker == null) {
      this.reference.removeAttribute('data-gt-tooltip-reference');
    } else {
      this.reference.setAttribute('data-gt-tooltip-reference', this.originalReferenceMarker);
    }
  }

  private openNow(): void {
    if (this.state.isDestroyed || this.status !== 'opening') return;
    this.showTimer = undefined;
    if (this.hooks.onShow?.(this) === false) {
      this.status = 'idle';
      return;
    }

    this.mount();
    this.status = 'open';
    this._peerDismissed = false;
    this.state.isShown = true;
    // Top-level only: nested tooltips carry a parent and are dismissed with
    // theirs, so they never participate in the cross-engine "one at a time" set.
    if (!this.parent) registerTopLevelTooltip(this);
    if (this.timingConfig) {
      logTooltipTiming(this, this.timingConfig, 'opened (mounted)', {
        status: this.status,
        isMounted: this.state.isMounted,
      });
    }
    this.reference.setAttribute('aria-expanded', 'true');
    this.parent?.setChildVisible(this, true);

    scheduleFrame(() => {
      if (!this.state.isMounted || this.state.isDestroyed) return;
      this.root.style.visibility = 'visible';
      this.box.dataset.state = 'visible';
      this.content.dataset.state = 'visible';
      this.state.isVisible = true;
    });

    const duration = this.options.tooltip.showDuration ?? 300;
    this.box.style.setProperty('--gt-show-duration', `${duration}ms`);
    this.shownTimer = setTimeout(() => {
      this.shownTimer = undefined;
      if (this.status === 'open') this.hooks.onShown?.(this);
    }, duration);
  }

  private closeNow(): void {
    if (this.state.isDestroyed || (this.status !== 'open' && this.status !== 'opening')) return;
    this.hideTimer = undefined;
    if (this.hooks.onHide?.(this) === false) return;

    this.status = 'closing';
    this.state.isShown = false;
    this.state.isVisible = false;
    if (this.timingConfig) {
      logTooltipTiming(this, this.timingConfig, 'closing', {
        status: this.status,
        peerDismissed: Boolean(this._peerDismissed),
        pinned: Boolean(this._isPinned),
      });
    }
    this.reference.setAttribute('aria-expanded', 'false');
    this.parent?.setChildVisible(this, false);
    this.box.dataset.state = 'hidden';
    this.content.dataset.state = 'hidden';

    const duration = this.options.tooltip.hideDuration ?? 250;
    this.box.style.setProperty('--gt-hide-duration', `${duration}ms`);
    this.unmountTimer = setTimeout(() => {
      this.unmountTimer = undefined;
      if (this.status !== 'closing' || this.state.isDestroyed) return;
      this.unmount();
      this.status = 'idle';
      this._peerDismissed = false;
      unregisterTopLevelTooltip(this);
      if (this.timingConfig) {
        logTooltipTiming(this, this.timingConfig, 'unmounted (hidden)', { status: this.status });
      }
    }, duration);
  }

  private mount(): void {
    if (this.state.isMounted) return;
    this.preservedInteractiveRect = undefined;
    const appendTo = this.options.tooltip.appendTo;
    const target = typeof appendTo === 'function'
      ? appendTo()
      : appendTo ?? document.body;
    target.append(this.root);
    this.state.isMounted = true;
    this.restartPositioning();
  }

  private unmount(): void {
    this.stopPositioning();
    this.root.style.visibility = 'hidden';
    this.state.isMounted = false;

    const remove = () => {
      if (!this.state.isMounted) this.root.remove();
    };

    const pendingRender = this._visualRenderPromise;
    if (pendingRender) {
      void pendingRender.then(remove, remove);
    } else {
      remove();
    }
  }

  private restartPositioning(): void {
    this.stopPositioning();
    if (!this.state.isMounted) return;
    this.positioner = startPositioning({
      reference: this.reference,
      root: this.root,
      box: this.box,
      content: this.content,
      arrow: this.arrow,
    }, {
      tooltip: this.options.tooltip,
      constrainToViewport: this.options.constrainToViewport ?? true,
      maxWidth: this.options.maxWidth,
      maxHeight: this.options.maxHeight,
      isTopLevel: !this.parent,
    });
  }

  private stopPositioning(): void {
    this.positioner?.destroy();
    this.positioner = undefined;
  }

  private setChildVisible(child: TooltipController<any>, visible: boolean): void {
    if (visible) {
      this.visibleChildren.add(child);
      this.clearHideTimers();
    } else {
      this.visibleChildren.delete(child);
    }
  }

  private installInteractions(): void {
    this.listen(this.reference, 'mouseenter', () => this.show());
    this.listen(this.reference, 'mouseleave', (event: Event) => this.handlePointerLeave(event as MouseEvent));
    this.listen(this.reference, 'focus', () => this.show());
    this.listen(this.reference, 'blur', () => this.handleFocusLeave());
    this.listen(this.reference, 'touchstart', () => {
      this.touchStartedAt = Date.now();
      this.show();
    }, { passive: true });
    this.listen(this.reference, 'touchend', () => this.handleTouchEnd(), { passive: true });
    this.listen(this.reference, 'touchcancel', () => {
      this.touchStartedAt = undefined;
    }, { passive: true });
    this.listen(this.root, 'mouseenter', () => {
      this.preservedInteractiveRect = undefined;
      this.clearHideTimers();
    });
    this.listen(this.root, 'mouseleave', (event: Event) => this.handlePointerLeave(event as MouseEvent));
    this.listen(this.root, 'focusin', () => this.clearHideTimers());
    this.listen(this.root, 'focusout', () => this.handleFocusLeave());
    this.listen(this.root, 'gt:content-resize', () => this.handleContentResize());
  }

  private handleTouchEnd(): void {
    const startedAt = this.touchStartedAt;
    this.touchStartedAt = undefined;
    if (startedAt == null || Date.now() - startedAt > 450) return;

    // Android may select the tapped word as part of its default short-tap
    // handling. Wait until that default action has run, then clear only a
    // selection whose endpoint is inside this trigger. A long press exceeds
    // the threshold above, so intentional text selection remains available.
    if (this.selectionClearTimer) clearTimeout(this.selectionClearTimer);
    this.selectionClearTimer = setTimeout(() => {
      this.selectionClearTimer = undefined;
      const selection = document.getSelection();
      const startsInside = selection?.anchorNode && this.reference.contains(selection.anchorNode);
      const endsInside = selection?.focusNode && this.reference.contains(selection.focusNode);
      if (startsInside || endsInside) selection?.removeAllRanges();
    }, 0);
  }

  private handleContentResize(): void {
    if (!this.state.isMounted) return;
    this.preservedInteractiveRect = this.root.getBoundingClientRect();
    this.clearHideTimers();
    queueMicrotask(() => {
      void this.updatePosition();
    });
  }

  private handlePointerLeave(event: MouseEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && (this.reference.contains(next) || this.root.contains(next))) return;
    this.startPointerBridge();
    if (this.preservedInteractiveRect && this.isWithinRect(
      event.clientX,
      event.clientY,
      this.preservedInteractiveRect,
      this.options.interactiveBorder ?? 2
    )) return;
    this.hide();
  }

  private startPointerBridge(): void {
    this.pointerBridgeCleanup?.();
    const listener = (event: MouseEvent) => {
      if (this.isWithinInteractiveBridge(event.clientX, event.clientY)) {
        if (this.hideTimer) clearTimeout(this.hideTimer);
        this.hideTimer = undefined;
        return;
      }
      this.pointerBridgeCleanup?.();
      this.hide();
    };
    document.addEventListener('mousemove', listener);
    this.pointerBridgeCleanup = () => {
      document.removeEventListener('mousemove', listener);
      this.pointerBridgeCleanup = undefined;
    };
  }

  private isWithinInteractiveBridge(x: number, y: number): boolean {
    if (!this.state.isMounted) return false;
    const referenceRect = this.reference.getBoundingClientRect();
    const tooltipRect = this.root.getBoundingClientRect();
    const preservedRect = this.preservedInteractiveRect;
    const padding = this.options.interactiveBorder ?? 2;
    return x >= Math.min(referenceRect.left, tooltipRect.left, preservedRect?.left ?? Infinity) - padding
      && x <= Math.max(referenceRect.right, tooltipRect.right, preservedRect?.right ?? -Infinity) + padding
      && y >= Math.min(referenceRect.top, tooltipRect.top, preservedRect?.top ?? Infinity) - padding
      && y <= Math.max(referenceRect.bottom, tooltipRect.bottom, preservedRect?.bottom ?? -Infinity) + padding;
  }

  private isWithinRect(x: number, y: number, rect: DOMRect, padding: number): boolean {
    return x >= rect.left - padding
      && x <= rect.right + padding
      && y >= rect.top - padding
      && y <= rect.bottom + padding;
  }

  private handleFocusLeave(): void {
    setTimeout(() => {
      const active = document.activeElement;
      if (active && (this.reference.contains(active) || this.root.contains(active))) return;
      // Clicking non-focusable content (e.g. empty space in the panel) drops focus to the
      // document body instead of moving it to a real control. That is not a deliberate
      // "leave", so keep the panel open; the pointer bridge closes it once the cursor exits.
      if (active === document.body || active === document.documentElement) return;
      this.hide();
    }, 0);
  }

  private listen(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions
  ): void {
    target.addEventListener(type, listener, options);
    this.cleanupListeners.push(() => target.removeEventListener(type, listener, options));
  }

  private clearShowTimer(): void {
    if (this.showTimer) clearTimeout(this.showTimer);
    this.showTimer = undefined;
  }

  private clearHideTimers(): void {
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.hideTimer = undefined;
    this.pointerBridgeCleanup?.();
    // A peer-dismissed tooltip is on its way out for good. Its unmount timer is
    // the ONLY thing that tears the panel down and clears `_peerDismissed`. If
    // we cancelled it here — e.g. because the cursor drifted back over the still
    // animating panel, a nested tooltip re-asserted visibility, or a content
    // resize fired — the tooltip would be stranded in 'closing' with the flag
    // stuck true: it would never unmount and `show()` would ignore hover forever.
    if (this._peerDismissed) return;
    if (this.unmountTimer) clearTimeout(this.unmountTimer);
    this.unmountTimer = undefined;
    if (this.status === 'closing' && this.state.isMounted) {
      this.status = 'open';
      this.state.isShown = true;
      this.state.isVisible = true;
      this.box.dataset.state = 'visible';
      this.content.dataset.state = 'visible';
      this.reference.setAttribute('aria-expanded', 'true');
    }
  }

  private clearAllTimers(): void {
    this.clearShowTimer();
    this.clearHideTimers();
    if (this.shownTimer) clearTimeout(this.shownTimer);
    this.shownTimer = undefined;
    if (this.selectionClearTimer) clearTimeout(this.selectionClearTimer);
    this.selectionClearTimer = undefined;
  }
}

export function createStaticTooltip(
  reference: Element,
  content: string,
  options: Omit<TooltipControllerOptions<unknown>, 'content'>
): TooltipController {
  return new TooltipController(reference, { ...options, content });
}

function scheduleFrame(callback: FrameRequestCallback): void {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(callback);
  } else {
    setTimeout(() => callback(Date.now()), 0);
  }
}
