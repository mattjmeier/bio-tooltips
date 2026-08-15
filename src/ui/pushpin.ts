import type { TooltipController } from '../core/tooltip-controller.js';

export function attachPushpin(instance: TooltipController<any>) {
  // This guard is now the key. If we've already found and initialized the button, do nothing.
  if (instance._pinButton) return;

  const tooltipRoot = instance.root;
  const btn = tooltipRoot.querySelector<HTMLButtonElement>('.gt-pin-button');

  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePin(instance, btn);
  });

  // Store the button element. This persists across hide/show cycles.
  instance._pinButton = btn;
}



function togglePin(instance: TooltipController<any>, btn: HTMLElement) {
  instance._isPinned = !instance._isPinned;

  if (instance._isPinned) {
    btn.classList.add('gt-pin-active');
    btn.setAttribute('aria-label', 'Unpin tooltip');
    instance.setPinned(true);

  } else {
    btn.classList.remove('gt-pin-active');
    btn.setAttribute('aria-label', 'Pin tooltip');
    instance.setPinned(false);
  }
}
