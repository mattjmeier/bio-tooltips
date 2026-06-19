[**bio-tooltips**](../README.md)

***

## Interfaces

### CoreTooltipConfig

Defined in: [core/config.ts:7](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L7)

#### Extended by

- [`MyChemTooltipConfig`](../providers/mychem/config.md#mychemtooltipconfig)
- [`GeneTooltipConfig`](../providers/mygene/config.md#genetooltipconfig)

#### Properties

##### constrainToViewport

> **constrainToViewport**: `boolean`

Defined in: [core/config.ts:18](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L18)

##### debugTimings

> **debugTimings**: `boolean`

Defined in: [core/config.ts:12](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L12)

##### display?

> `optional` **display**: `unknown`

Defined in: [core/config.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L19)

##### nestedTippyOptions

> **nestedTippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L15)

##### prefetch

> **prefetch**: [`PrefetchMode`](#prefetchmode)

Defined in: [core/config.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L9)

##### prefetchThreshold

> **prefetchThreshold**: `number`

Defined in: [core/config.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L10)

##### selector

> **selector**: `string`

Defined in: [core/config.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L8)

##### theme

> **theme**: [`TooltipTheme`](#tooltiptheme)

Defined in: [core/config.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L13)

##### tippyOptions

> **tippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L14)

##### tooltipHeight?

> `optional` **tooltipHeight**: `number`

Defined in: [core/config.ts:17](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L17)

##### tooltipWidth?

> `optional` **tooltipWidth**: `number`

Defined in: [core/config.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L16)

##### visualPreload

> **visualPreload**: [`VisualPreloadMode`](#visualpreloadmode)

Defined in: [core/config.ts:11](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L11)

## Type Aliases

### PrefetchMode

> **PrefetchMode** = `"smart"` \| `"all"` \| `"none"`

Defined in: [core/config.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L3)

***

### TooltipTheme

> **TooltipTheme** = `"light"` \| `"dark"` \| `"auto"` \| `"material"` \| `"translucent"` \| `"light-border"` \| `undefined`

Defined in: [core/config.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L4)

***

### VisualPreloadMode

> **VisualPreloadMode** = `"none"` \| `"hover"` \| `"init"`

Defined in: [core/config.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L5)

## Variables

### defaultCoreConfig

> `const` **defaultCoreConfig**: [`CoreTooltipConfig`](#coretooltipconfig)

Defined in: [core/config.ts:22](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/config.ts#L22)
