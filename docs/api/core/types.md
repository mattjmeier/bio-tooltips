[**bio-tooltips**](../README.md)

***

## Interfaces

### DataProvider

Defined in: [core/types.ts:12](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L12)

#### Type Parameters

##### TData

`TData`

#### Properties

##### fetchBatch

> **fetchBatch**: (`refs`) => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`EntityDataMap`](#entitydatamap)\<`TData`\>\>

Defined in: [core/types.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L16)

###### Parameters

###### refs

[`EntityRef`](#entityref)[]

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`EntityDataMap`](#entitydatamap)\<`TData`\>\>

##### getCacheKey

> **getCacheKey**: (`ref`) => `string`

Defined in: [core/types.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L15)

###### Parameters

###### ref

[`EntityRef`](#entityref)

###### Returns

`string`

##### id

> **id**: `string`

Defined in: [core/types.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L13)

##### parseElement

> **parseElement**: (`el`) => [`EntityRef`](#entityref) \| `null`

Defined in: [core/types.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L14)

###### Parameters

###### el

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

###### Returns

[`EntityRef`](#entityref) \| `null`

***

### EntityRef

Defined in: [core/types.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L5)

#### Properties

##### context?

> `optional` **context?**: [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string` \| `number` \| `boolean` \| `undefined`\>

Defined in: [core/types.ts:7](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L7)

##### query

> **query**: `string`

Defined in: [core/types.ts:6](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L6)

***

### NestedTooltipDefinition

Defined in: [core/types.ts:21](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L21)

#### Properties

##### items

> **items**: [`FormattedItem`](#formatteditem)[]

Defined in: [core/types.ts:23](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L23)

##### selector

> **selector**: `string`

Defined in: [core/types.ts:22](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L22)

***

### RenderTooltipOptions

Defined in: [core/types.ts:26](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L26)

#### Properties

##### uniqueId

> **uniqueId**: `string`

Defined in: [core/types.ts:27](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L27)

***

### TooltipProfile

Defined in: [core/types.ts:38](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L38)

#### Type Parameters

##### TData

`TData`

##### TConfig

`TConfig` *extends* [`CoreTooltipConfig`](config.md#coretooltipconfig) = [`CoreTooltipConfig`](config.md#coretooltipconfig)

#### Properties

##### getNestedTooltipDefinitions?

> `optional` **getNestedTooltipDefinitions?**: (`data`, `config`, `uniqueId`) => [`NestedTooltipDefinition`](#nestedtooltipdefinition)[]

Defined in: [core/types.ts:45](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L45)

###### Parameters

###### data

`TData`

###### config

`TConfig`

###### uniqueId

`string`

###### Returns

[`NestedTooltipDefinition`](#nestedtooltipdefinition)[]

##### id

> **id**: `string`

Defined in: [core/types.ts:39](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L39)

##### invalidElementMessage?

> `optional` **invalidElementMessage?**: `string`

Defined in: [core/types.ts:41](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L41)

##### notFoundHTML?

> `optional` **notFoundHTML?**: `string`

Defined in: [core/types.ts:42](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L42)

##### preload?

> `optional` **preload?**: () => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

Defined in: [core/types.ts:50](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L50)

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

##### provider

> **provider**: [`DataProvider`](#dataprovider)\<`TData`\>

Defined in: [core/types.ts:40](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L40)

##### renderTooltipHTML

> **renderTooltipHTML**: (`data`, `options`, `config`) => `string`

Defined in: [core/types.ts:43](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L43)

###### Parameters

###### data

`TData` \| `null` \| `undefined`

###### options

[`RenderTooltipOptions`](#rendertooltipoptions)

###### config

`TConfig`

###### Returns

`string`

##### renderVisuals?

> `optional` **renderVisuals?**: (`ctx`) => `void` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/types.ts:44](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L44)

###### Parameters

###### ctx

[`VisualRenderContext`](#visualrendercontext)\<`TData`, `TConfig`\>

###### Returns

`void` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### VisualRenderContext

Defined in: [core/types.ts:30](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L30)

#### Type Parameters

##### TData

`TData`

##### TConfig

`TConfig` *extends* [`CoreTooltipConfig`](config.md#coretooltipconfig)

#### Properties

##### config

> **config**: `TConfig`

Defined in: [core/types.ts:33](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L33)

##### data

> **data**: `TData`

Defined in: [core/types.ts:32](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L32)

##### instance

> **instance**: [`TooltipController`](tooltip-controller.md#tooltipcontroller)\<`TData`\>

Defined in: [core/types.ts:31](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L31)

##### sectionKey?

> `optional` **sectionKey?**: `string`

Defined in: [core/types.ts:35](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L35)

##### uniqueId

> **uniqueId**: `string`

Defined in: [core/types.ts:34](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L34)

## Type Aliases

### EntityDataMap

> **EntityDataMap**\<`TData`\> = [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, `TData`\>

Defined in: [core/types.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L10)

#### Type Parameters

##### TData

`TData`

***

### FormattedItem

> **FormattedItem** = `object`

Defined in: [core/types.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L19)

#### Properties

##### name

> **name**: `string`

Defined in: [core/types.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L19)

##### url?

> `optional` **url?**: `string`

Defined in: [core/types.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/types.ts#L19)

## References

### CoreTooltipConfig

Re-exports [CoreTooltipConfig](config.md#coretooltipconfig)
