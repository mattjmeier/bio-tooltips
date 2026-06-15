# Adding a New Tooltip Module

This guide outlines the shape of a new Bio Tooltips module. The existing gene and chemical modules both combine a public entry point with an adapter that knows how to parse elements, fetch records, and render entity-specific sections.

The internal folder is still named `src/providers` for historical reasons. In public docs, treat each folder there as an adapter implementation.

## Module Checklist

1. Add raw API or service types for the entity type.
2. Add module config and sensible defaults.
3. Implement element parsing for the module's markup pattern.
4. Implement adapter fetching and cache keys.
5. Format raw adapter data into tooltip-ready values.
6. Render sections through the shared core renderer helpers.
7. Export a public tooltip module entry point.
8. Add docs, examples, and package exports.

## Example Shape

A future variant tooltip module might use:

```text
src/variant.ts
src/providers/variant/
  client.ts
  config.ts
  formatters.ts
  index.ts
  parser.ts
  profile.ts
  renderer.ts
  types.ts
```

and expose:

```ts
import { VariantTooltip } from 'bio-tooltips/variant';
```

## Adapter Responsibilities

Adapters should keep service-specific details out of the shared core. They own:

- parsing module-specific element attributes
- fetching records from the backing API or service
- normalizing raw records into display values
- choosing sections and section order
- defining optional visuals and nested tooltip content

## Shared Core Responsibilities

The shared core owns:

- Tippy.js initialization and cleanup
- prefetch strategy
- cache plumbing
- viewport constraints
- theming
- section wrappers and collapsible behavior

## Package Export

After adding a module entry file, add a package subpath:

```json
{
  "exports": {
    "./variant": {
      "types": "./dist/types/variant.d.ts",
      "import": "./dist/bio-tooltips.variant.esm.js",
      "require": "./dist/bio-tooltips.variant.cjs"
    }
  }
}
```

The build config should emit matching ESM and CommonJS artifacts.

## Gene Section Extensions

If you are only adding a new section to the existing gene tooltip module, the main integration point is `src/providers/mygene/sections/index.ts`. Add section types, config, fetch fields, formatters, and a section definition, then register it in `myGeneSections`.
