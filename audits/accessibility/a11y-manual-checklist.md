# Manual accessibility testing protocol (WCAG 2.2 AA)

Companion to the internal `a11y-evaluation.md` record. The automated suites (`npm run test:a11y`, `npm run test:a11y:docs`) cover everything that can be exercised without a human with assistive technology. This protocol covers the rest: screen-reader perception, real zoom, real high contrast, and human reading-order/comprehension judgments.

**How to use:** run the prerequisite build commands once, then work through the checklist items in order. Record `Result` (Pass / Fail / Blocked), the actual observation, the tester's initials, and the date for every item. An item may only be marked **Pass** if the expected result was observed as described. Do not infer Pass from automated results.

**Prerequisites**

```bash
npm install
npm run build:js-css     # library build for the library checks (S-*)
npm run docs:build       # docs site build for the site checks (W-*)
npm run docs:preview -- --port 4173   # or any static server for docs/.vitepress/dist with base /bio-tooltips/
```

For library checks, use `test/browser-a11y.html` served locally (it loads the built `dist` bundle and the local TP53/aspirin fixtures) — or any host page embedding Bio Tooltips with the same fixtures.

## Test environment (fill in per run)

| Item | Value |
|------|-------|
| Library version / commit | |
| Browser + version (NVDA items: Chrome or Edge on Windows) | |
| OS + version | |
| Screen reader + version (if used) | |
| Display + native resolution, browser zoom at start | |
| Date / tester | |

## A. Screen-reader tests — NVDA (Windows)

Setup: start NVDA (`Caps+Space`), default settings; open `test/browser-a11y.html` (library) and the docs site (W items). Use a **gene panel** (has nested search, transcript selector, D3 track, copy, pin) and a **chemical panel** (has copy).

| ID | WCAG | Procedure (exact keys) | Expected result | Result | Observed | Tester/Date |
|----|------|------------------------|-----------------|--------|----------|-------------|
| M-01 | 4.1.2 | Tab to the gene trigger; press `Enter` (span trigger) / click (button trigger). | NVDA announces the dialog role and its name (e.g. "TP53 dialog" or the trigger text), then the first content (section title or status). No error sounds. | | | |
| M-02 | 4.1.3, 2.1.1 | With the gene trigger focused, press `Enter`, wait for the delayed load to start and finish. | "Loading" (or equivalent) announced once when loading starts; panel content (section titles, table rows) available after load; no repeated/redundant announcements. | | | |
| M-03 | 2.1.1 | With the panel open: press `Tab` through every control in order; then `Shift+Tab` once from the panel's first focusable. | Tab order matches visual order (title → controls top-to-bottom). First `Tab` after opening moves into the panel; `Shift+Tab` from the first control returns to the trigger; a long `Tab` run eventually exits the panel and resumes page order (no trap). | | | |
| M-04 | 2.1.1, 1.4.13 | Press `Esc` once with the gene panel open; repeat with a **nested** panel open (open the panel, focus the nested-search trigger inside, press `Enter`, then `Esc` twice). | First `Esc` closes only the nested panel and focus returns to its trigger; second `Esc` closes the main panel. Pinned panels close on `Esc` and unpin. | | | |
| M-05 | 1.1.1, 1.3.1 | Focus the "Show exon data" (or equivalent collapsible) control; press `Enter`; listen. | NVDA announces the expanded/collapsed state and the region content (transcript name + exon text alternative). Collapsing hides the content from the tree (NVDA no longer reads it). | | | |
| M-06 | 4.1.3 | In the chemical panel, focus Copy; press `Enter`. Then simulate an empty state (use a non-existent ID, e.g. trigger for `XYZ999`). | "copied" (or "Unable to copy") announced for the copy result. Empty state announces "not found"-style status; error state announces "Error loading data." | | | |
| M-07 | 2.4.7, 2.5.8 | Tab through panel controls at normal size; note each visible focus indicator. | Every focused control shows a clearly visible outline (3 px, theme accent / system Highlight in high contrast). No control relies on an invisible or 1 px indicator. | | | |
| M-08 | 1.4.11 | (See C-01/C-02 — repeat with NVDA off, inspecting focus borders and any required UI parts.) | Focus borders and any required UI components are distinguishable at ≥ 3:1 against adjacent colors. | | | |

## B. Screen-reader tests — VoiceOver (macOS)

Setup: enable VoiceOver (`Ctrl+F5`), default settings; use Safari or Chrome. Repeat the equivalent of M-01…M-06 and M-09 on the same panels (VoiceOver announcements differ in phrasing; judge by content).

| ID | WCAG | Procedure | Expected result | Result | Observed | Tester/Date |
|----|------|-----------|-----------------|--------|----------|-------------|
| M-09 | 4.1.2, 4.1.3, 2.1.1 | VO `Ctrl+Option+Right` to move focus through the open panel; `Ctrl+Option+H` (or "Get role") on the panel itself and on the gene SVG. | Panel role "dialog" (or "group" with name) and correct name. Gene SVG identified as image/figure with its text alternative (gene name + transcript). Status announcements for loading/copy/empty/error as in M-02/M-06. | | | |
| M-10 | 1.1.1, 1.3.3 | VO-Over (`Ctrl+Option+F`) over the gene track and, on a narrow window, the Ideogram area. | The gene track and Ideogram are exposed as single images with descriptive labels; the exon text alternative is exposed as a region that can be collapsed/expanded; no unlabeled graphics. | | | |
| M-11 | 2.4.3 | ROVER mode (`Ctrl+Option+Down`): navigate sections/headings in the open panel. | Section titles are exposed as headings in visual order; no orphan content before the first heading. | | | |

## C. Zoom, text resize, and reflow (human, real browser)

| ID | WCAG | Procedure | Expected result | Result | Observed | Tester/Date |
|----|------|-----------|-----------------|--------|----------|-------------|
| Z-01 | 1.4.4 | Library fixture page: set browser zoom to **200%** (`Ctrl+Plus` ×3 from 100%). Open the gene and chemical panels. | All text readable and operable; panel controls reachable (scrolling allowed); no loss of content or function. | | | |
| Z-02 | 1.4.10 | Same page at **400%** (`Ctrl+Plus` ×7). Re-open the panels; also open a docs demo (`/demos/gene`). | Content reflows to 320 CSS px width with no two-dimensional scrolling of the *page*; panel scrollable internally; no clipped/overlapping content. | | | |
| Z-03 | 1.4.4, 1.4.10 | Docs site (all page types: home, guide, reference, api page, demo): **200%** then **400%**. | Same expectations; navigation, sidebar, demo open/close still usable; code blocks scroll internally rather than breaking layout. | | | |
| Z-04 | 1.4.14 | In Windows: Settings → Accessibility → Text → line spacing 1.5, letter spacing +2, word spacing +2, paragraph spacing +2 (or browser extension). Reload fixture page + a docs page; open a panel. | No loss of content or functionality in either scope. | | | |

## D. High-contrast / forced colors (human, real OS setting)

| ID | WCAG | Procedure | Expected result | Result | Observed | Tester/Date |
|----|------|-----------|-----------------|--------|----------|-------------|
| H-01 | 1.4.3, 1.4.11, 2.4.7 | Windows: Settings → Accessibility → Contrast themes → **Black and White** and **White and Black**. Reload fixture page; open panels; Tab through controls. | All text ≥ 4.5:1; focus outline visible (system Highlight); panel borders and required UI parts distinguishable ≥ 3:1; no content lost to missing borders. | | | |
| H-02 | 2.4.7, 1.4.11 | macOS: Settings → Accessibility → Display → Increase Contrast → "Smart Invert off / High Contrast on" (or Force Dark Off); open panels; Tab. | Same expectations; focus visible in both light and dark. | | | |
| H-03 | 2.5.4 | Windows: Settings → Accessibility → Animation effects **Off** (and/or prefers-reduced-motion). Open/close panels and collapsibles; open a docs demo. | No non-essential motion remains (transitions removed); all state changes still perceptible via text/structure. | | | |

## E. Keyboard-only and comprehension (human judgment)

| ID | WCAG | Procedure | Expected result | Result | Observed | Tester/Date |
|----|------|-----------|-----------------|--------|----------|-------------|
| K-01 | 2.1.1, 2.1.2 | Keyboard-only, no AT: complete a full gene-demo session on the docs site (open, pin, search transcripts, copy, collapse sections, unpin, close). | Every step possible with Tab/Shift+Tab/Enter/Space/Escape/arrows; no trap; no step requiring the mouse. | | | |
| K-02 | 2.4.11 | On the docs site, focus links at the very top of a page while scrolled such that the sticky header overlaps the content area (e.g. Tab to a header nav link while the content is scrolled up under the header). | Focused element is never permanently hidden behind the sticky header (it scrolls into a visible position). | | | |
| K-03 | 1.3.1, 1.3.2 | Read through an open gene panel top-to-bottom with the screen reader off and Tab only. | Reading (Tab) order matches the visual reading order; no illogical jumps; table rows read as rows. | | | |
| K-04 | 1.1.1 (comprehension) | A person unfamiliar with the product reads only the **exon text alternative** for a transcript (collapsed-by-default region, expanded once) and the gene SVG label. | The text conveys: which gene, which transcript, exon/intron structure in a usable form; sufficient to understand the visualization's purpose without seeing it. | | | |
| K-05 | 2.4.6 | Tab through a docs page: check the page has a clear first heading and that section headings identify their topics. | One logical H1 per page (exception noted: generated `api/modules.html` has no H1 — record as a known gap), headings identify content. | | | |

## F. Sign-off

| Scope | All items Pass? | Tester | Date |
|-------|-----------------|--------|------|
| Scope A (library) — S/M items | ☐ Pass ☐ Fail ☐ Blocked | | |
| Scope B (docs site) — W/Z/H/K items | ☐ Pass ☐ Fail ☐ Blocked | | |

If all items Pass, the Not Tested cells in `a11y-evaluation.md` §3 can be updated, tested environments recorded, and a formal scoped WCAG 2.2 AA conformance claim may be drafted per §8 of that report. Otherwise, keep the "designed to support WCAG 2.2 Level AA conforming implementations" wording and list the failing/blocked items in the statement.
