# Architecture

`gene-tooltips` uses a core/provider architecture.

## Core

The core owns generic tooltip behavior:

- tooltip engine creation
- Tippy lifecycle wiring
- cache and prefetch plumbing
- generic renderer helpers
- section wrappers and collapsible state
- viewport and theme behavior

Core code lives under `src/core` and `src/ui`.

## Providers

Providers own domain-specific behavior:

- data fetching
- DOM parsing
- result types
- provider config
- section rendering
- visuals and formatters

Provider code lives under `src/providers`.

## Public Entry Points

```ts
import { GeneTooltip } from 'gene-tooltips/mygene';
import { ChemicalTooltip } from 'gene-tooltips/mychem';
```

The root entry remains available for backward-compatible gene usage:

```ts
import GeneTooltip from 'gene-tooltips';
```

## Current Providers

MyGene-specific code lives under `src/providers/mygene`. It renders gene summaries, species context, locations, pathways, domains, transcripts, structures, GeneRIFs, and external links.

MyChem-specific code lives under `src/providers/mychem`. It renders chemical identity, structure and properties, summaries, classes, pharmacology, regulatory/product information, safety annotations, identifiers, and MyChem source details.

## Extending the System

Future providers should get a provider folder under `src/providers` and a package subpath similar to `gene-tooltips/mygene` or `gene-tooltips/mychem`.

For gene section extensions, see [Adding New Sections](./add-modules.md).
