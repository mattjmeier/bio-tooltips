import type { TooltipController } from '../core/tooltip-controller.js';

export function attachPushpin(instance: TooltipController<any>) {
  // This guard is now the key. If we've already found and initialized the button, do nothing.
  if (instance._pinButton && instance.root.contains(instance._pinButton)) {
    instance.syncPinButton?.();
    return;
  }

  const tooltipRoot = instance.root;
  const btn = tooltipRoot.querySelector<HTMLButtonElement>('.gt-pin-button');

  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    instance.setPinned(!instance._isPinned);
  });

  // Store the button element. This persists across hide/show cycles.
  instance._pinButton = btn;
  // Renderers may replace the entire content while a panel is pinned or
  // while presentation changes. Synchronize all state immediately, not just
  // visibility, so the newly rendered control is truthful on first paint.
  instance.syncPinButton?.();
}
