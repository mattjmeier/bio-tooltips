import type { TippyInstanceWithCustoms } from '../core/types.js';

export function attachPushpin(instance: TippyInstanceWithCustoms) {
  // This guard is now the key. If we've already found and initialized the button, do nothing.
  if (instance._pinButton) return;

  const popper = instance.popper;
  const btn = popper?.querySelector<HTMLButtonElement>('.gt-pin-button');

  if (!popper || !btn) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePin(instance, btn);
  });

  // Store the button element. This persists across hide/show cycles.
  instance._pinButton = btn;
}



function togglePin(instance: TippyInstanceWithCustoms, btn: HTMLElement) {
  instance._isPinned = !instance._isPinned;

  if (instance._isPinned) {
    // --- PINNING LOGIC ---
    // Store the original trigger so we can restore it later
    instance._originalTrigger = instance.props.trigger;

    // Set to manual mode
    instance.setProps({
      trigger: 'manual',
      hideOnClick: false, // Ensure clicking outside doesn't hide it
    });

    btn.classList.add('gt-pin-active');
    btn.setAttribute('aria-label', 'Unpin tooltip');
    
    // Ensure it's visible. This is safe to call even if it's already shown.
    instance.show();

  } else {
    // --- UNPINNING LOGIC ---
    // Restore the original trigger
    instance.setProps({
      trigger: instance._originalTrigger || 'mouseenter focus',
    });

    btn.classList.remove('gt-pin-active');
    btn.setAttribute('aria-label', 'Pin tooltip');

    // Explicitly hide the tooltip to reset its state.
    // The user will need to mouseenter again to show it.
    instance.hide();
  }
}
