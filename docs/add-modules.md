# Guide: Adding a New MyGene Section

This document outlines the procedure for adding a new data section, such as GO Terms or phenotypes, to the MyGene tooltip provider.

For this guide, we'll use **GO Terms** (`go` field from mygene.info) as the example.

## The Pattern

1. **Types:** Add raw API types in `src/providers/mygene/types.ts`.
2. **Config:** Add display and count options in `src/providers/mygene/config.ts`.
3. **Fetch:** Request the field in `src/providers/mygene/client.ts`.
4. **Format:** Transform API data in `src/providers/mygene/formatters.ts`.
5. **Section:** Add a section file in `src/providers/mygene/sections/`.
6. **Register:** Add the section to `myGeneSections` in `src/providers/mygene/sections/index.ts`.

## Step 1: Types

Add the raw API data shape.

```ts
// src/providers/mygene/types.ts

export interface MyGeneGoTerm {
  id: string;
  term: string;
  category: 'CC' | 'BP' | 'MF';
}

export interface MyGeneInfoResult {
  // ... existing fields
  go?: MyGeneGoTerm[] | MyGeneGoTerm;
}
```

## Step 2: Config

Add a visibility flag, an item count, and include that count in the section context.

```ts
// src/providers/mygene/config.ts

export interface TooltipDisplayConfig {
  // ... existing fields
  goTerms: SectionVisibility;
}

export interface GeneTooltipConfig {
  // ... existing fields
  goTermCount: number;
}

export const defaultConfig: GeneTooltipConfig = {
  // ...
  display: {
    // ...
    goTerms: true,
  },
  goTermCount: 3,
};
```

```ts
// src/providers/mygene/sections/types.ts

export interface MyGeneSectionContext {
  // ... existing fields
  goTermCount: number;
}
```

```ts
// src/providers/mygene/sections/index.ts

export function createMyGeneSectionContext(/* ... */): MyGeneSectionContext {
  return {
    // ... existing fields
    goTermCount: config.goTermCount,
  };
}
```

## Step 3: Fetch

Add the API field name to the MyGene query.

```ts
// src/providers/mygene/client.ts

const fields = [
  // ...
  'generif',
  'wikipedia.url_stub',
  'go',
].join(',');
```

## Step 4: Format

Create a pure function that transforms raw API data into `{ name, url }` items.

```ts
// src/providers/mygene/formatters.ts
import type { MyGeneGoTerm } from './types.js';

export function formatGoTerms(data: MyGeneGoTerm[] | MyGeneGoTerm | undefined): FormattedItem[] {
  if (!data) return [];

  return asArray(data)
    .map(item => ({
      name: `${item.term} (${item.category})`,
      url: `https://www.ebi.ac.uk/QuickGO/term/${item.id}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
```

## Step 5: Section

Add a section module. The section owns its visible HTML and, if needed, the nested tooltip metadata for its "more" button.

```ts
// src/providers/mygene/sections/go-terms.ts
import { renderParagraphContent } from '../../../core/renderer.js';
import { formatGoTerms } from '../formatters.js';
import type { MyGeneSectionDefinition } from './types.js';

export const goTermsSection: MyGeneSectionDefinition = {
  key: 'goTerms',
  title: 'GO Terms',
  render({ data, goTermCount, uniqueId }) {
    const items = formatGoTerms(data.go);
    return renderParagraphContent(items, goTermCount, `goterms-more-${uniqueId}`);
  },
  getNestedTooltipDefinition({ data, uniqueId }) {
    return {
      selector: `#goterms-more-${uniqueId}`,
      items: formatGoTerms(data.go),
    };
  },
};
```

If your section needs a visual after the tooltip is shown, put the visual code in `src/providers/mygene/visuals/` and trigger it from the provider profile.

## Step 6: Register

Add the section to the registry in the order it should appear.

```ts
// src/providers/mygene/sections/index.ts
import { goTermsSection } from './go-terms.js';

export const myGeneSections: MyGeneSectionDefinition[] = [
  summarySection,
  locationSection,
  geneModelSection,
  pathwaysSection,
  domainsSection,
  transcriptsSection,
  structuresSection,
  generifsSection,
  goTermsSection,
  linksSection,
];
```

That is the main integration point. The MyGene renderer loops over `myGeneSections`, and the provider profile asks those sections for nested tooltip definitions.
