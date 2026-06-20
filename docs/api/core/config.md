[**bio-tooltips**](../README.md)

***

## Interfaces

### CoreTooltipConfig

Defined in: [core/config.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L8)

#### Extended by

- [`MyChemTooltipConfig`](../providers/mychem/config.md#mychemtooltipconfig)
- [`GeneTooltipConfig`](../providers/mygene/config.md#genetooltipconfig)

#### Properties

##### constrainToViewport

> **constrainToViewport**: `boolean`

Defined in: [core/config.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L20)

##### debugTimings

> **debugTimings**: `boolean`

Defined in: [core/config.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L13)

##### display?

> `optional` **display**: `unknown`

Defined in: [core/config.ts:21](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L21)

##### nestedTippyOptions

> **nestedTippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:17](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L17)

##### prefetch

> **prefetch**: [`PrefetchMode`](#prefetchmode)

Defined in: [core/config.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L10)

##### prefetchThreshold

> **prefetchThreshold**: `number`

Defined in: [core/config.ts:11](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L11)

##### sectionVariant

> **sectionVariant**: [`SectionVariant`](#sectionvariant-1)

Defined in: [core/config.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L15)

##### selector

> **selector**: `string`

Defined in: [core/config.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L9)

##### theme

> **theme**: [`TooltipTheme`](#tooltiptheme)

Defined in: [core/config.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L14)

##### tippyOptions

> **tippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L16)

##### tooltipHeight?

> `optional` **tooltipHeight**: `number`

Defined in: [core/config.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L19)

##### tooltipWidth?

> `optional` **tooltipWidth**: `number`

Defined in: [core/config.ts:18](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L18)

##### visualPreload

> **visualPreload**: [`VisualPreloadMode`](#visualpreloadmode)

Defined in: [core/config.ts:12](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L12)

## Type Aliases

### PrefetchMode

> **PrefetchMode** = `"smart"` \| `"all"` \| `"none"`

Defined in: [core/config.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L3)

***

### SectionVariant

> **SectionVariant** = `"cards"` \| `"dividers"`

Defined in: [core/config.ts:6](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L6)

***

### TooltipTheme

> **TooltipTheme** = `"light"` \| `"dark"` \| `"auto"` \| `"material"` \| `"translucent"` \| `"light-border"` \| `undefined`

Defined in: [core/config.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L4)

***

### VisualPreloadMode

> **VisualPreloadMode** = `"none"` \| `"hover"` \| `"init"`

Defined in: [core/config.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L5)

## Variables

### defaultCoreConfig

> `const` **defaultCoreConfig**: [`CoreTooltipConfig`](#coretooltipconfig)

Defined in: [core/config.ts:24](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/config.ts#L24)
