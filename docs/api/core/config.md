[**bio-tooltips**](../README.md)

***

## Interfaces

### CoreTooltipConfig

Defined in: [core/config.ts:18](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L18)

#### Extended by

- [`MyChemTooltipConfig`](../providers/mychem/config.md#mychemtooltipconfig)
- [`GeneTooltipConfig`](../providers/mygene/config.md#genetooltipconfig)

#### Properties

##### constrainToViewport

> **constrainToViewport**: `boolean`

Defined in: [core/config.ts:31](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L31)

##### debugTimings

> **debugTimings**: `boolean`

Defined in: [core/config.ts:23](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L23)

##### display?

> `optional` **display?**: `unknown`

Defined in: [core/config.ts:32](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L32)

##### nestedTippyOptions

> **nestedTippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:28](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L28)

##### onTiming?

> `optional` **onTiming?**: [`TooltipTimingObserver`](#tooltiptimingobserver)

Defined in: [core/config.ts:24](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L24)

##### prefetch

> **prefetch**: [`PrefetchMode`](#prefetchmode)

Defined in: [core/config.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L20)

##### prefetchThreshold

> **prefetchThreshold**: `number`

Defined in: [core/config.ts:21](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L21)

##### sectionVariant

> **sectionVariant**: [`SectionVariant`](#sectionvariant-1)

Defined in: [core/config.ts:26](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L26)

##### selector

> **selector**: `string`

Defined in: [core/config.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L19)

##### theme

> **theme**: [`TooltipTheme`](#tooltiptheme)

Defined in: [core/config.ts:25](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L25)

##### tippyOptions

> **tippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:27](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L27)

##### tooltipHeight?

> `optional` **tooltipHeight?**: `number`

Defined in: [core/config.ts:30](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L30)

##### tooltipWidth?

> `optional` **tooltipWidth?**: `number`

Defined in: [core/config.ts:29](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L29)

##### visualPreload

> **visualPreload**: [`VisualPreloadMode`](#visualpreloadmode)

Defined in: [core/config.ts:22](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L22)

***

### TooltipTimingEvent

Defined in: [core/config.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L8)

#### Properties

##### details?

> `optional` **details?**: [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `unknown`\>

Defined in: [core/config.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L13)

##### elapsedMs

> **elapsedMs**: `number`

Defined in: [core/config.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L10)

##### label

> **label**: `string`

Defined in: [core/config.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L9)

##### timestampMs

> **timestampMs**: `number`

Defined in: [core/config.ts:11](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L11)

##### tooltipId?

> `optional` **tooltipId?**: `string`

Defined in: [core/config.ts:12](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L12)

## Type Aliases

### PrefetchMode

> **PrefetchMode** = `"smart"` \| `"all"` \| `"none"`

Defined in: [core/config.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L3)

***

### SectionVariant

> **SectionVariant** = `"cards"` \| `"dividers"`

Defined in: [core/config.ts:6](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L6)

***

### TooltipTheme

> **TooltipTheme** = `"light"` \| `"dark"` \| `"auto"` \| `"material"` \| `"translucent"` \| `"light-border"` \| `undefined`

Defined in: [core/config.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L4)

***

### TooltipTimingObserver

> **TooltipTimingObserver** = (`event`) => `void`

Defined in: [core/config.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L16)

#### Parameters

##### event

[`TooltipTimingEvent`](#tooltiptimingevent)

#### Returns

`void`

***

### VisualPreloadMode

> **VisualPreloadMode** = `"none"` \| `"hover"` \| `"init"`

Defined in: [core/config.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L5)

## Variables

### defaultCoreConfig

> `const` **defaultCoreConfig**: [`CoreTooltipConfig`](#coretooltipconfig)

Defined in: [core/config.ts:35](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/config.ts#L35)
