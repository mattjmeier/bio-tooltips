import type { CoreTooltipConfig, TooltipOptions, TooltipPresentation } from './config.js';
import type { TooltipOpenOptions } from './tooltip-handle.js';
import { startPositioning, type ActivePositioner } from './positioning.js';
import { logTooltipTiming } from './timing.js';
import { generateUniqueTooltipId } from '../utils.js';
import {
  getOpenTopLevelTooltips,
  registerTopLevelTooltip,
  unregisterTopLevelTooltip,
  registerOpenTooltip,
  unregisterOpenTooltip,
} from './tooltip-registry.js';

function isNativeInteractive(element: Element): boolean {
  return element instanceof HTMLButtonElement || element instanceof HTMLAnchorElement
    || element instanceof HTMLInputElement || element instanceof HTMLSelectElement
    || element instanceof HTMLTextAreaElement || element.matches('summary, [contenteditable="true"]');
}

function appendId(value: string | null, id: string): string {
  return value && value.split(/\s+/).includes(id) ? value : `${value ? `${value} ` : ''}${id}`;
}

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
  kind?: 'dialog' | 'tooltip';
  accessibleName?: string;
  /** Presentation for top-level dialogs. Nested tooltips always use popovers. */
  presentation?: TooltipPresentation;
}

interface DrawerPointerGesture {
  pointerId: number;
  startX: number;
  startY: number;
  dragging: boolean;
}

interface PinnedPointerGesture {
  pointerId: number;
  startX: number;
  startY: number;
  originLeft: number;
  originTop: number;
  dragging: boolean;
}

const DRAWER_DRAG_START_DISTANCE = 6;
const DRAWER_DISMISS_DISTANCE = 96;
const PINNED_DRAG_START_DISTANCE = 6;
const PINNED_NUDGE_DISTANCE = 8;
const PINNED_NUDGE_LARGE_DISTANCE = 24;
const PINNED_Z_INDEX_BASE = 11000;
const PINNED_Z_INDEX_LIMIT = 11099;
let nextPinnedZIndex = PINNED_Z_INDEX_BASE;

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
  _entityCacheKey?: string;
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
  _isPointerInside?: boolean;
  private suppressFocusReopen = false;
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
  private readonly originalReferenceTabIndex: string | null;
  private readonly originalReferenceRole: string | null;
  private readonly originalReferenceHaspopup: string | null;
  private readonly originalReferenceControls: string | null;
  private readonly originalReferenceDescribedBy: string | null;
  private readonly kind: 'dialog' | 'tooltip';
  private readonly tooltipId: string;
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
  // Set when the pointer has left but hide() bailed because a nested tooltip
  // was still visible. Cleared by clearHideTimers() (i.e. the user re-hovered).
  // When the last visible child closes, setChildVisible re-evaluates and
  // proceeds with the hide that was deferred.
  private _pendingHide = false;
  private explicitClose = false;
  private presentationSetting: TooltipPresentation;
  private presentation: 'popover' | 'drawer' = 'popover';
  private presentationMediaQuery?: MediaQueryList;
  private readonly drawerHandle: HTMLButtonElement | null;
  private drawerGesture?: DrawerPointerGesture;
  private suppressNextDrawerClick = false;
  private drawerClickResetTimer?: ReturnType<typeof setTimeout>;
  private pinnedPosition?: { left: number; top: number; originalLeft: number; originalTop: number };
  private pinnedGesture?: PinnedPointerGesture;
  private pinnedDragElement?: HTMLElement;
  private pinnedControlsCleanup?: () => void;
  private pinnedViewportCleanup?: () => void;
  private suppressPinnedClick = false;
  private pinnedClickResetTimer?: ReturnType<typeof setTimeout>;

  constructor(reference: Element, options: TooltipControllerOptions<TData>) {
    this.reference = reference;
    this.options = options;
    this.hooks = options.hooks ?? {};
    this.timingConfig = options.timingConfig;
    this.theme = options.theme;
    this.parent = options.parent;
    this.originalAriaExpanded = reference.getAttribute('aria-expanded');
    this.originalReferenceMarker = reference.getAttribute('data-gt-tooltip-reference');
    this.originalReferenceTabIndex = reference.getAttribute('tabindex');
    this.originalReferenceRole = reference.getAttribute('role');
    this.originalReferenceHaspopup = reference.getAttribute('aria-haspopup');
    this.originalReferenceControls = reference.getAttribute('aria-controls');
    this.originalReferenceDescribedBy = reference.getAttribute('aria-describedby');
    this.kind = options.kind ?? 'dialog';
    // Presentation is a top-level dialog concern. Nested and descriptive
    // tooltip controllers always retain their anchored popover behavior.
    this.presentationSetting = this.parent || this.kind !== 'dialog'
      ? 'popover'
      : (options.presentation ?? 'popover');
    this.tooltipId = `gt-tooltip-${generateUniqueTooltipId()}`;

    this.root = document.createElement('div');
    this.root.dataset.gtTooltipRoot = '';
    this.root.style.visibility = 'hidden';

    this.box = document.createElement('div');
    this.box.className = 'gt-tooltip-box';
    this.box.dataset.state = 'hidden';
    this.box.dataset.theme = this.theme;
    this.box.setAttribute('role', this.kind === 'dialog' ? 'dialog' : 'tooltip');
    this.box.id = this.tooltipId;
    if (this.kind === 'dialog') {
      this.box.tabIndex = -1;
      this.box.setAttribute('aria-label', options.accessibleName || reference.textContent?.trim() || 'Details');
    }

    this.content = document.createElement('div');
    this.content.className = 'gt-tooltip-content';
    this.content.dataset.state = 'hidden';
    this.content.innerHTML = options.content ?? '';

    this.drawerHandle = !this.parent && this.kind === 'dialog'
      ? document.createElement('button')
      : null;
    if (this.drawerHandle) {
      this.drawerHandle.type = 'button';
      this.drawerHandle.className = 'gt-close-button gt-drawer-handle';
      this.drawerHandle.setAttribute('aria-label', 'Close');
      this.drawerHandle.hidden = true;
      this.drawerHandle.innerHTML = '<span class="gt-drawer-handle-indicator" aria-hidden="true"></span>';
      this.box.append(this.drawerHandle);
    }

    this.arrow = document.createElement('div');
    this.arrow.className = 'gt-tooltip-arrow';
    this.arrow.setAttribute('aria-hidden', 'true');

    this.box.append(this.content, this.arrow);
    this.root.append(this.box);
    this.initializePresentation();
    this.reference.setAttribute('data-gt-tooltip-reference', '');
    if (this.kind === 'dialog') {
      this.reference.setAttribute('aria-expanded', 'false');
      this.reference.setAttribute('aria-haspopup', 'dialog');
      this.reference.setAttribute('aria-controls', appendId(this.originalReferenceControls, this.tooltipId));
      if (!isNativeInteractive(reference)) {
        if (!reference.hasAttribute('tabindex')) this.reference.setAttribute('tabindex', '0');
        if (!reference.hasAttribute('role')) this.reference.setAttribute('role', 'button');
      }
    } else {
      this.reference.setAttribute('aria-describedby', appendId(this.originalReferenceDescribedBy, this.tooltipId));
    }
    this.installInteractions();
    this.installDrawerHandleInteractions();
  }

  /** The resolved presentation currently used by this controller. */
  isDrawerPresentation(): boolean {
    return this.presentation === 'drawer';
  }

  /** Update the presentation setting, including a live auto breakpoint change. */
  setPresentation(presentation: TooltipPresentation): void {
    if (this.parent || this.kind !== 'dialog') return;
    this.presentationSetting = presentation;
    if (presentation === 'auto') this.ensurePresentationMediaQuery();
    const next = this.resolvePresentation();
    if (next === this.presentation && this.root.dataset.presentation === next) {
      this.syncDrawerHandle();
      return;
    }
    if (next !== 'drawer') this.cancelDrawerGesture();
    if (next === 'drawer' && this._isPinned) {
      const active = document.activeElement;
      if (active instanceof Node && (
        this.root.querySelector('.gt-move-button')?.contains(active)
        || this.root.querySelector('.gt-tooltip-move-menu')?.contains(active)
      )) this.box.focus({ preventScroll: true });
      this.clearPinnedPresentation();
    }
    this.presentation = next;
    this.root.dataset.presentation = next;
    this.syncDrawerHandle();

    this.stopPositioning();
    this.clearPositioningStyles();
    if (next === 'drawer') {
      this.root.style.zIndex = String(this.options.tooltip.zIndex ?? 9999);
      // Pinning is a desktop persistence affordance. A drawer is deliberately
      // non-modal and single-instance, so it cannot become a stacked pin.
      this._isPinned = false;
    } else {
      this.restartPositioning();
    }
    this.syncPinButton();
  }

  show(): void {
    if (this.state.isDestroyed || this.status === 'open' || this.status === 'opening') return;
    // A tooltip dismissed because a peer opened ("only one at a time") must not
    // be revived by a stray mouseenter while its old panel is still under the
    // cursor. The flag is cleared once it is fully unmounted or genuinely
    // reopens, so a deliberate re-hover of its trigger still works.
    if (this._peerDismissed || this.explicitClose) return;
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
    // Only focus INSIDE the panel protects the tooltip: a keyboard user is
    // navigating its content. Focus on the trigger itself (keyboard tab or
    // mouse mousedown) is just a disclosure state and must not pin the panel,
    // or a mouse-opened first tooltip could never be closed by mouse-off.
    if (this._isPinned || this.containsPanelFocus()) return;
    if (this.visibleChildren.size > 0) {
      // The pointer left while a nested tooltip is still animating closed.
      // Remember that we want to hide; setChildVisible(child, false) will
      // re-evaluate once the last child is gone.
      this._pendingHide = true;
      return;
    }
    this._pendingHide = false;
    this.clearShowTimer();
    const delay = Math.max(
      this.options.tooltip.hideDelay ?? 0,
      this.options.interactiveDebounce ?? 0
    );
    this.hideTimer = setTimeout(() => {
      if (!this.containsPanelFocus() && !this._isPinned) this.closeNow();
    }, delay);
  }

  /**
   * Close this tooltip immediately, bypassing the interactive hide debounce and
   * the pointer bridge that otherwise keep an open panel alive while the cursor
   * drifts toward the next trigger. The engine calls this on the open siblings
   * whenever a tooltip opens so only one top-level tooltip is visible at a time.
   * Pinned tooltips are left untouched. Keyboard focus inside an unpinned panel
   * is restored to its trigger as the panel closes, preserving focus while still
   * enforcing the single-open-tooltip rule.
   *
   * The `_peerDismissed` flag marks this close as "lost to a sibling" so that
   * hovering this tooltip's own panel cannot revive it (its panel may still be
   * under the cursor, now covered by the sibling's panel). The flag is cleared
   * once the tooltip is fully unmounted or genuinely reopens.
   */
  dismiss(): void {
    if (this.state.isDestroyed || this.status === 'idle' || this.status === 'closing') return;
    // Drawers cannot be pinned. Popovers remain open only when the user has
    // explicitly pinned them; focus alone must not allow unpinned peers to stack.
    if (!this.isDrawerPresentation() && this._isPinned) return;
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
    if (this.content.contains(document.activeElement) && this.state.isMounted) this.box.focus();
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
    if (options.presentation !== undefined && !this.parent) this.setPresentation(options.presentation);
    if (options.accessibleName && this.kind === 'dialog') this.box.setAttribute('aria-label', options.accessibleName);
    if (this.state.isMounted && !this._isPinned) this.restartPositioning();
    else if (this._isPinned) this.clampPinnedPosition();
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
    if (this.parent || this.kind !== 'dialog' || this.isDrawerPresentation()) {
      this._isPinned = false;
      this.clearPinnedPresentation();
      this.syncPinButton();
      return;
    }
    this._isPinned = pinned;
    if (pinned) {
      this.clearHideTimers();
      if (this.status === 'open' && this.state.isMounted) this.pinAtCurrentPosition();
      else this.show();
    } else {
      this.close();
    }
    this.syncPinButton();
  }

  destroy(): void {
    if (this.state.isDestroyed) return;
    if (this.containsPanelFocus()) this.returnFocus();
    this.cancelDrawerGesture();
    this.clearPinnedPresentation(false);
    if (this.drawerClickResetTimer) clearTimeout(this.drawerClickResetTimer);
    this.drawerClickResetTimer = undefined;
    this.status = 'destroyed';
    this.state.isDestroyed = true;
    this.state.isShown = false;
    this.state.isVisible = false;
    this.state.isMounted = false;
    this.clearAllTimers();
    // clearAllTimers() cancels the unmount timer that would otherwise drop this
    // tooltip from the shared set, so remove it here when it is torn down early.
    unregisterTopLevelTooltip(this);
    unregisterOpenTooltip(this);
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
    restoreAttribute(this.reference, 'tabindex', this.originalReferenceTabIndex);
    restoreAttribute(this.reference, 'role', this.originalReferenceRole);
    restoreAttribute(this.reference, 'aria-haspopup', this.originalReferenceHaspopup);
    restoreAttribute(this.reference, 'aria-controls', this.originalReferenceControls);
    restoreAttribute(this.reference, 'aria-describedby', this.originalReferenceDescribedBy);
  }

  /** Open immediately, optionally moving focus into the dialog. */
  open(options: TooltipOpenOptions = {}): void {
    if (this.state.isDestroyed) return;
    this.explicitClose = false;
    this._peerDismissed = false;
    this.clearHideTimers();
    this.clearShowTimer();
    if (this.status === 'open') {
      this.makeVisible();
      if (options.focus) this.box.focus();
      return;
    }
    this.status = 'opening';
    this.openNow(options.focus ?? false);
  }

  /** Explicitly enter a dialog from keyboard activation. */
  enter(): void {
    if (this.kind !== 'dialog' || this.state.isDestroyed) return;
    this.open({ focus: true });
  }

  /** Explicitly dismiss this controller, including pinned dialogs. */
  close(): void {
    if (this.kind === 'dialog' && this.containsPanelFocus()) this.returnFocus();
    this.explicitClose = true;
    this.clearShowTimer();
    this.clearHideTimers();
    this._isPinned = false;
    this.clearPinnedPresentation(false);
    this._pinButton?.classList.remove('gt-pin-active');
    this._pinButton?.setAttribute('aria-label', 'Pin tooltip in place');
    this._pinButton?.setAttribute('aria-pressed', 'false');
    this.closeNow();
  }

  private openNow(focusDialog = false): void {
    if (this.state.isDestroyed || this.status !== 'opening') return;
    this.showTimer = undefined;
    if (this.hooks.onShow?.(this) === false) {
      this.status = 'idle';
      return;
    }

    const duration = this.options.tooltip.showDuration ?? 300;
    this.box.style.setProperty('--gt-show-duration', `${duration}ms`);
    this.root.removeAttribute('inert');
    this.mount();
    this.status = 'open';
    this._peerDismissed = false;
    this.state.isShown = true;
    if (this._isPinned) this.pinAtCurrentPosition();
    // Top-level only: nested tooltips carry a parent and are dismissed with
    // theirs, so they never participate in the cross-engine "one at a time" set.
    if (!this.parent) registerTopLevelTooltip(this);
    else registerOpenTooltip(this);
    if (this.timingConfig) {
      logTooltipTiming(this, this.timingConfig, 'opened (mounted)', {
        status: this.status,
        isMounted: this.state.isMounted,
      });
    }
    if (this.kind === 'dialog') this.reference.setAttribute('aria-expanded', 'true');
    if (focusDialog && this.kind === 'dialog') {
      this.makeVisible();
      this.box.focus();
    }
    this.parent?.setChildVisible(this, true);

    scheduleFrame(() => {
      if (!this.state.isMounted || this.state.isDestroyed || this.status !== 'open') return;
      this.makeVisible();
    });

    this.shownTimer = setTimeout(() => {
      this.shownTimer = undefined;
      if (this.status === 'open') this.hooks.onShown?.(this);
    }, duration);
  }

  private closeNow(): void {
    if (this.state.isDestroyed || (this.status !== 'open' && this.status !== 'opening')) return;
    this.cancelDrawerGesture();
    this.hideTimer = undefined;
    const restoreFocus = this.kind === 'dialog' && this.containsPanelFocus();
    if (restoreFocus) this.returnFocus();
    if (this.hooks.onHide?.(this) === false) return;

    this.destroyNestedTooltips();
    this.root.setAttribute('inert', '');
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
    if (this.kind === 'dialog') this.reference.setAttribute('aria-expanded', 'false');
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
      unregisterOpenTooltip(this);
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
    this._isPointerInside = false;
    this.cancelPinnedGesture();
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
    if (!this.state.isMounted || this.isDrawerPresentation() || this._isPinned) return;
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

  private clearPositioningStyles(): void {
    this.root.style.removeProperty('position');
    this.root.style.removeProperty('z-index');
    this.root.style.removeProperty('left');
    this.root.style.removeProperty('top');
    this.root.style.removeProperty('right');
    this.root.style.removeProperty('bottom');
    this.root.style.removeProperty('width');
    this.root.style.removeProperty('max-width');
    this.box.style.removeProperty('width');
    this.box.style.removeProperty('max-width');
    this.content.style.removeProperty('max-height');
    this.content.style.removeProperty('--gt-available-width');
    this.content.style.removeProperty('--gt-available-height');
    this.arrow.style.cssText = '';
  }

  private isPinnedPopover(): boolean {
    return Boolean(this._isPinned) && !this.parent && this.kind === 'dialog' && !this.isDrawerPresentation();
  }

  private currentViewport(): { left: number; top: number; width: number; height: number } {
    const viewport = window.visualViewport;
    return {
      left: viewport?.offsetLeft ?? 0,
      top: viewport?.offsetTop ?? 0,
      width: viewport?.width ?? window.innerWidth,
      height: viewport?.height ?? window.innerHeight,
    };
  }

  private clampPinnedCoordinates(left: number, top: number): { left: number; top: number } {
    const padding = this.options.tooltip.viewportPadding ?? 8;
    const viewport = this.currentViewport();
    const rect = this.root.getBoundingClientRect();
    const width = Math.max(0, rect.width);
    const height = Math.max(0, rect.height);
    const minLeft = viewport.left + padding;
    const minTop = viewport.top + padding;
    const maxLeft = Math.max(minLeft, viewport.left + viewport.width - width - padding);
    const maxTop = Math.max(minTop, viewport.top + viewport.height - height - padding);
    return {
      left: Math.min(maxLeft, Math.max(minLeft, left)),
      top: Math.min(maxTop, Math.max(minTop, top)),
    };
  }

  private pinAtCurrentPosition(): void {
    if (!this.isPinnedPopover() || !this.state.isMounted || this.status !== 'open') return;
    if (this.pinnedPosition) {
      this.applyPinnedPosition(this.pinnedPosition.left, this.pinnedPosition.top);
      return;
    }

    const rect = this.root.getBoundingClientRect();
    const styledLeft = Number.parseFloat(this.root.style.left);
    const styledTop = Number.parseFloat(this.root.style.top);
    const left = Number.isFinite(rect.left) && (rect.width || rect.height || rect.left || rect.top)
      ? rect.left
      : (Number.isFinite(styledLeft) ? styledLeft : 0);
    const top = Number.isFinite(rect.top) && (rect.width || rect.height || rect.left || rect.top)
      ? rect.top
      : (Number.isFinite(styledTop) ? styledTop : 0);
    const clamped = this.clampPinnedCoordinates(left, top);
    this.pinnedPosition = { ...clamped, originalLeft: clamped.left, originalTop: clamped.top };
    this.stopPositioning();
    this.root.style.position = 'fixed';
    this.root.style.right = 'auto';
    this.root.style.bottom = 'auto';
    this.root.dataset.pinned = 'true';
    this.arrow.hidden = true;
    this.bringPinnedToFront();
    this.applyPinnedPosition(clamped.left, clamped.top);
    this.installPinnedViewportListener();
    this.ensurePinnedControls();
  }

  private applyPinnedPosition(left: number, top: number): void {
    if (!this.pinnedPosition) return;
    const clamped = this.clampPinnedCoordinates(left, top);
    this.pinnedPosition.left = clamped.left;
    this.pinnedPosition.top = clamped.top;
    this.root.style.left = `${clamped.left}px`;
    this.root.style.top = `${clamped.top}px`;
  }

  private clampPinnedPosition(): void {
    if (!this.isPinnedPopover() || !this.pinnedPosition) return;
    this.applyPinnedPosition(this.pinnedPosition.left, this.pinnedPosition.top);
  }

  private clearPinnedPresentation(restartAnchored = true): void {
    const wasPinned = Boolean(this.pinnedPosition) || this.root.dataset.pinned === 'true';
    this.cancelPinnedGesture();
    if (this.pinnedClickResetTimer) clearTimeout(this.pinnedClickResetTimer);
    this.pinnedClickResetTimer = undefined;
    this.suppressPinnedClick = false;
    this.pinnedViewportCleanup?.();
    this.pinnedViewportCleanup = undefined;
    this.pinnedPosition = undefined;
    this.root.removeAttribute('data-pinned');
    this.root.removeAttribute('data-pinned-dragging');
    this.root.style.removeProperty('user-select');
    this.arrow.hidden = false;
    this.pinnedControlsCleanup?.();
    this.pinnedControlsCleanup = undefined;
    if (restartAnchored && wasPinned && this.state.isMounted && !this.isDrawerPresentation()) {
      this.restartPositioning();
    }
  }

  private bringPinnedToFront(): void {
    if (!this.isPinnedPopover()) return;
    if (nextPinnedZIndex > PINNED_Z_INDEX_LIMIT) {
      let zIndex = PINNED_Z_INDEX_BASE;
      for (const controller of getOpenTopLevelTooltips()) {
        if (controller === this || controller.root.dataset.pinned !== 'true') continue;
        controller.root.style.zIndex = String(Math.min(zIndex, PINNED_Z_INDEX_LIMIT - 1));
        zIndex += 1;
      }
      nextPinnedZIndex = Math.min(zIndex, PINNED_Z_INDEX_LIMIT);
    }
    this.root.style.zIndex = String(nextPinnedZIndex);
    nextPinnedZIndex += 1;
  }

  private installPinnedViewportListener(): void {
    if (this.pinnedViewportCleanup) return;
    const resize = () => this.clampPinnedPosition();
    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', resize);
    window.addEventListener('resize', resize);
    this.pinnedViewportCleanup = () => {
      viewport?.removeEventListener('resize', resize);
      window.removeEventListener('resize', resize);
    };
  }

  private initializePresentation(): void {
    this.root.dataset.presentation = this.presentation;
    if (this.parent || this.kind !== 'dialog') return;
    this.setPresentation(this.presentationSetting);
  }

  private ensurePresentationMediaQuery(): void {
    if (this.presentationMediaQuery || typeof window === 'undefined') return;
    const matchMedia = window.matchMedia;
    if (typeof matchMedia !== 'function') return;

    const mediaQuery = matchMedia('(max-width: 600px)');
    const update = () => {
      // The listener can outlive a runtime switch from auto to a forced mode.
      // Do not let a later viewport change overwrite that explicit choice.
      if (this.presentationSetting === 'auto') this.setPresentation('auto');
    };
    this.presentationMediaQuery = mediaQuery;
    if (typeof mediaQuery.addEventListener === 'function'
      && typeof mediaQuery.removeEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      this.cleanupListeners.push(() => mediaQuery.removeEventListener('change', update));
    } else if (typeof mediaQuery.addListener === 'function' && typeof mediaQuery.removeListener === 'function') {
      mediaQuery.addListener(update);
      this.cleanupListeners.push(() => mediaQuery.removeListener(update));
    }
  }

  private resolvePresentation(): 'popover' | 'drawer' {
    if (this.presentationSetting === 'drawer') return 'drawer';
    if (this.presentationSetting === 'popover') return 'popover';
    return this.presentationMediaQuery?.matches ? 'drawer' : 'popover';
  }

  private syncDrawerHandle(): void {
    if (this.drawerHandle) this.drawerHandle.hidden = !this.isDrawerPresentation();
  }

  private installDrawerHandleInteractions(): void {
    const handle = this.drawerHandle;
    if (!handle) return;

    this.listen(handle, 'pointerdown', event => this.handleDrawerPointerDown(event as PointerEvent));
    this.listen(handle, 'pointermove', event => this.handleDrawerPointerMove(event as PointerEvent));
    this.listen(handle, 'pointerup', event => this.handleDrawerPointerUp(event as PointerEvent));
    this.listen(handle, 'pointercancel', event => this.handleDrawerPointerCancel(event as PointerEvent));
    this.listen(handle, 'lostpointercapture', () => this.cancelDrawerGesture());
    this.listen(handle, 'click', event => this.handleDrawerClick(event as MouseEvent));
  }

  private handleDrawerPointerDown(event: PointerEvent): void {
    if (!this.isDrawerPresentation() || this.status !== 'open' || !this.state.isVisible
      || !event.isPrimary || event.button !== 0) return;

    this.drawerGesture = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
    };

    if (typeof this.drawerHandle?.setPointerCapture === 'function') {
      try {
        this.drawerHandle.setPointerCapture(event.pointerId);
      } catch {
        // The window listeners still track the gesture if capture is unavailable.
      }
    }
  }

  private handleDrawerPointerMove(event: PointerEvent): void {
    const gesture = this.drawerGesture;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;
    if (Math.abs(deltaX) >= DRAWER_DRAG_START_DISTANCE && Math.abs(deltaX) > Math.max(0, deltaY)) {
      this.cancelDrawerGesture();
      return;
    }

    const downwardDistance = Math.max(0, deltaY);
    if (!gesture.dragging && downwardDistance < DRAWER_DRAG_START_DISTANCE) return;

    gesture.dragging = true;
    this.box.dataset.drawerDragging = 'true';
    this.box.style.setProperty('--gt-drawer-drag-y', `${downwardDistance}px`);
  }

  private handleDrawerPointerUp(event: PointerEvent): void {
    const gesture = this.drawerGesture;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const shouldDismiss = gesture.dragging
      && event.clientY - gesture.startY >= DRAWER_DISMISS_DISTANCE;
    if (gesture.dragging) {
      this.suppressNextDrawerClick = true;
      this.drawerClickResetTimer = setTimeout(() => {
        this.suppressNextDrawerClick = false;
        this.drawerClickResetTimer = undefined;
      }, 0);
    }
    this.cancelDrawerGesture();
    if (shouldDismiss) this.close();
  }

  private handleDrawerClick(event: MouseEvent): void {
    // Pointer drags ending on the handle also synthesize a click. Ignore that
    // one event so a short drag can snap back without acting like a tap.
    if (!this.suppressNextDrawerClick || event.detail === 0) return;
    this.suppressNextDrawerClick = false;
    if (this.drawerClickResetTimer) clearTimeout(this.drawerClickResetTimer);
    this.drawerClickResetTimer = undefined;
    event.preventDefault();
    event.stopPropagation();
  }

  private handleDrawerPointerCancel(event: PointerEvent): void {
    if (this.drawerGesture?.pointerId === event.pointerId) this.cancelDrawerGesture();
  }

  private cancelDrawerGesture(): void {
    const pointerId = this.drawerGesture?.pointerId;
    this.drawerGesture = undefined;
    this.box.removeAttribute('data-drawer-dragging');
    this.box.style.removeProperty('--gt-drawer-drag-y');

    if (pointerId !== undefined && this.drawerHandle
      && typeof this.drawerHandle.hasPointerCapture === 'function'
      && this.drawerHandle.hasPointerCapture(pointerId)) {
      try {
        this.drawerHandle.releasePointerCapture(pointerId);
      } catch {
        // Capture may already have been released by a pointer cancellation.
      }
    }
  }

  /** Synchronize a rendered pin control with the controller's current state. */
  syncPinButton(): void {
    if (!this._pinButton) return;
    const drawer = this.isDrawerPresentation();
    const pinned = Boolean(this._isPinned) && !drawer;
    this._pinButton.hidden = drawer;
    if (drawer) this._pinButton.setAttribute('disabled', '');
    else this._pinButton.removeAttribute('disabled');
    this._pinButton.setAttribute('aria-hidden', String(drawer));
    this._pinButton.setAttribute('aria-pressed', String(pinned));
    this._pinButton.classList.toggle('gt-pin-active', pinned);
    this._pinButton.setAttribute('aria-label', pinned ? 'Unpin and close tooltip' : 'Pin tooltip in place');
    if (pinned) this.ensurePinnedControls();
    else {
      this.pinnedControlsCleanup?.();
      this.pinnedControlsCleanup = undefined;
    }
  }

  private ensurePinnedControls(): void {
    if (!this.isPinnedPopover()) return;
    const header = this.root.querySelector<HTMLElement>('.gene-tooltip-header');
    if (!header) return;
    if (this.pinnedControlsCleanup && this.pinnedDragElement === header) return;
    this.cancelPinnedGesture();
    this.pinnedControlsCleanup?.();
    this.pinnedControlsCleanup = undefined;

    let actions = header.querySelector<HTMLElement>('.gt-tooltip-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'gt-tooltip-actions';
      header.append(actions);
    }

    const controls = document.createElement('div');
    controls.className = 'gt-tooltip-move-controls';
    const move = document.createElement('button');
    move.type = 'button';
    move.className = 'gt-move-button';
    move.setAttribute('aria-label', 'Move tooltip');
    move.setAttribute('title', 'Move tooltip');
    const menuId = `${this.tooltipId}-move-options`;
    move.setAttribute('aria-controls', menuId);
    move.innerHTML = '<svg class="gt-move-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM15.854 7.646a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5a.5.5 0 0 1 0-1h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708zM8.354 15.854a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z"/></svg>';

    const menu = document.createElement('div');
    menu.className = 'gt-tooltip-move-menu';
    menu.id = menuId;
    menu.hidden = true;
    menu.setAttribute('role', 'group');
    menu.setAttribute('aria-label', 'Tooltip positions');
    const presets = [
      ['top-left', 'Move tooltip to top left', 'Top left'],
      ['top-right', 'Move tooltip to top right', 'Top right'],
      ['bottom-left', 'Move tooltip to bottom left', 'Bottom left'],
      ['bottom-right', 'Move tooltip to bottom right', 'Bottom right'],
      ['reset', 'Reset tooltip position', 'Reset'],
    ] as const;
    const presetButtons: HTMLButtonElement[] = [];
    for (const [preset, label, text] of presets) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gt-tooltip-move-option';
      button.dataset.position = preset;
      button.setAttribute('aria-label', label);
      button.textContent = text;
      menu.append(button);
      presetButtons.push(button);
    }
    const status = document.createElement('span');
    status.className = 'gt-tooltip-move-status gt-sr-only';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    controls.append(move, menu, status);
    actions.insertBefore(controls, actions.firstElementChild);
    const moveHeader = header;
    const onMoveClick = (event: MouseEvent) => {
      event.stopPropagation();
      menu.hidden = !menu.hidden;
      move.setAttribute('aria-expanded', String(!menu.hidden));
    };
    const onMoveKeydown = (event: KeyboardEvent) => {
      if (!this.isPinnedPopover()) return;
      const distances = event.shiftKey ? PINNED_NUDGE_LARGE_DISTANCE : PINNED_NUDGE_DISTANCE;
      const deltas: Record<string, [number, number]> = {
        ArrowLeft: [-distances, 0], ArrowRight: [distances, 0],
        ArrowUp: [0, -distances], ArrowDown: [0, distances],
      };
      const delta = deltas[event.key];
      if (!delta) return;
      event.preventDefault();
      event.stopPropagation();
      this.movePinnedBy(delta[0], delta[1], true);
    };
    const onPresetClick = (event: Event) => {
      const target = event.currentTarget as HTMLButtonElement;
      this.movePinnedToPreset(target.dataset.position ?? 'reset');
      menu.hidden = true;
      move.setAttribute('aria-expanded', 'false');
    };
    move.setAttribute('aria-expanded', 'false');
    move.addEventListener('click', onMoveClick);
    move.addEventListener('keydown', onMoveKeydown);
    presetButtons.forEach(button => button.addEventListener('click', onPresetClick));
    this.pinnedDragElement = moveHeader;
    const dragCleanup = this.installPinnedHeaderInteractions(moveHeader);
    this.pinnedControlsCleanup = () => {
      move.removeEventListener('click', onMoveClick);
      move.removeEventListener('keydown', onMoveKeydown);
      presetButtons.forEach(button => button.removeEventListener('click', onPresetClick));
      dragCleanup();
      move.remove();
      menu.remove();
      status.remove();
      controls.remove();
      this.pinnedDragElement = undefined;
    };
  }

  private installPinnedHeaderInteractions(header: HTMLElement): () => void {
    const onPointerDown = (event: PointerEvent) => this.handlePinnedPointerDown(event, header);
    const onPointerMove = (event: PointerEvent) => this.handlePinnedPointerMove(event);
    const onPointerUp = (event: PointerEvent) => this.handlePinnedPointerUp(event);
    const onPointerCancel = (event: PointerEvent) => this.handlePinnedPointerCancel(event);
    const onLostPointerCapture = (event: PointerEvent) => this.handlePinnedPointerCancel(event);
    header.addEventListener('pointerdown', onPointerDown as EventListener);
    header.addEventListener('pointermove', onPointerMove as EventListener);
    header.addEventListener('pointerup', onPointerUp as EventListener);
    header.addEventListener('pointercancel', onPointerCancel as EventListener);
    header.addEventListener('lostpointercapture', onLostPointerCapture as EventListener);
    return () => {
      header.removeEventListener('pointerdown', onPointerDown as EventListener);
      header.removeEventListener('pointermove', onPointerMove as EventListener);
      header.removeEventListener('pointerup', onPointerUp as EventListener);
      header.removeEventListener('pointercancel', onPointerCancel as EventListener);
      header.removeEventListener('lostpointercapture', onLostPointerCapture as EventListener);
    };
  }

  private handlePinnedPointerDown(event: PointerEvent, header: HTMLElement): void {
    if (!this.isPinnedPopover() || this.status !== 'open' || !event.isPrimary || event.button !== 0) return;
    const target = event.target;
    if (!(target instanceof Element) || !header.contains(target)
      || target.closest('button, a, input, select, textarea, summary, [contenteditable="true"]')) return;
    this.bringPinnedToFront();
    const left = this.pinnedPosition?.left ?? (Number.parseFloat(this.root.style.left) || 0);
    const top = this.pinnedPosition?.top ?? (Number.parseFloat(this.root.style.top) || 0);
    this.pinnedGesture = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originLeft: left,
      originTop: top,
      dragging: false,
    };
    try {
      header.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is not available in a few test/embedded DOMs.
    }
  }

  private handlePinnedPointerMove(event: PointerEvent): void {
    const gesture = this.pinnedGesture;
    if (!gesture || gesture.pointerId !== event.pointerId || !this.isPinnedPopover()) return;
    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;
    if (!gesture.dragging && Math.hypot(deltaX, deltaY) < PINNED_DRAG_START_DISTANCE) return;
    gesture.dragging = true;
    event.preventDefault();
    this.root.dataset.pinnedDragging = 'true';
    this.root.style.userSelect = 'none';
    this.movePinnedTo(gesture.originLeft + deltaX, gesture.originTop + deltaY, false);
  }

  private handlePinnedPointerUp(event: PointerEvent): void {
    const gesture = this.pinnedGesture;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const wasDragging = gesture.dragging;
    this.cancelPinnedGesture();
    if (wasDragging) {
      this.suppressPinnedClick = true;
      this.pinnedClickResetTimer = setTimeout(() => {
        this.suppressPinnedClick = false;
        this.pinnedClickResetTimer = undefined;
      }, 0);
    }
  }

  private handlePinnedPointerCancel(event: PointerEvent): void {
    const gesture = this.pinnedGesture;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    this.cancelPinnedGesture();
    this.movePinnedTo(gesture.originLeft, gesture.originTop, false);
  }

  private cancelPinnedGesture(): void {
    const pointerId = this.pinnedGesture?.pointerId;
    const element = this.pinnedDragElement;
    this.pinnedGesture = undefined;
    this.root.removeAttribute('data-pinned-dragging');
    this.root.style.removeProperty('user-select');
    if (pointerId !== undefined && element?.hasPointerCapture?.(pointerId)) {
      try {
        element.releasePointerCapture(pointerId);
      } catch {
        // Capture may already have been released by cancellation.
      }
    }
  }

  private movePinnedBy(deltaX: number, deltaY: number, announce: boolean): void {
    if (!this.pinnedPosition) return;
    this.movePinnedTo(this.pinnedPosition.left + deltaX, this.pinnedPosition.top + deltaY, announce);
  }

  private movePinnedTo(left: number, top: number, announce: boolean): void {
    if (!this.isPinnedPopover() || !this.pinnedPosition) return;
    this.applyPinnedPosition(left, top);
    if (announce) this.announcePinnedMovement();
  }

  private movePinnedToPreset(preset: string): void {
    if (!this.isPinnedPopover() || !this.pinnedPosition) return;
    const padding = this.options.tooltip.viewportPadding ?? 8;
    const viewport = this.currentViewport();
    const rect = this.root.getBoundingClientRect();
    const width = Math.max(0, rect.width);
    const height = Math.max(0, rect.height);
    const right = viewport.left + viewport.width - width - padding;
    const bottom = viewport.top + viewport.height - height - padding;
    const positions: Record<string, [number, number]> = {
      'top-left': [viewport.left + padding, viewport.top + padding],
      'top-right': [right, viewport.top + padding],
      'bottom-left': [viewport.left + padding, bottom],
      'bottom-right': [right, bottom],
      reset: [this.pinnedPosition.originalLeft, this.pinnedPosition.originalTop],
    };
    const target = positions[preset] ?? positions.reset;
    this.movePinnedTo(target[0], target[1], true);
  }

  private announcePinnedMovement(): void {
    const status = this.root.querySelector<HTMLElement>('.gt-tooltip-move-status');
    if (!status || !this.pinnedPosition) return;
    status.textContent = `Tooltip moved to ${Math.round(this.pinnedPosition.left)}, ${Math.round(this.pinnedPosition.top)}.`;
  }

  private setChildVisible(child: TooltipController<any>, visible: boolean): void {
    if (visible) {
      // A parent tooltip owns at most one visible child. Dismiss the previous
      // child before recording the new one so scrubbing across nested triggers
      // (for example, adjacent exons) cannot accumulate tooltip panels.
      for (const visibleChild of this.visibleChildren) {
        if (visibleChild !== child) visibleChild.dismiss();
      }
      this.visibleChildren.add(child);
      this.clearHideTimers();
    } else {
      this.visibleChildren.delete(child);
      // The pointer left while this child was still visible; hide() set
      // _pendingHide and bailed. Now that the last child is gone, proceed.
      if (this._pendingHide && this.visibleChildren.size === 0) {
        this.hide();
      }
    }
  }

  private installInteractions(): void {
    this.listen(this.reference, 'mouseenter', () => {
      this._isPointerInside = true;
      this.explicitClose = false;
      this.clearHideTimers();
      this.show();
    });
    this.listen(this.reference, 'mouseleave', (event: Event) => this.handlePointerLeave(event as MouseEvent));
    this.listen(this.reference, 'focus', () => {
      if (this.suppressFocusReopen) {
        this.suppressFocusReopen = false;
        return;
      }
      this.explicitClose = false;
      this.clearHideTimers();
      this.show();
    });
    this.listen(this.reference, 'click', (event: Event) => {
      if (this.kind !== 'dialog') return;
      // Mouse clicks (detail > 0) open the panel without stealing keyboard
      // focus into it; keyboard activation (Enter/Space dispatch click with
      // detail 0) still focuses the dialog so keyboard users land inside it.
      if ((event as MouseEvent).detail > 0) this.show();
      else if (isNativeButton(this.reference) || !isNativeInteractive(this.reference)) this.enter();
      else this.show();
    });
    this.listen(this.reference, 'blur', () => this.handleFocusLeave());
    this.listen(this.reference, 'touchstart', () => {
      this.touchStartedAt = Date.now();
      this.explicitClose = false;
      this.show();
    }, { passive: true });
    this.listen(this.reference, 'touchend', () => this.handleTouchEnd(), { passive: true });
    this.listen(this.reference, 'touchcancel', () => {
      this.touchStartedAt = undefined;
    }, { passive: true });
    this.listen(this.reference, 'keydown', (event: Event) => this.handleReferenceKeydown(event as KeyboardEvent));
    this.listen(this.root, 'mouseenter', () => {
      this._isPointerInside = true;
      this.preservedInteractiveRect = undefined;
      this.clearHideTimers();
    });
    this.listen(this.root, 'mouseleave', (event: Event) => this.handlePointerLeave(event as MouseEvent));
    this.listen(this.root, 'focusin', () => {
      this.bringPinnedToFront();
      this.clearHideTimers();
    });
    this.listen(this.root, 'pointerdown', () => this.bringPinnedToFront());
    this.listen(this.root, 'click', (event: Event) => {
      if (!this.suppressPinnedClick) return;
      this.suppressPinnedClick = false;
      if (this.pinnedClickResetTimer) clearTimeout(this.pinnedClickResetTimer);
      this.pinnedClickResetTimer = undefined;
      event.preventDefault();
      event.stopPropagation();
    }, { capture: true });
    this.listen(this.root, 'focusout', () => this.handleFocusLeave());
    this.listen(this.root, 'keydown', (event: Event) => {
      if (!event.defaultPrevented) this.handlePanelKeydown(event as KeyboardEvent);
    });
    this.listen(this.root, 'gt:content-resize', () => this.handleContentResize());
    this.listen(document, 'click', (event: Event) => {
      if (!this.state.isMounted || this.status !== 'open' || this._isPinned) return;
      const target = event.target;
      if (target instanceof Node && (this.root.contains(target) || this.reference.contains(target))) return;
      this.close();
    }, { capture: true });
  }

  private makeVisible(): void {
    this.root.removeAttribute('inert');
    this.root.style.visibility = 'visible';
    this.box.dataset.state = 'visible';
    this.content.dataset.state = 'visible';
    this.state.isVisible = true;
  }

  hasFocus(): boolean {
    const active = document.activeElement;
    return this.reference.contains(active) || this.root.contains(active)
      || [...this.visibleChildren].some(child => child.hasFocus());
  }

  private containsPanelFocus(): boolean {
    return this.root.contains(document.activeElement)
      || [...this.visibleChildren].some(child => child.containsPanelFocus());
  }

  private returnFocus(): void {
    if (!this.reference.isConnected) return;
    this.suppressFocusReopen = true;
    (this.reference as HTMLElement).focus({ preventScroll: true });
    this.suppressFocusReopen = false;
  }

  private handleReferenceKeydown(event: KeyboardEvent): void {
    if (event.defaultPrevented || event.target !== this.reference || this.kind !== 'dialog') return;
    const isLink = this.reference.matches('a[href]');
    if (event.key === 'ArrowDown' && isLink) {
      event.preventDefault();
      this.enter();
    } else if ((event.key === 'Enter' || event.key === ' ')
      && this.reference.getAttribute('role') === 'button'
      && !(this.reference instanceof HTMLButtonElement)) {
      event.preventDefault();
      this.enter();
    }
    // Native buttons activate through their click event, avoiding double handling.
  }

  private nextAfterReference(): HTMLElement | undefined {
    const scope = this.parent?.root ?? document.body;
    const focusables = getFocusable(scope).filter(element =>
      element.closest('[data-gt-tooltip-root]') === (this.parent?.root ?? null));
    const index = focusables.indexOf(this.reference as HTMLElement);
    const next = index < 0 ? focusables.find(element =>
      Boolean(this.reference.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING))
      : focusables[index + 1];
    return next ?? this.parent?.nextAfterReference();
  }

  private handlePanelKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || this.kind !== 'dialog' || event.defaultPrevented) return;
    if (!(event.target instanceof Element)
      || event.target.closest('[data-gt-tooltip-root]') !== this.root) return;
    const focusables = getFocusable(this.root).filter(element =>
      element.closest('[data-gt-tooltip-root]') === this.root);
    const active = document.activeElement;
    if (event.shiftKey && (active === this.box || active === focusables[0])) {
      event.preventDefault();
      this.returnFocus();
    } else if (!event.shiftKey && (active === focusables[focusables.length - 1]
      || (focusables.length === 0 && active === this.box))) {
      const next = this.nextAfterReference();
      if (next) {
        event.preventDefault();
        next.focus();
      } else {
        // At the page boundary, remove this portal from sequential navigation
        // and let the browser continue from the trigger to its own chrome.
        this.close();
        (this.reference as HTMLElement).focus();
      }
    }
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
    if (this.isPinnedPopover()) {
      this.clampPinnedPosition();
      return;
    }
    this.preservedInteractiveRect = this.root.getBoundingClientRect();
    this.clearHideTimers();
    queueMicrotask(() => {
      void this.updatePosition();
    });
  }

  private handlePointerLeave(event: MouseEvent): void {
    if (this.isDrawerPresentation()) return;
    const next = event.relatedTarget;
    if (next instanceof Node && (this.reference.contains(next) || this.root.contains(next))) return;
    this._isPointerInside = false;
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
        this._pendingHide = false;
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
    if (this.isDrawerPresentation()) return;
    setTimeout(() => {
      const active = document.activeElement;
      if (this.hasFocus() || this._isPointerInside) return;
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
    this._pendingHide = false;
    // A peer-dismissed tooltip is on its way out for good. Its unmount timer is
    // the ONLY thing that tears the panel down and clears `_peerDismissed`. If
    // we cancelled it here — e.g. because the cursor drifted back over the still
    // animating panel, a nested tooltip re-asserted visibility, or a content
    // resize fired — the tooltip would be stranded in 'closing' with the flag
    // stuck true: it would never unmount and `show()` would ignore hover forever.
    if (this._peerDismissed || this.explicitClose) return;
    if (this.unmountTimer) clearTimeout(this.unmountTimer);
    this.unmountTimer = undefined;
    if (!this.explicitClose && this.status === 'closing' && this.state.isMounted) {
      this.status = 'open';
      this.root.removeAttribute('inert');
      this.state.isShown = true;
      this.state.isVisible = true;
      this.box.dataset.state = 'visible';
      this.content.dataset.state = 'visible';
      if (this.kind === 'dialog') this.reference.setAttribute('aria-expanded', 'true');
    }
  }

  private clearAllTimers(): void {
    this.clearShowTimer();
    this.clearHideTimers();
    if (this.unmountTimer) clearTimeout(this.unmountTimer);
    this.unmountTimer = undefined;
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
  return new TooltipController(reference, { ...options, content, kind: options.kind ?? 'tooltip' });
}

function isNativeButton(element: Element): boolean {
  return element instanceof HTMLButtonElement || element.getAttribute('role') === 'button';
}

function restoreAttribute(element: Element, name: string, value: string | null): void {
  if (value == null) element.removeAttribute(name);
  else element.setAttribute(name, value);
}

function getFocusable(root: Element): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(
    'a[href],button,input,select,textarea,summary,[tabindex],[contenteditable="true"]'
  )).filter(element => {
    if (element.matches(':disabled, input[type="hidden"]') || element.tabIndex < 0
      || element.closest('[hidden], [inert]')) return false;
    for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      if (ancestor instanceof HTMLDetailsElement && !ancestor.open
        && !ancestor.querySelector(':scope > summary')?.contains(element)) return false;
    }
    return true;
  }).sort((a, b) => (a.tabIndex || Infinity) - (b.tabIndex || Infinity));
}

function scheduleFrame(callback: FrameRequestCallback): void {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(callback);
  } else {
    setTimeout(() => callback(Date.now()), 0);
  }
}
