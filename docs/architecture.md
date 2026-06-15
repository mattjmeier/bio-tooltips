# Architecture

Bio Tooltips uses a shared core plus adapter architecture.

## Core

The core owns generic tooltip behavior:

- tooltip engine creation
- Tippy lifecycle wiring
- cache and prefetch plumbing
- generic renderer helpers
- section wrappers and collapsible state
- viewport and theme behavior

Core code lives under `src/core` and `src/ui`.

## Adapters

Adapters own entity-specific behavior:

- data fetching
- DOM parsing
- result types
- module config
- section rendering
- visuals and formatters

Adapter code currently lives under the internal `src/providers` folder.

## Public Entry Points

```ts
import { GeneTooltip } from 'bio-tooltips/mygene';
import { ChemicalTooltip } from 'bio-tooltips/mychem';
```

The root entry exposes both current tooltip modules:

```ts
import { GeneTooltip, ChemicalTooltip } from 'bio-tooltips';
```

The default root export remains available for backward-compatible gene usage.

## Current Adapters

The MyGene.info adapter lives under `src/providers/mygene`. It renders gene summaries, species context, locations, pathways, domains, transcripts, structures, GeneRIFs, and external links.

The MyChem.info adapter lives under `src/providers/mychem`. It renders chemical identity, structure and properties, summaries, classes, pharmacology, regulatory/product information, safety annotations, identifiers, and MyChem source details.

## Extending the System

Future tooltip modules should get an adapter folder under `src/providers` and a package subpath similar to `bio-tooltips/mygene` or `bio-tooltips/mychem`.

For new entity types, see [Adding a New Tooltip Module](./add-modules.md).
