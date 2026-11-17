[**bio-tooltips**](../README.md)

***

## Interfaces

### DataProvider

Defined in: [core/types.ts:12](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L12)

#### Type Parameters

##### TData

`TData`

#### Properties

##### fetchBatch

> **fetchBatch**: (`refs`, `fields?`) => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`EntityDataMap`](#entitydatamap)\<`TData`\>\>

Defined in: [core/types.ts:17](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L17)

Fetch only the requested annotation fields when supplied.

###### Parameters

###### refs

[`EntityRef`](#entityref)[]

###### fields?

readonly `string`[]

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`EntityDataMap`](#entitydatamap)\<`TData`\>\>

##### getCacheKey

> **getCacheKey**: (`ref`) => `string`

Defined in: [core/types.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L15)

###### Parameters

###### ref

[`EntityRef`](#entityref)

###### Returns

`string`

##### id

> **id**: `string`

Defined in: [core/types.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L13)

##### parseElement

> **parseElement**: (`el`) => [`EntityRef`](#entityref) \| `null`

Defined in: [core/types.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L14)

###### Parameters

###### el

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

###### Returns

[`EntityRef`](#entityref) \| `null`

***

### EntityRef

Defined in: [core/types.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L5)

#### Properties

##### context?

> `optional` **context?**: [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string` \| `number` \| `boolean` \| `undefined`\>

Defined in: [core/types.ts:7](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L7)

##### query

> **query**: `string`

Defined in: [core/types.ts:6](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L6)

***

### NestedTooltipDefinition

Defined in: [core/types.ts:22](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L22)

#### Properties

##### accessibleName?

> `optional` **accessibleName?**: `string`

Defined in: [core/types.ts:25](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L25)

##### items

> **items**: [`FormattedItem`](#formatteditem)[]

Defined in: [core/types.ts:24](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L24)

##### selector

> **selector**: `string`

Defined in: [core/types.ts:23](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L23)

***

### RenderTooltipOptions

Defined in: [core/types.ts:28](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L28)

#### Properties

##### deferredSections?

> `optional` **deferredSections?**: `string`[]

Defined in: [core/types.ts:30](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L30)

##### uniqueId

> **uniqueId**: `string`

Defined in: [core/types.ts:29](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L29)

***

### TooltipProfile

Defined in: [core/types.ts:41](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L41)

#### Type Parameters

##### TData

`TData`

##### TConfig

`TConfig` *extends* [`CoreTooltipConfig`](config.md#coretooltipconfig) = [`CoreTooltipConfig`](config.md#coretooltipconfig)

#### Properties

##### getFieldPlan?

> `optional` **getFieldPlan?**: (`config`) => `object`

Defined in: [core/types.ts:54](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L54)

Initial field projection and field groups deferred until section expansion.

###### Parameters

###### config

`TConfig`

###### Returns

`object`

###### deferred

> **deferred**: [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`[]\>

###### initial

> **initial**: `string`[]

##### getNestedTooltipDefinitions?

> `optional` **getNestedTooltipDefinitions?**: (`data`, `config`, `uniqueId`) => [`NestedTooltipDefinition`](#nestedtooltipdefinition)[]

Defined in: [core/types.ts:48](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L48)

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

Defined in: [core/types.ts:42](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L42)

##### invalidElementMessage?

> `optional` **invalidElementMessage?**: `string`

Defined in: [core/types.ts:44](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L44)

##### notFoundHTML?

> `optional` **notFoundHTML?**: `string`

Defined in: [core/types.ts:45](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L45)

##### preload?

> `optional` **preload?**: () => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

Defined in: [core/types.ts:55](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L55)

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

##### provider

> **provider**: [`DataProvider`](#dataprovider)\<`TData`\>

Defined in: [core/types.ts:43](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L43)

##### renderTooltipHTML

> **renderTooltipHTML**: (`data`, `options`, `config`) => `string`

Defined in: [core/types.ts:46](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L46)

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

Defined in: [core/types.ts:47](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L47)

###### Parameters

###### ctx

[`VisualRenderContext`](#visualrendercontext)\<`TData`, `TConfig`\>

###### Returns

`void` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### VisualRenderContext

Defined in: [core/types.ts:33](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L33)

#### Type Parameters

##### TData

`TData`

##### TConfig

`TConfig` *extends* [`CoreTooltipConfig`](config.md#coretooltipconfig)

#### Properties

##### config

> **config**: `TConfig`

Defined in: [core/types.ts:36](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L36)

##### data

> **data**: `TData`

Defined in: [core/types.ts:35](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L35)

##### instance

> **instance**: [`TooltipController`](tooltip-controller.md#tooltipcontroller)\<`TData`\>

Defined in: [core/types.ts:34](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L34)

##### sectionKey?

> `optional` **sectionKey?**: `string`

Defined in: [core/types.ts:38](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L38)

##### uniqueId

> **uniqueId**: `string`

Defined in: [core/types.ts:37](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L37)

## Type Aliases

### EntityDataMap

> **EntityDataMap**\<`TData`\> = [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, `TData`\>

Defined in: [core/types.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L10)

#### Type Parameters

##### TData

`TData`

***

### FormattedItem

> **FormattedItem** = `object`

Defined in: [core/types.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L20)

#### Properties

##### name

> **name**: `string`

Defined in: [core/types.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L20)

##### url?

> `optional` **url?**: `string`

Defined in: [core/types.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/types.ts#L20)

## References

### CoreTooltipConfig

Re-exports [CoreTooltipConfig](config.md#coretooltipconfig)
