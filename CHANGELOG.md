# Changelog

All notable changes to this project will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.0.8] - 2026-08-19

### Fixed

- Reduce churn with generation of API docs: (`typedoc.json` used `sourceLinkTemplate: …/blob/{gitRevision}/{path}#L{line}`. TypeDoc’s `{gitRevision}` expands to the full 40-hex SHA of HEAD at generation time, and it was embedded into every one of the 464 source links. Since `docs/api/**` is committed, the docs always carried the SHA of whatever commit generated them — one commit behind HEAD. So every regeneration rewrote every link line.
- Selection issue with tooltip IDs on mobile: now tapping on a gene/chemical name no longer highlights the word.

## [2.0.7] - 2026-08-18

### Added

- Mobile improvements to make tooltips full-width and prefer appearing above/below (avoids squishy appearance)

## [2.0.6] - 2026-08-17

### Fixed

- Tooltips were 'piling up' when scrubbing over multiple triggers - this patch fixes lifecycle management so that only one appears at a time.

## [2.0.5] - 2026-08-17

### Added
- Copy affordance on the gene and chemical summary. An inline copy button rendered at the end of the summary copies the full (untruncated) summary text to the clipboard on click or keyboard activation (Enter/Space). On success the icon briefly switches to a checkmark to confirm the copy went through, with a fallback path for non-secure contexts where the async clipboard API is unavailable.

### Changed
- Summary expand/collapse is now toggled by clicking the summary paragraph itself; the mygene summary no longer renders a separate "Show less" collapse button.

### Fixed
- Clicking non-focusable content inside an open tooltip (which drops focus to the document body) no longer dismisses the tooltip; the panel is now closed by the pointer bridge only when the cursor actually exits.

## [2.0.4] - 2026-08-16

### Added
- Automated README preview screenshots (light and dark mode) with a GitHub Actions workflow and a local `npm run screenshots` script.

### Changed
- Tooltip geometry and vertical scrolling is now owned exclusively by the shell CSS and Floating UI `size` middleware. The per-provider `tooltipWidth` and `tooltipHeight` inline style options are removed to prevent a secondary scroll container inside the tooltip.

## [2.0.3] - 2026-08-15

- Ideogram was failing to load alternate scaffolds; this fix ensures the correct canonical chromosome is used for both displayed coordinates and the Ideogram annotation.

## [2.0.2] - 2026-08-15

### Fixed
- Ideogram mounting bug that persisted in BioTooltipR; the tooltip controller now correctly manages the Ideogram mount lifecycle.

## [2.0.1] - 2026-08-15

### Fixed
- Ideogram renders now serialize through a render queue to prevent concurrent initializations from corrupting the SVG container.
- Guard against rendering into destroyed or unmounted tooltip instances after async library load.
- Handle missing or empty `genomicPos.chr` values gracefully with a "No chromosome data" fallback instead of passing invalid input to the Ideogram constructor.
- Await the Ideogram `onLoad` callback so render completion timing reflects the library's actual async initialization.

## [2.0.0] - 2026-08-15

**Breaking release.** The Tippy.js foundation is replaced by an owned tooltip controller and `@floating-ui/dom` positioning. Data providers, rendered biological content, themes, dimensions, caching, prefetch, timing, and the cleanup function returned by `init()` remain available. See [Migrating to v2](docs/migrating-to-v2.md) for the full config and CSS selector translation.

### Added
- First-class `placement: 'auto'` form with `allowedPlacements` for most-space placement.
- `viewportPadding` and `fallbackPlacements` as direct tooltip options.
- Bundled `@floating-ui/dom` positioning; consumers do not install or configure it separately.
- Focused test coverage for positioning, the tooltip controller, the tooltip engine, ideogram visuals, and summary expansion, plus a browser smoke-test fixture.

### Changed
- **Config option renames:** `tippyOptions` → `tooltipOptions`, `nestedTippyOptions` → `nestedTooltipOptions`, `delay: [show, hide]` → `showDelay` / `hideDelay`, `duration: [show, hide]` → `showDuration` / `hideDuration`, `preventOverflow.options.padding` → `viewportPadding`, `flip.options.fallbackPlacements` → `fallbackPlacements`.
- **CSS selector renames:** `[data-tippy-root]` → `[data-gt-tooltip-root]`, `.tippy-box` → `.gt-tooltip-box`, `.tippy-content` → `.gt-tooltip-content`, `.tippy-arrow` → `.gt-tooltip-arrow`. Theme names and `--gt-*` customization variables are unchanged.

### Removed
- The Tippy.js runtime and its option surface. Arbitrary Tippy lifecycle hooks, plugins, trigger strings, animations, and raw Popper modifiers are no longer accepted; Bio Tooltips now owns hover, focus, touch, interactive traversal, pinning, nested tooltips, reduced-motion, and cleanup behavior.

### Fixed
- Summary section collapse inconsistency.
- Stray extra popover rendered on ideogram tooltips.

## [1.2.0] - 2026-08-13

### Changed
- Cache rendered collapsible visual sections and prevent duplicate concurrent renders, improving tooltip expansion performance.
- Smooth collapsible section animations by measuring their actual content height and restoring natural sizing after transitions.

## [1.1.2] - 2026-08-11

### Changed
- Render MyGene external-record links as compact text controls without embedded provider logos, substantially reducing the MyGene bundle and generated tooltip HTML.
- Replace the MyGene transcript picker with an accessible, theme-aware native HTML select and remove the Tom Select runtime dependency.

## [1.1.1] - 2026-06-20

### Added
- Display the current package version in the documentation navigation with a link to the matching npm release.
- Create a GitHub Release automatically after a successful npm publish.

## [1.1.0] - 2026-06-20

### Added
- Add the shared `sectionVariant` option for choosing between the default section cards and a flatter divider-based tooltip layout.
- Export the `SectionVariant` type from the gene and chemical package entry points.

## [1.0.2] - 2026-06-19

### Changed
- Reset image spacing, borders, and shadows inside chemical structure tooltips so host-page styles do not leak into rendered structures.
- Trigger the BioTooltipR vendoring workflow after a successful npm publish.

## [1.0.1] - 2026-06-17

### Changed
- Performance improvements in the Gene Tooltips (`lifecycle.ts` and `timing.ts`)
- Updated documentation to make it clearer and more comprehensive

## [1.0.0] - 2026-06-16
### Added
- Added the `bio-tooltips` package identity for bioinformatic/cheminformatic tooltip modules.
- Added module-specific `bio-tooltips/mygene` and `bio-tooltips/mychem` package entry points.
- Added architecture documentation for the core/adapter split and future module subpaths.
- Added mixed entity demo documentation for gene and chemical tooltips on the same page.
- Added a MyGene.info attribution footer with a raw JSON link to gene tooltips.
- Added agent guidance and an explicit fresh docs build script to avoid accidental generated API doc churn.

### Changed
- Renamed project branding from Gene Tooltips to Bio Tooltips.
- Kept the root `bio-tooltips` default export as a backward-compatible GeneTooltip wrapper while exposing named module exports.
- Moved generated CommonJS output to real `.cjs` files for correct `require(...)` resolution under `"type": "module"`.

### Removed
- Removed the former top-level MyGene compatibility modules in `src/api.ts`, `src/cache.ts`, `src/config.ts`, `src/parser.ts`, `src/prefetch.ts`, `src/lifecycle.ts`, and `src/renderer.ts`.

## [0.1.0] - 2025-10-06
### Added
- Initial public release of `gene-tooltips`
- Core tooltip creation functionality
- ESM, CJS, and UMD builds
- TypeScript type definitions and CSS classes
