# Accessibility guidance

Bio Tooltips preserves the semantics of the host element and adds keyboard and focus behavior when a tooltip is initialized. Prefer a native `<button type="button">` for an action that opens a tooltip, and a native `<a href="…">` when the trigger is also navigation. A `<span>` trigger is supported and is enhanced with an appropriate button role and keyboard behavior by the library.

Keep the trigger text meaningful, provide `aria-label` or visible context when a symbol is ambiguous, and avoid placing interactive controls inside a tooltip that is presented only as a description. Interactive content belongs in a dialog or popover pattern with a clear close action. Host styles must preserve visible focus indicators and sufficient contrast; avoid clipping the tooltip or setting `overflow: hidden` on an ancestor that contains it.

Keyboard users can enter an open panel with Tab, use the panel controls with Enter, Space, and Arrow keys, and leave the deepest nested panel with Escape. Focus returns to the control that opened a nested panel when that panel closes. Collapsed sections become hidden and inert while collapsed so their controls are not reachable by Tab. Copy and summary controls expose their result through a status message.

The shipped styles include light and dark themes and respond to reduced-motion and forced-colors preferences. Applications should still test their surrounding layout at 320 CSS pixels, with text spacing overrides, and at 200% browser zoom. A narrower viewport is not a substitute for actual browser zoom.

The automated checks cover representative gene and chemical fixtures with WCAG 2.0/2.1/2.2 A and AA axe rules, keyboard behavior, lifecycle cleanup, and browser console errors. They do not establish full WCAG conformance. Before release, manually verify the experience with NVDA and VoiceOver, keyboard-only navigation in supported browsers, real browser zoom, high contrast/forced colors, and the application’s own host styles.

References: [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) and the [ARIA Authoring Practices Guide tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/).
