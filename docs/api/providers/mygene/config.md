[**bio-tooltips**](../../README.md)

***

## Interfaces

### GeneTooltipConfig

Defined in: [providers/mygene/config.ts:35](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L35)

#### Extends

- [`CoreTooltipConfig`](../../core/config.md#coretooltipconfig)

#### Properties

##### api

> **api**: `"mygene"`

Defined in: [providers/mygene/config.ts:36](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L36)

##### constrainToViewport

> **constrainToViewport**: `boolean`

Defined in: [core/config.ts:18](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/config.ts#L18)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`constrainToViewport`](../../core/config.md#constraintoviewport)

##### debugTimings

> **debugTimings**: `boolean`

Defined in: [core/config.ts:12](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/config.ts#L12)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`debugTimings`](../../core/config.md#debugtimings)

##### display

> **display**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`TooltipDisplayConfig`](#tooltipdisplayconfig)\>

Defined in: [providers/mygene/config.ts:38](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L38)

###### Overrides

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`display`](../../core/config.md#display)

##### domainCount

> **domainCount**: `number`

Defined in: [providers/mygene/config.ts:42](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L42)

##### generifCount

> **generifCount**: `number`

Defined in: [providers/mygene/config.ts:45](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L45)

##### ideogram

> **ideogram**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`IdeogramConfig`](#ideogramconfig)\>

Defined in: [providers/mygene/config.ts:39](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L39)

##### nestedTippyOptions

> **nestedTippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/config.ts#L15)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`nestedTippyOptions`](../../core/config.md#nestedtippyoptions)

##### pathwayCount

> **pathwayCount**: `number`

Defined in: [providers/mygene/config.ts:41](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L41)

##### pathwaySource

> **pathwaySource**: `"reactome"` \| `"kegg"` \| `"wikipathways"`

Defined in: [providers/mygene/config.ts:40](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L40)

##### prefetch

> **prefetch**: [`PrefetchMode`](../../core/config.md#prefetchmode)

Defined in: [core/config.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/config.ts#L9)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`prefetch`](../../core/config.md#prefetch)

##### prefetchThreshold

> **prefetchThreshold**: `number`

Defined in: [core/config.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/config.ts#L10)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`prefetchThreshold`](../../core/config.md#prefetchthreshold)

##### selector

> **selector**: `string`

Defined in: [core/config.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/config.ts#L8)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`selector`](../../core/config.md#selector)

##### structureCount

> **structureCount**: `number`

Defined in: [providers/mygene/config.ts:44](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L44)

##### theme

> **theme**: [`TooltipTheme`](../../core/config.md#tooltiptheme)

Defined in: [core/config.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/config.ts#L13)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`theme`](../../core/config.md#theme)

##### tippyOptions

> **tippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/config.ts#L14)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tippyOptions`](../../core/config.md#tippyoptions)

##### tooltipHeight?

> `optional` **tooltipHeight**: `number`

Defined in: [core/config.ts:17](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/config.ts#L17)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tooltipHeight`](../../core/config.md#tooltipheight)

##### tooltipWidth?

> `optional` **tooltipWidth**: `number`

Defined in: [core/config.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/config.ts#L16)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tooltipWidth`](../../core/config.md#tooltipwidth)

##### transcriptCount

> **transcriptCount**: `number`

Defined in: [providers/mygene/config.ts:43](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L43)

##### truncateSummary

> **truncateSummary**: `number`

Defined in: [providers/mygene/config.ts:37](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L37)

##### visualPreload

> **visualPreload**: [`VisualPreloadMode`](../../core/config.md#visualpreloadmode)

Defined in: [core/config.ts:11](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/config.ts#L11)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`visualPreload`](../../core/config.md#visualpreload)

***

### IdeogramConfig

Defined in: [providers/mygene/config.ts:28](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L28)

#### Properties

##### enabled

> **enabled**: `boolean`

Defined in: [providers/mygene/config.ts:29](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L29)

##### height

> **height**: `number`

Defined in: [providers/mygene/config.ts:31](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L31)

##### showLabels

> **showLabels**: `boolean`

Defined in: [providers/mygene/config.ts:32](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L32)

##### width

> **width**: `number`

Defined in: [providers/mygene/config.ts:30](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L30)

***

### TooltipDisplayConfig

Defined in: [providers/mygene/config.ts:6](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L6)

#### Properties

##### collapsedByDefault?

> `optional` **collapsedByDefault**: `boolean`

Defined in: [providers/mygene/config.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L20)

##### collapsible?

> `optional` **collapsible**: `boolean`

Defined in: [providers/mygene/config.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L19)

##### domains

> **domains**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:12](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L12)

##### footer

> **footer**: `boolean`

Defined in: [providers/mygene/config.ts:18](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L18)

##### generifs

> **generifs**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L16)

##### geneTrack

> **geneTrack**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L13)

##### ideogram

> **ideogram**: `boolean`

Defined in: [providers/mygene/config.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L10)

##### links

> **links**: `object`

Defined in: [providers/mygene/config.ts:21](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L21)

###### ensembl?

> `optional` **ensembl**: `boolean`

###### ncbi?

> `optional` **ncbi**: `boolean`

###### wikipedia?

> `optional` **wikipedia**: `boolean`

##### linksSection

> **linksSection**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:17](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L17)

##### location

> **location**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L9)

##### pathways

> **pathways**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:11](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L11)

##### species

> **species**: `boolean`

Defined in: [providers/mygene/config.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L8)

##### structures

> **structures**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L15)

##### summary

> **summary**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:7](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L7)

##### transcripts

> **transcripts**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L14)

## Type Aliases

### SectionVisibility

> **SectionVisibility** = `boolean` \| `"expanded"` \| `"collapsed"`

Defined in: [providers/mygene/config.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L4)

## Variables

### defaultConfig

> `const` **defaultConfig**: [`GeneTooltipConfig`](#genetooltipconfig)

Defined in: [providers/mygene/config.ts:48](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L48)

## Functions

### mergeConfig()

> **mergeConfig**(`userConfig`): [`GeneTooltipConfig`](#genetooltipconfig)

Defined in: [providers/mygene/config.ts:86](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/config.ts#L86)

#### Parameters

##### userConfig

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`GeneTooltipConfig`](#genetooltipconfig)\> = `{}`

#### Returns

[`GeneTooltipConfig`](#genetooltipconfig)
