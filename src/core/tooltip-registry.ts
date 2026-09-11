import type { TooltipController } from './tooltip-controller.js';

/**
 * Tracks every top-level tooltip that is currently open across ALL tooltip
 * engines on the page.
 *
 * The "only one top-level tooltip at a time" rule must be able to dismiss a
 * tooltip owned by a *different* engine than the one opening — for example, in
 * the docs site each demo calls `init()` with its own selector, so a per-engine
 * `instances` array can never see a sibling from another demo. This shared set
 * is what lets the rule span engines.
 *
 * Only top-level tooltips are registered (nested tooltips carry a `parent` and
 * are owned by, and destroyed with, their parent). Entries are added when a
 * tooltip opens and removed when it unmounts or is destroyed.
 */
const openTopLevelTooltips = new Set<TooltipController<any>>();
const openTooltips = new Set<TooltipController<any>>();
let escapeInstalled = false;
const escapeHandler = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    const active = document.activeElement;
    const candidates = [...openTooltips].filter(instance =>
      !instance.state.isDestroyed && instance.status === 'open'
      && (instance.root.contains(active) || instance.reference.contains(active)
        || instance._isPinned || instance._isPointerInside)
    );
    const target = candidates.reduce<TooltipController<any> | undefined>((deepest, candidate) => {
      if (!deepest) return candidate;
      if (deepest.root.contains(candidate.root)) return candidate;
      if (candidate.root.contains(deepest.root)) return deepest;
      return candidate;
    }, undefined);
    if (target) {
      event.preventDefault();
      event.stopPropagation();
      target.close();
    }
};

function installEscapeDispatcher(): void {
  if (escapeInstalled || typeof document === 'undefined') return;
  escapeInstalled = true;
  document.addEventListener('keydown', escapeHandler);
}

export function registerTopLevelTooltip(instance: TooltipController<any>): void {
  openTopLevelTooltips.add(instance);
  openTooltips.add(instance);
  installEscapeDispatcher();
}

export function unregisterTopLevelTooltip(instance: TooltipController<any>): void {
  openTopLevelTooltips.delete(instance);
  openTooltips.delete(instance);
  if (openTooltips.size === 0 && escapeInstalled) {
    document.removeEventListener('keydown', escapeHandler);
    escapeInstalled = false;
  }
}

export function registerOpenTooltip(instance: TooltipController<any>): void {
  openTooltips.add(instance);
  installEscapeDispatcher();
}

export function unregisterOpenTooltip(instance: TooltipController<any>): void {
  openTooltips.delete(instance);
}

export function getOpenTopLevelTooltips(): ReadonlySet<TooltipController<any>> {
  return openTopLevelTooltips;
}
