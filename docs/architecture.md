# Architecture

`gene-tooltips` is moving toward a core/provider architecture.

The core owns generic tooltip behavior:

- tooltip engine creation
- Tippy lifecycle wiring
- cache and prefetch plumbing
- generic renderer helpers
- section wrappers and collapsible state

Providers own domain-specific behavior:

- data fetching
- DOM parsing
- result types
- provider config
- section rendering
- visuals
- provider-specific formatting

## Package Entry Points

The package now has two public JavaScript entry points.

### Root Entry

```ts
import GeneTooltip from 'gene-tooltips';
```

The root entry is kept for backward compatibility. Today it still exposes the MyGene tooltip API.

Use this if you are upgrading existing code and want the least churn.

### MyGene Entry

```ts
import { GeneTooltip } from 'gene-tooltips/mygene';
```

This is the preferred modular entry for gene tooltips. It imports the MyGene provider directly and is the pattern future providers should follow.

Provider-specific helpers are also exported from this entry:

```ts
import {
  GeneTooltip,
  mergeConfig,
  formatTranscripts,
  myGeneProfile,
} from 'gene-tooltips/mygene';
```

## Provider Layout

MyGene-specific code lives under `src/providers/mygene`:

```txt
src/providers/mygene/
  client.ts
  config.ts
  formatters.ts
  index.ts
  parser.ts
  profile.ts
  renderer.ts
  species.ts
  types.ts
  sections/
  visuals/
```

The top-level `src` folder should stay reserved for package entry points and generic shared pieces. Provider-specific code should not be added there.

## Removed Compatibility Modules

The former top-level modules `api.ts`, `cache.ts`, `config.ts`, `parser.ts`, `prefetch.ts`, `lifecycle.ts`, and `renderer.ts` were removed during the major-version core/provider refactor.

Provider-specific imports should come from `gene-tooltips/mygene`, and generic tooltip plumbing should live under `src/core`.

## Adding Sections

MyGene tooltip sections are registered through `myGeneSections` in `src/providers/mygene/sections/index.ts`.

To add a new MyGene section:

1. Add a section file under `src/providers/mygene/sections/`.
2. Export a `MyGeneSectionDefinition`.
3. Add it to `myGeneSections` in render order.
4. Add config/types/formatters only if the new section needs them.

See [Adding new sections to tooltips](./add-modules.md) for a full walkthrough.

## Future Providers

Future providers should get their own package subpath:

```ts
import { ChemicalTooltip } from 'gene-tooltips/mychem';
```

That keeps provider-specific code out of unrelated provider bundles and makes the architecture obvious to users and maintainers.
