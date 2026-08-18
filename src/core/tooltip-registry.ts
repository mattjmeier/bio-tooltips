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

export function registerTopLevelTooltip(instance: TooltipController<any>): void {
  openTopLevelTooltips.add(instance);
}

export function unregisterTopLevelTooltip(instance: TooltipController<any>): void {
  openTopLevelTooltips.delete(instance);
}

export function getOpenTopLevelTooltips(): ReadonlySet<TooltipController<any>> {
  return openTopLevelTooltips;
}
