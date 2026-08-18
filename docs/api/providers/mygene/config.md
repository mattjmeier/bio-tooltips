[**bio-tooltips**](../../README.md)

***

## Interfaces

### GeneTooltipConfig

Defined in: [providers/mygene/config.ts:35](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L35)

#### Extends

- [`CoreTooltipConfig`](../../core/config.md#coretooltipconfig)

#### Properties

##### api

> **api**: `"mygene"`

Defined in: [providers/mygene/config.ts:36](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L36)

##### constrainToViewport

> **constrainToViewport**: `boolean`

Defined in: [core/config.ts:67](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/config.ts#L67)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`constrainToViewport`](../../core/config.md#constraintoviewport)

##### debugTimings

> **debugTimings**: `boolean`

Defined in: [core/config.ts:59](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/config.ts#L59)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`debugTimings`](../../core/config.md#debugtimings)

##### display

> **display**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`TooltipDisplayConfig`](#tooltipdisplayconfig)\>

Defined in: [providers/mygene/config.ts:38](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L38)

###### Overrides

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`display`](../../core/config.md#display)

##### domainCount

> **domainCount**: `number`

Defined in: [providers/mygene/config.ts:42](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L42)

##### generifCount

> **generifCount**: `number`

Defined in: [providers/mygene/config.ts:45](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L45)

##### ideogram

> **ideogram**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`IdeogramConfig`](#ideogramconfig)\>

Defined in: [providers/mygene/config.ts:39](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L39)

##### nestedTooltipOptions

> **nestedTooltipOptions**: [`TooltipOptions`](../../core/config.md#tooltipoptions-1)

Defined in: [core/config.ts:64](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/config.ts#L64)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`nestedTooltipOptions`](../../core/config.md#nestedtooltipoptions)

##### onTiming?

> `optional` **onTiming?**: [`TooltipTimingObserver`](../../core/config.md#tooltiptimingobserver)

Defined in: [core/config.ts:60](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/config.ts#L60)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`onTiming`](../../core/config.md#ontiming)

##### pathwayCount

> **pathwayCount**: `number`

Defined in: [providers/mygene/config.ts:41](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L41)

##### pathwaySource

> **pathwaySource**: `"reactome"` \| `"kegg"` \| `"wikipathways"`

Defined in: [providers/mygene/config.ts:40](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L40)

##### prefetch

> **prefetch**: [`PrefetchMode`](../../core/config.md#prefetchmode)

Defined in: [core/config.ts:56](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/config.ts#L56)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`prefetch`](../../core/config.md#prefetch)

##### prefetchThreshold

> **prefetchThreshold**: `number`

Defined in: [core/config.ts:57](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/config.ts#L57)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`prefetchThreshold`](../../core/config.md#prefetchthreshold)

##### sectionVariant

> **sectionVariant**: [`SectionVariant`](../../core/config.md#sectionvariant-1)

Defined in: [core/config.ts:62](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/config.ts#L62)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`sectionVariant`](../../core/config.md#sectionvariant)

##### selector

> **selector**: `string`

Defined in: [core/config.ts:55](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/config.ts#L55)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`selector`](../../core/config.md#selector)

##### structureCount

> **structureCount**: `number`

Defined in: [providers/mygene/config.ts:44](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L44)

##### theme

> **theme**: [`TooltipTheme`](../../core/config.md#tooltiptheme)

Defined in: [core/config.ts:61](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/config.ts#L61)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`theme`](../../core/config.md#theme)

##### tooltipHeight?

> `optional` **tooltipHeight?**: `number`

Defined in: [core/config.ts:66](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/config.ts#L66)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tooltipHeight`](../../core/config.md#tooltipheight)

##### tooltipOptions

> **tooltipOptions**: [`TooltipOptions`](../../core/config.md#tooltipoptions-1)

Defined in: [core/config.ts:63](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/config.ts#L63)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tooltipOptions`](../../core/config.md#tooltipoptions)

##### tooltipWidth?

> `optional` **tooltipWidth?**: `number`

Defined in: [core/config.ts:65](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/config.ts#L65)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tooltipWidth`](../../core/config.md#tooltipwidth)

##### transcriptCount

> **transcriptCount**: `number`

Defined in: [providers/mygene/config.ts:43](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L43)

##### truncateSummary

> **truncateSummary**: `number`

Defined in: [providers/mygene/config.ts:37](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L37)

##### visualPreload

> **visualPreload**: [`VisualPreloadMode`](../../core/config.md#visualpreloadmode)

Defined in: [core/config.ts:58](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/config.ts#L58)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`visualPreload`](../../core/config.md#visualpreload)

***

### IdeogramConfig

Defined in: [providers/mygene/config.ts:28](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L28)

#### Properties

##### enabled

> **enabled**: `boolean`

Defined in: [providers/mygene/config.ts:29](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L29)

##### height

> **height**: `number`

Defined in: [providers/mygene/config.ts:31](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L31)

##### showLabels

> **showLabels**: `boolean`

Defined in: [providers/mygene/config.ts:32](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L32)

##### width

> **width**: `number`

Defined in: [providers/mygene/config.ts:30](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L30)

***

### TooltipDisplayConfig

Defined in: [providers/mygene/config.ts:6](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L6)

#### Properties

##### collapsedByDefault?

> `optional` **collapsedByDefault?**: `boolean`

Defined in: [providers/mygene/config.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L20)

##### collapsible?

> `optional` **collapsible?**: `boolean`

Defined in: [providers/mygene/config.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L19)

##### domains

> **domains**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:12](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L12)

##### footer

> **footer**: `boolean`

Defined in: [providers/mygene/config.ts:18](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L18)

##### generifs

> **generifs**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L16)

##### geneTrack

> **geneTrack**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L13)

##### ideogram

> **ideogram**: `boolean`

Defined in: [providers/mygene/config.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L10)

##### links

> **links**: `object`

Defined in: [providers/mygene/config.ts:21](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L21)

###### ensembl?

> `optional` **ensembl?**: `boolean`

###### ncbi?

> `optional` **ncbi?**: `boolean`

###### wikipedia?

> `optional` **wikipedia?**: `boolean`

##### linksSection

> **linksSection**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:17](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L17)

##### location

> **location**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L9)

##### pathways

> **pathways**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:11](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L11)

##### species

> **species**: `boolean`

Defined in: [providers/mygene/config.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L8)

##### structures

> **structures**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L15)

##### summary

> **summary**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:7](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L7)

##### transcripts

> **transcripts**: [`SectionVisibility`](#sectionvisibility)

Defined in: [providers/mygene/config.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L14)

## Type Aliases

### SectionVisibility

> **SectionVisibility** = `boolean` \| `"expanded"` \| `"collapsed"`

Defined in: [providers/mygene/config.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L4)

## Variables

### defaultConfig

> `const` **defaultConfig**: [`GeneTooltipConfig`](#genetooltipconfig)

Defined in: [providers/mygene/config.ts:48](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L48)

## Functions

### mergeConfig()

> **mergeConfig**(`userConfig?`): [`GeneTooltipConfig`](#genetooltipconfig)

Defined in: [providers/mygene/config.ts:86](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/config.ts#L86)

#### Parameters

##### userConfig?

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`GeneTooltipConfig`](#genetooltipconfig)\> = `{}`

#### Returns

[`GeneTooltipConfig`](#genetooltipconfig)
