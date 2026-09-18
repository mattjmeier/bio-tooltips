# Accessibility support

**Current status:** Bio Tooltips is designed to support WCAG 2.2 Level AA conforming implementations when used according to this guidance. Representative components and interaction states are covered by automated accessibility scans, browser-based keyboard tests, and browser-based layout and user-preference checks. This testing is not a full WCAG conformance evaluation, and the project does not currently claim that the package, documentation site, or a host application conforms to WCAG.

## Scope

The current assessment covers the library-owned core, gene, and chemical tooltip behavior exercised by the repository's local test fixtures. It includes the shipped themes, common trigger elements, nested and pinned panels, asynchronous states, and selected responsive and user-preference conditions.

It does not cover the surrounding markup, content, styles, or configuration supplied by a host application. Optional third-party visualizations, custom renderers, combinations of browsers and assistive technologies not listed in the verification record, and the documentation site as a whole are also outside the current assessment. A host application needs its own complete evaluation before making a WCAG conformance claim.

## Using the library accessibly

Bio Tooltips preserves the semantics of the host element and adds keyboard and focus behavior when a tooltip is initialized. Prefer a native `<button type="button">` for an action that opens a tooltip, and a native `<a href="…">` when the trigger is also navigation. A `<span>` trigger is supported and is enhanced with an appropriate button role and keyboard behavior by the library.

Keep the trigger text meaningful, provide `aria-label` or visible context when a symbol is ambiguous, and avoid placing interactive controls inside a tooltip that is presented only as a description. Interactive content belongs in a dialog or popover pattern with a clear close action. Host styles must preserve visible focus indicators and sufficient contrast; avoid clipping the tooltip or setting `overflow: hidden` on an ancestor that contains it. Gene details also expose a text alternative when optional visual rendering is unavailable.

Keyboard users open span and button triggers with Enter or Space; a link trigger retains navigation on Enter and opens its dialog with ArrowDown. Once open, Tab reaches the pin and close controls, and Shift+Tab from the dialog entry returns to the trigger. Forward Tab from the last panel control resumes after its trigger in page order. Escape closes the deepest relevant panel, including a pinned panel; focus returns to its trigger only when focus was inside the dismissed panel. Hover and focus previews do not move focus, and these non-modal dialogs do not trap focus. Collapsed sections become hidden and inert while collapsed so their controls are not reachable by Tab. Copy and summary controls expose their result through a status message.

The shipped styles include light and dark themes and respond to reduced-motion and forced-colors preferences. Applications should still test their surrounding layout at 320 CSS pixels, with text spacing overrides, at 200% text resizing, and at 400% desktop browser zoom. A narrower viewport is not a substitute for actual browser zoom.

The automated checks cover representative gene and chemical fixtures with WCAG 2.0/2.1/2.2 A and AA axe rules, keyboard behavior, lifecycle cleanup, and browser console errors. They do not establish full WCAG conformance or replace manual testing. Before release, manually verify the experience with NVDA and VoiceOver, keyboard-only navigation in supported browsers, actual 200% text resizing and 400% desktop browser zoom, high contrast/forced colors, and the application’s own host styles. The automated viewport and media emulation checks are programmatic simulations; they do not establish actual browser zoom behavior.

References: [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) and the [ARIA Authoring Practices Guide tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/).

## Running the checks

Run `npm ci`, `npx playwright install chromium`, then `npm run test:a11y`. The script builds the package and uses local gene/chemical fixtures with development-only axe-core. No live provider requests are required. Unit coverage runs separately with `npm test -- --run`.

The visual browser checks assert panel and page reflow at 320 CSS pixels, then apply WCAG text-spacing values and double computed text sizes. They also check focus indicators, close-button target sizes, reduced-motion transitions, and forced-colors panel boundaries. These checks cover representative fixtures; inspect actual browser zoom, content overlap, all supported operating systems, and your application’s styles manually.

The gene-model header includes a compact **Show exon data** button whose controlled region contains the selected transcript identity, strand, and exon numbers and coordinates. Its label changes to **Hide exon data** when open, it exposes its state with `aria-expanded`, the region updates with the transcript selector, and the data opens automatically if D3 cannot render. Individual SVG exons retain pointer previews without adding hundreds of keyboard stops.

Short descriptive previews use `role="tooltip"` and `aria-describedby`; interactive parent and searchable child panels use named `role="dialog"` containers. Host applications should supply meaningful trigger text, preserve native link/button semantics, and avoid overriding the library’s focus and hidden-state styles. Optional third-party visualizations and custom renderers need their own accessibility assessment.

## Reporting an accessibility barrier

If you encounter an accessibility problem, [open a GitHub issue](https://github.com/mattjmeier/bio-tooltips/issues) with the package version, browser and operating system, assistive technology if applicable, a minimal example, and the behavior you expected. Please do not include private or sensitive data.

## Verification record

Validated in Chromium 151.0.7922.34 with local TP53 and aspirin records. The browser suite exercises span/button/link activation, logical Tab exit, nested search and dismissal, pinning, transcript changes, copy success/failure, delayed responses, request errors, empty results, and cleanup/reinitialization. Axe scans require an open panel and cover five shipped themes plus nested and pinned states. The unit suite has 120 passing tests. Production, declaration, documentation, and package dry-run checks also pass.

Development dependency review found zero runtime vulnerabilities and eight existing development-tool findings (three moderate, five high); these were present before the axe-core addition. Registry verification checked 498 package signatures and 89 attestations. The environment used Node 24.14.0, below jsdom 30’s declared Node 24.15.0 minimum; tests passed, but use a supported Node version for release verification.
