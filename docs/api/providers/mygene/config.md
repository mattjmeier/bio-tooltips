[**gene-tooltips**](../../README.md)

***

## Interfaces

### GeneTooltipConfig

Defined in: [providers/mygene/config.ts:34](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L34)

#### Extends

- [`CoreTooltipConfig`](../../core/config.md#coretooltipconfig)

#### Properties

##### api

> **api**: `"mygene"`

Defined in: [providers/mygene/config.ts:35](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L35)

##### constrainToViewport

> **constrainToViewport**: `boolean`

Defined in: [core/config.ts:15](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/config.ts#L15)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`constrainToViewport`](../../core/config.md#constraintoviewport)

##### display

> **display**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`TooltipDisplayConfig`](#tooltipdisplayconfig)\>

Defined in: [providers/mygene/config.ts:37](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L37)

###### Overrides

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`display`](../../core/config.md#display)

##### domainCount

> **domainCount**: `number`

Defined in: [providers/mygene/config.ts:41](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L41)

##### generifCount

> **generifCount**: `number`

Defined in: [providers/mygene/config.ts:44](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L44)

##### ideogram

> **ideogram**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`IdeogramConfig`](#ideogramconfig)\>

Defined in: [providers/mygene/config.ts:38](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L38)

##### nestedTippyOptions

> **nestedTippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:12](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/config.ts#L12)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`nestedTippyOptions`](../../core/config.md#nestedtippyoptions)

##### pathwayCount

> **pathwayCount**: `number`

Defined in: [providers/mygene/config.ts:40](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L40)

##### pathwaySource

> **pathwaySource**: `"reactome"` \| `"kegg"` \| `"wikipathways"`

Defined in: [providers/mygene/config.ts:39](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L39)

##### prefetch

> **prefetch**: [`PrefetchMode`](../../core/config.md#prefetchmode)

Defined in: [core/config.ts:8](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/config.ts#L8)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`prefetch`](../../core/config.md#prefetch)

##### prefetchThreshold

> **prefetchThreshold**: `number`

Defined in: [core/config.ts:9](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/config.ts#L9)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`prefetchThreshold`](../../core/config.md#prefetchthreshold)

##### selector

> **selector**: `string`

Defined in: [core/config.ts:7](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/config.ts#L7)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`selector`](../../core/config.md#selector)

##### structureCount

> **structureCount**: `number`

Defined in: [providers/mygene/config.ts:43](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L43)

##### theme

> **theme**: [`TooltipTheme`](../../core/config.md#tooltiptheme)

Defined in: [core/config.ts:10](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/config.ts#L10)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`theme`](../../core/config.md#theme)

##### tippyOptions

> **tippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:11](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/config.ts#L11)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tippyOptions`](../../core/config.md#tippyoptions)

##### tooltipHeight?

> `optional` **tooltipHeight**: `number`

Defined in: [core/config.ts:14](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/config.ts#L14)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tooltipHeight`](../../core/config.md#tooltipheight)

##### tooltipWidth?

> `optional` **tooltipWidth**: `number`

Defined in: [core/config.ts:13](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/config.ts#L13)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tooltipWidth`](../../core/config.md#tooltipwidth)

##### transcriptCount

> **transcriptCount**: `number`

Defined in: [providers/mygene/config.ts:42](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L42)

##### truncateSummary

> **truncateSummary**: `number`

Defined in: [providers/mygene/config.ts:36](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L36)

***

### IdeogramConfig

Defined in: [providers/mygene/config.ts:27](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L27)

#### Properties

##### enabled

> **enabled**: `boolean`

Defined in: [providers/mygene/config.ts:28](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L28)

##### height

> **height**: `number`

Defined in: [providers/mygene/config.ts:30](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L30)

##### showLabels

> **showLabels**: `boolean`

Defined in: [providers/mygene/config.ts:31](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L31)

##### width

> **width**: `number`

Defined in: [providers/mygene/config.ts:29](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L29)

***

### TooltipDisplayConfig

Defined in: [providers/mygene/config.ts:6](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L6)

#### Properties

##### collapsedByDefault?

> `optional` **collapsedByDefault**: `boolean`

Defined in: [providers/mygene/config.ts:19](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L19)

##### collapsible?

> `optional` **collapsible**: `boolean`

Defined in: [providers/mygene/config.ts:18](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L18)

##### domains

> **domains**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:12](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L12)

##### generifs

> **generifs**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:16](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L16)

##### geneTrack

> **geneTrack**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:13](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L13)

##### ideogram

> **ideogram**: `boolean`

Defined in: [providers/mygene/config.ts:10](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L10)

##### links

> **links**: `object`

Defined in: [providers/mygene/config.ts:20](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L20)

###### ensembl?

> `optional` **ensembl**: `boolean`

###### ncbi?

> `optional` **ncbi**: `boolean`

###### wikipedia?

> `optional` **wikipedia**: `boolean`

##### linksSection

> **linksSection**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:17](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L17)

##### location

> **location**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:9](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L9)

##### pathways

> **pathways**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:11](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L11)

##### species

> **species**: `boolean`

Defined in: [providers/mygene/config.ts:8](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L8)

##### structures

> **structures**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:15](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L15)

##### summary

> **summary**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:7](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L7)

##### transcripts

> **transcripts**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:14](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L14)

## Type Aliases

### SectionVisibility

> **SectionVisibility** = `boolean` \| `"expanded"` \| `"collapsed"`

Defined in: [providers/mygene/config.ts:4](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L4)

## Variables

### defaultConfig

> `const` **defaultConfig**: [`GeneTooltipConfig`](#genetooltipconfig)

Defined in: [providers/mygene/config.ts:47](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L47)

## Functions

### mergeConfig()

> **mergeConfig**(`userConfig`): [`GeneTooltipConfig`](#genetooltipconfig)

Defined in: [providers/mygene/config.ts:84](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/config.ts#L84)

#### Parameters

##### userConfig

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`GeneTooltipConfig`](#genetooltipconfig)\> = `{}`

#### Returns

[`GeneTooltipConfig`](#genetooltipconfig)
