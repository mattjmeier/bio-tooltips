[**bio-tooltips**](../../README.md)

***

## Interfaces

### MyChemDisplayConfig

Defined in: [providers/mychem/config.ts:18](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L18)

#### Properties

##### classes

> **classes**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:24](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L24)

##### collapsedByDefault?

> `optional` **collapsedByDefault**: `boolean`

Defined in: [providers/mychem/config.ts:33](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L33)

##### collapsible?

> `optional` **collapsible**: `boolean`

Defined in: [providers/mychem/config.ts:32](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L32)

##### detailedProperties

> **detailedProperties**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:21](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L21)

##### footer

> **footer**: `boolean`

Defined in: [providers/mychem/config.ts:29](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L29)

##### identifiers

> **identifiers**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:28](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L28)

##### identity

> **identity**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L19)

##### pharmacology

> **pharmacology**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:25](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L25)

##### rawJson

> **rawJson**: `boolean`

Defined in: [providers/mychem/config.ts:30](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L30)

##### regulatory

> **regulatory**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:26](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L26)

##### safety

> **safety**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:27](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L27)

##### sourcePaths

> **sourcePaths**: `boolean`

Defined in: [providers/mychem/config.ts:31](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L31)

##### structureProperties

> **structureProperties**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L20)

##### summary

> **summary**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:22](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L22)

##### synonyms

> **synonyms**: [`MyChemSectionVisibility`](#mychemsectionvisibility)

Defined in: [providers/mychem/config.ts:23](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L23)

***

### MyChemStructureRenderContext

Defined in: [providers/mychem/config.ts:7](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L7)

#### Properties

##### alt

> **alt**: `string`

Defined in: [providers/mychem/config.ts:11](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L11)

##### data

> **data**: [`MyChemInfoResult`](types.md#mycheminforesult)

Defined in: [providers/mychem/config.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L10)

##### smiles?

> `optional` **smiles**: `string`

Defined in: [providers/mychem/config.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L9)

##### structure

> **structure**: `object`

Defined in: [providers/mychem/config.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L8)

###### kind

> **kind**: `"inchi"` \| `"cid"` \| `"smiles"`

###### value

> **value**: `string`

***

### MyChemTooltipConfig

Defined in: [providers/mychem/config.ts:36](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L36)

#### Extends

- [`CoreTooltipConfig`](../../core/config.md#coretooltipconfig)

#### Properties

##### api

> **api**: `"mychem"`

Defined in: [providers/mychem/config.ts:37](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L37)

##### constrainToViewport

> **constrainToViewport**: `boolean`

Defined in: [core/config.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/core/config.ts#L15)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`constrainToViewport`](../../core/config.md#constraintoviewport)

##### display

> **display**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`MyChemDisplayConfig`](#mychemdisplayconfig)\>

Defined in: [providers/mychem/config.ts:41](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L41)

###### Overrides

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`display`](../../core/config.md#display)

##### listCount

> **listCount**: `number`

Defined in: [providers/mychem/config.ts:40](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L40)

##### nestedTippyOptions

> **nestedTippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:12](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/core/config.ts#L12)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`nestedTippyOptions`](../../core/config.md#nestedtippyoptions)

##### prefetch

> **prefetch**: [`PrefetchMode`](../../core/config.md#prefetchmode)

Defined in: [core/config.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/core/config.ts#L8)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`prefetch`](../../core/config.md#prefetch)

##### prefetchThreshold

> **prefetchThreshold**: `number`

Defined in: [core/config.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/core/config.ts#L9)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`prefetchThreshold`](../../core/config.md#prefetchthreshold)

##### selector

> **selector**: `string`

Defined in: [core/config.ts:7](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/core/config.ts#L7)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`selector`](../../core/config.md#selector)

##### structureRenderer?

> `optional` **structureRenderer**: [`MyChemStructureRenderer`](#mychemstructurerenderer)

Defined in: [providers/mychem/config.ts:42](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L42)

##### synonymCount

> **synonymCount**: `number`

Defined in: [providers/mychem/config.ts:39](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L39)

##### theme

> **theme**: [`TooltipTheme`](../../core/config.md#tooltiptheme)

Defined in: [core/config.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/core/config.ts#L10)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`theme`](../../core/config.md#theme)

##### tippyOptions

> **tippyOptions**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`Props`\>

Defined in: [core/config.ts:11](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/core/config.ts#L11)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tippyOptions`](../../core/config.md#tippyoptions)

##### tooltipHeight?

> `optional` **tooltipHeight**: `number`

Defined in: [core/config.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/core/config.ts#L14)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tooltipHeight`](../../core/config.md#tooltipheight)

##### tooltipWidth?

> `optional` **tooltipWidth**: `number`

Defined in: [core/config.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/core/config.ts#L13)

###### Inherited from

[`CoreTooltipConfig`](../../core/config.md#coretooltipconfig).[`tooltipWidth`](../../core/config.md#tooltipwidth)

##### truncateSummary

> **truncateSummary**: `number`

Defined in: [providers/mychem/config.ts:38](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L38)

## Type Aliases

### MyChemSectionVisibility

> **MyChemSectionVisibility** = `boolean` \| `"expanded"` \| `"collapsed"`

Defined in: [providers/mychem/config.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L5)

***

### MyChemStructureRenderer()

> **MyChemStructureRenderer** = (`context`) => `string` \| `null` \| `undefined`

Defined in: [providers/mychem/config.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L14)

#### Parameters

##### context

[`MyChemStructureRenderContext`](#mychemstructurerendercontext)

#### Returns

`string` \| `null` \| `undefined`

## Variables

### defaultMyChemConfig

> `const` **defaultMyChemConfig**: [`MyChemTooltipConfig`](#mychemtooltipconfig)

Defined in: [providers/mychem/config.ts:45](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L45)

## Functions

### mergeConfig()

> **mergeConfig**(`userConfig`): [`MyChemTooltipConfig`](#mychemtooltipconfig)

Defined in: [providers/mychem/config.ts:72](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/config.ts#L72)

#### Parameters

##### userConfig

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`MyChemTooltipConfig`](#mychemtooltipconfig)\> = `{}`

#### Returns

[`MyChemTooltipConfig`](#mychemtooltipconfig)
