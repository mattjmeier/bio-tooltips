# Changelog

All notable changes to this project will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
