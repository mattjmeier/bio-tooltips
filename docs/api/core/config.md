[**gene-tooltips**](../README.md)

***

## Interfaces

### CoreTooltipConfig

Defined in: [core/config.ts:6](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/core/config.ts#L6)

#### Extended by

- [`GeneTooltipConfig`](../providers/mygene/config.md#genetooltipconfig)

#### Properties

##### constrainToViewport

> **constrainToViewport**: `boolean`

Defined in: [core/config.ts:15](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/core/config.ts#L15)

##### display?

> `optional` **display**: `unknown`

Defined in: [core/config.ts:16](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/core/config.ts#L16)

##### nestedTippyOptions

> **nestedTippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:12](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/core/config.ts#L12)

##### prefetch

> **prefetch**: [`PrefetchMode`](#prefetchmode)

Defined in: [core/config.ts:8](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/core/config.ts#L8)

##### prefetchThreshold

> **prefetchThreshold**: `number`

Defined in: [core/config.ts:9](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/core/config.ts#L9)

##### selector

> **selector**: `string`

Defined in: [core/config.ts:7](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/core/config.ts#L7)

##### theme

> **theme**: [`TooltipTheme`](#tooltiptheme)

Defined in: [core/config.ts:10](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/core/config.ts#L10)

##### tippyOptions

> **tippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:11](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/core/config.ts#L11)

##### tooltipHeight?

> `optional` **tooltipHeight**: `number`

Defined in: [core/config.ts:14](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/core/config.ts#L14)

##### tooltipWidth?

> `optional` **tooltipWidth**: `number`

Defined in: [core/config.ts:13](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/core/config.ts#L13)

## Type Aliases

### PrefetchMode

> **PrefetchMode** = `"smart"` \| `"all"` \| `"none"`

Defined in: [core/config.ts:3](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/core/config.ts#L3)

***

### TooltipTheme

> **TooltipTheme** = `"light"` \| `"dark"` \| `"auto"` \| `"material"` \| `"translucent"` \| `"light-border"` \| `undefined`

Defined in: [core/config.ts:4](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/core/config.ts#L4)

## Variables

### defaultCoreConfig

> `const` **defaultCoreConfig**: [`CoreTooltipConfig`](#coretooltipconfig)

Defined in: [core/config.ts:19](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/core/config.ts#L19)
