[**gene-tooltips**](../../README.md)

***

## Interfaces

### MyChemDisplayConfig

Defined in: [providers/mychem/config.ts:6](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L6)

#### Properties

##### classes

> **classes**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:12](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L12)

##### collapsedByDefault?

> `optional` **collapsedByDefault**: `boolean`

Defined in: [providers/mychem/config.ts:21](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L21)

##### collapsible?

> `optional` **collapsible**: `boolean`

Defined in: [providers/mychem/config.ts:20](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L20)

##### detailedProperties

> **detailedProperties**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:9](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L9)

##### footer

> **footer**: `boolean`

Defined in: [providers/mychem/config.ts:17](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L17)

##### identifiers

> **identifiers**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:16](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L16)

##### identity

> **identity**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:7](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L7)

##### pharmacology

> **pharmacology**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:13](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L13)

##### rawJson

> **rawJson**: `boolean`

Defined in: [providers/mychem/config.ts:18](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L18)

##### regulatory

> **regulatory**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:14](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L14)

##### safety

> **safety**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:15](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L15)

##### sourcePaths

> **sourcePaths**: `boolean`

Defined in: [providers/mychem/config.ts:19](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L19)

##### structureProperties

> **structureProperties**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:8](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L8)

##### summary

> **summary**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:10](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L10)

##### synonyms

> **synonyms**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:11](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L11)

***

### MyChemTooltipConfig

Defined in: [providers/mychem/config.ts:24](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L24)

#### Extends

- [`CoreTooltipConfig`](../../core/config.md#coretooltipconfig)

#### Properties

##### api

> **api**: `"mychem"`

Defined in: [providers/mychem/config.ts:25](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L25)

##### constrainToViewport

> **constrainToViewport**: `boolean`

Defined in: [core/config.ts:15](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/core/config.ts#L15)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`constrainToViewport`](../../core/config.md#constraintoviewport)

##### display

> **display**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`MyChemDisplayConfig`](#mychemdisplayconfig)\>

Defined in: [providers/mychem/config.ts:29](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L29)

###### Overrides

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`display`](../../core/config.md#display)

##### listCount

> **listCount**: `number`

Defined in: [providers/mychem/config.ts:28](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L28)

##### nestedTippyOptions

> **nestedTippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:12](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/core/config.ts#L12)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`nestedTippyOptions`](../../core/config.md#nestedtippyoptions)

##### prefetch

> **prefetch**: [`PrefetchMode`](../../core/config.md#prefetchmode)

Defined in: [core/config.ts:8](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/core/config.ts#L8)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`prefetch`](../../core/config.md#prefetch)

##### prefetchThreshold

> **prefetchThreshold**: `number`

Defined in: [core/config.ts:9](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/core/config.ts#L9)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`prefetchThreshold`](../../core/config.md#prefetchthreshold)

##### selector

> **selector**: `string`

Defined in: [core/config.ts:7](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/core/config.ts#L7)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`selector`](../../core/config.md#selector)

##### synonymCount

> **synonymCount**: `number`

Defined in: [providers/mychem/config.ts:27](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L27)

##### theme

> **theme**: [`TooltipTheme`](../../core/config.md#tooltiptheme)

Defined in: [core/config.ts:10](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/core/config.ts#L10)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`theme`](../../core/config.md#theme)

##### tippyOptions

> **tippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:11](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/core/config.ts#L11)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tippyOptions`](../../core/config.md#tippyoptions)

##### tooltipHeight?

> `optional` **tooltipHeight**: `number`

Defined in: [core/config.ts:14](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/core/config.ts#L14)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tooltipHeight`](../../core/config.md#tooltipheight)

##### tooltipWidth?

> `optional` **tooltipWidth**: `number`

Defined in: [core/config.ts:13](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/core/config.ts#L13)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tooltipWidth`](../../core/config.md#tooltipwidth)

##### truncateSummary

> **truncateSummary**: `number`

Defined in: [providers/mychem/config.ts:26](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L26)

## Type Aliases

### MyChemSectionVisibility

> **MyChemSectionVisibility** = `boolean` \| `"expanded"` \| `"collapsed"`

Defined in: [providers/mychem/config.ts:4](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L4)

## Variables

### defaultMyChemConfig

> `const` **defaultMyChemConfig**: [`MyChemTooltipConfig`](#mychemtooltipconfig)

Defined in: [providers/mychem/config.ts:32](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L32)

## Functions

### mergeConfig()

> **mergeConfig**(`userConfig`): [`MyChemTooltipConfig`](#mychemtooltipconfig)

Defined in: [providers/mychem/config.ts:59](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/config.ts#L59)

#### Parameters

##### userConfig

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`MyChemTooltipConfig`](#mychemtooltipconfig)\> = `{}`

#### Returns

[`MyChemTooltipConfig`](#mychemtooltipconfig)
