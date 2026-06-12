# Changelog

All notable changes to this project will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]
### Added
- Added a provider-specific `gene-tooltips/mygene` package entry point.
- Added architecture documentation for the core/provider split and future provider subpaths.

### Changed
- Kept the root `gene-tooltips` entry as a backward-compatible GeneTooltip wrapper.
- Moved generated CommonJS output to real `.cjs` files for correct `require(...)` resolution under `"type": "module"`.

### Removed
- Removed the former top-level MyGene compatibility modules in `src/api.ts`, `src/cache.ts`, `src/config.ts`, `src/parser.ts`, `src/prefetch.ts`, `src/lifecycle.ts`, and `src/renderer.ts`.

## [0.1.0] - 2025-10-06
### Added
- Initial public release of `gene-tooltips`
- Core tooltip creation functionality
- ESM, CJS, and UMD builds
- TypeScript type definitions and CSS classes
