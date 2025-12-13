# Guide: Adding a New Data Section to the Tooltip

This document outlines the procedure for adding a new data section (e.g., GO Terms, Phenotypes) to the gene tooltip. The package uses a modular pattern involving configuration, data formatting, rendering, and lifecycle management.

For this guide, we'll use **GO Terms** (`go` field from mygene.info) as the example.

## The 5-Step Pattern

1.  **Configure:** Define types and defaults in `src/config.ts`.
2.  **Fetch:** Request data in `src/api.ts`.
3.  **Format:** Transform raw API data into standard objects in `src/formatters.ts`.
4.  **Render:** Generate HTML in `src/renderer.ts`.
5.  **Integrate:** Wire up nested tooltips in `src/lifecycle.ts`.

---

## Step 1: Configure (src/config.ts)

Define the shape of the data and user configuration options.

### A. Define the data interface
Add the interface for the raw API data.

```typescript
// src/config.ts

export interface MyGeneGoTerm {
  id: string;
  term: string;
  category: 'CC' | 'BP' | 'MF';
}
```

### B. Update `MyGeneInfoResult`
Add the new field to the main result interface.

```typescript
// src/config.ts

export interface MyGeneInfoResult {
  // ... existing fields
  generif?: GeneRIF[] | GeneRIF;
  go?: MyGeneGoTerm[] | MyGeneGoTerm; // <--- ADD THIS
}
```

### C. Update `TooltipDisplayConfig`
Add a visibility flag. Note that sections now use `SectionVisibility` (boolean | 'expanded' | 'collapsed').

```typescript
// src/config.ts

export interface TooltipDisplayConfig {
  // ... existing fields
  generifs: SectionVisibility;
  goTerms: SectionVisibility; // <--- ADD THIS
  // ...
}
```

### D. Update `GeneTooltipConfig` and `defaultConfig`
Add an item count setting and set defaults.

```typescript
// src/config.ts

export interface GeneTooltipConfig {
  // ...
  generifCount: number;
  goTermCount: number; // <--- ADD THIS
}

export const defaultConfig: GeneTooltipConfig = {
  // ...
  display: {
    // ...
    generifs: true,
    goTerms: true, // <--- SET DEFAULT VISIBILITY
  },
  // ...
  generifCount: 3,
  goTermCount: 3, // <--- SET DEFAULT COUNT
};
```

---

## Step 2: Fetch (src/api.ts)

Add the API field name to the query list.

```typescript
// src/api.ts

export async function fetchMyGeneBatch(/*...*/) {
  // ...
  const fields = [
    // ...
    'generif',
    'wikipedia.url_stub',
    'go' // <--- ADD API FIELD NAME
  ].join(',');
  // ...
}
```

---

## Step 3: Format (src/formatters.ts)

Create a pure function to transform raw API data into a standard list of items (`{ name, url }`).

```typescript
// src/formatters.ts
import type { MyGeneGoTerm } from './config'; // Import your new type

// ... existing functions

export function formatGoTerms(data: MyGeneGoTerm[] | MyGeneGoTerm | undefined): FormattedItem[] {
  if (!data) return [];
  
  // Use asArray helper to handle single objects vs arrays
  return asArray(data)
    .map(item => ({
      name: `${item.term} (${item.category})`,
      url: `https://www.ebi.ac.uk/QuickGO/term/${item.id}`
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
```

---

## Step 4: Render (src/renderer.ts)

Generate the HTML. We use `renderParagraphContent` for comma-separated lists or `renderListContent` for bullet points.

### A. Import the formatter
```typescript
import { 
  // ...
  formatGoTerms // <--- Import
} from './formatters';
```

### B. Create a specific render function
Use the `uniqueId` to ensure the "Show more" button works correctly.

```typescript
function renderGoTerms(data: MyGeneInfoResult, count: number, uniqueId: string): string {
  const items = formatGoTerms(data.go);
  // Use renderParagraphContent (comma separated) or renderListContent (<ul>)
  return renderParagraphContent(items, count, `goterms-more-${uniqueId}`);
}
```

### C. Update `renderTooltipHTML`
Update the options interface and the main HTML template.

```typescript
// Inside src/renderer.ts

// 1. Update RenderOptions interface
interface RenderOptions {
  // ...
  generifCount?: number;
  goTermCount?: number; // <--- Add
}

export function renderTooltipHTML(data: MyGeneInfoResult | null | undefined, options: RenderOptions = {}): string {
  // ...
  
  const {
    // ...
    generifCount = 3,
    goTermCount = 3, // <--- Destructure
  } = options;

  // ...

  // 2. Generate the content
  const goTermContent = renderGoTerms(data, goTermCount, uniqueId);

  return `
    <div class="gene-tooltip-content" ...>
      <!-- ... -->
      ${buildSection('generifs', 'GeneRIFs', generifContent)}
      
      <!-- 3. Add the section using buildSection -->
      ${buildSection('goTerms', 'GO Terms', goTermContent)}
      
      <!-- ... -->
    </div>
  `;
}
```

---

## Step 5: Integrate Lifecycle (src/lifecycle.ts)

This step activates the "Show more" button functionality (nested tooltips).

### A. Update `renderVisualsAndNestedTippys`

```typescript
// src/lifecycle.ts

import { 
  // ...
  formatGoTerms // <--- Import formatter
} from './formatters.js';

async function renderVisualsAndNestedTippys(instance: TippyInstanceWithCustoms, config: GeneTooltipConfig) {
    // ... setup code ...

    // 1. Format the data again for the nested tooltip
    const goItems = formatGoTerms(data.go);

    // 2. Register the nested tooltip
    // Arguments: instance, options, selector_id, items_array
    createNestedTippy(
      instance, 
      finalNestedTippyOptions, 
      `#goterms-more-${uniqueId}`, 
      goItems
    );
    
    // ... existing calls for transcripts, structures, etc.
}
```

### B. Update `createOnShowHandler`

Pass the new count configuration to the renderer options.

```typescript
// src/lifecycle.ts

export function createOnShowHandler(...) {
  return function onShow(instance: TippyInstanceWithCustoms) {
     // ...
     const renderOptions = {
        // ...
        generifCount: config.generifCount,
        goTermCount: config.goTermCount, // <--- Pass from config
        uniqueId: instance._uniqueId,
      };
      // ...
  }
}
```

By following these five steps, you can cleanly and consistently add new sections while maintinaing flexible configuration options.