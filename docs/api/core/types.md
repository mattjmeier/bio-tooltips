[**gene-tooltips**](../README.md)

***

## Interfaces

### DataProvider

Defined in: [core/types.ts:13](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L13)

#### Type Parameters

##### TData

`TData`

#### Properties

##### fetchBatch()

> **fetchBatch**: (`refs`) => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`EntityDataMap`](#entitydatamap)\<`TData`\>\>

Defined in: [core/types.ts:17](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L17)

###### Parameters

###### refs

[`EntityRef`](#entityref)[]

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`EntityDataMap`](#entitydatamap)\<`TData`\>\>

##### getCacheKey()

> **getCacheKey**: (`ref`) => `string`

Defined in: [core/types.ts:16](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L16)

###### Parameters

###### ref

[`EntityRef`](#entityref)

###### Returns

`string`

##### id

> **id**: `string`

Defined in: [core/types.ts:14](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L14)

##### parseElement()

> **parseElement**: (`el`) => [`EntityRef`](#entityref) \| `null`

Defined in: [core/types.ts:15](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L15)

###### Parameters

###### el

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

###### Returns

[`EntityRef`](#entityref) \| `null`

***

### EntityRef

Defined in: [core/types.ts:6](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L6)

#### Properties

##### context?

> `optional` **context**: [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string` \| `number` \| `boolean` \| `undefined`\>

Defined in: [core/types.ts:8](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L8)

##### query

> **query**: `string`

Defined in: [core/types.ts:7](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L7)

***

### NestedTooltipDefinition

Defined in: [core/types.ts:22](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L22)

#### Properties

##### items

> **items**: [`FormattedItem`](#formatteditem)[]

Defined in: [core/types.ts:24](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L24)

##### selector

> **selector**: `string`

Defined in: [core/types.ts:23](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L23)

***

### RenderTooltipOptions

Defined in: [core/types.ts:45](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L45)

#### Properties

##### uniqueId

> **uniqueId**: `string`

Defined in: [core/types.ts:46](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L46)

***

### TippyInstanceWithCustoms

Defined in: [core/types.ts:27](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L27)

#### Extends

- `Instance`

#### Type Parameters

##### TData

`TData` = `unknown`

#### Properties

##### \_entityData?

> `optional` **\_entityData**: `TData` \| `null`

Defined in: [core/types.ts:29](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L29)

##### \_geneData?

> `optional` **\_geneData**: `TData` \| `null`

Defined in: [core/types.ts:30](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L30)

##### \_isChildTippyVisible?

> `optional` **\_isChildTippyVisible**: `boolean`

Defined in: [core/types.ts:34](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L34)

##### \_isFetching?

> `optional` **\_isFetching**: `boolean`

Defined in: [core/types.ts:31](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L31)

##### \_isFullyShown?

> `optional` **\_isFullyShown**: `boolean`

Defined in: [core/types.ts:35](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L35)

##### \_isPinned?

> `optional` **\_isPinned**: `boolean`

Defined in: [core/types.ts:40](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L40)

##### \_nestedTippys?

> `optional` **\_nestedTippys**: `Instance`\<`Props`\>[]

Defined in: [core/types.ts:28](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L28)

##### \_originalTrigger?

> `optional` **\_originalTrigger**: `string`

Defined in: [core/types.ts:41](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L41)

##### \_pinButton?

> `optional` **\_pinButton**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) \| `null`

Defined in: [core/types.ts:42](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L42)

##### \_sectionKeydownHandler()?

> `optional` **\_sectionKeydownHandler**: (`event`) => `void`

Defined in: [core/types.ts:38](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L38)

###### Parameters

###### event

[`KeyboardEvent`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent)

###### Returns

`void`

##### \_sectionToggleHandler()?

> `optional` **\_sectionToggleHandler**: (`event`) => `void`

Defined in: [core/types.ts:37](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L37)

###### Parameters

###### event

[`Event`](https://developer.mozilla.org/docs/Web/API/Event)

###### Returns

`void`

##### \_themeIntent?

> `optional` **\_themeIntent**: `string`

Defined in: [core/types.ts:33](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L33)

##### \_tomselect?

> `optional` **\_tomselect**: `TomSelect` \| `null`

Defined in: [core/types.ts:36](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L36)

##### \_uniqueId?

> `optional` **\_uniqueId**: `string`

Defined in: [core/types.ts:32](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L32)

##### \_visualsRendered?

> `optional` **\_visualsRendered**: `boolean`

Defined in: [core/types.ts:39](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L39)

***

### TooltipProfile

Defined in: [core/types.ts:57](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L57)

#### Type Parameters

##### TData

`TData`

##### TConfig

`TConfig` *extends* [`CoreTooltipConfig`](config.md#coretooltipconfig) = [`CoreTooltipConfig`](config.md#coretooltipconfig)

#### Properties

##### getNestedTooltipDefinitions()?

> `optional` **getNestedTooltipDefinitions**: (`data`, `config`, `uniqueId`) => [`NestedTooltipDefinition`](#nestedtooltipdefinition)[]

Defined in: [core/types.ts:64](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L64)

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

Defined in: [core/types.ts:58](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L58)

##### invalidElementMessage?

> `optional` **invalidElementMessage**: `string`

Defined in: [core/types.ts:60](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L60)

##### notFoundHTML?

> `optional` **notFoundHTML**: `string`

Defined in: [core/types.ts:61](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L61)

##### preload()?

> `optional` **preload**: () => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

Defined in: [core/types.ts:69](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L69)

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

##### provider

> **provider**: [`DataProvider`](#dataprovider)\<`TData`\>

Defined in: [core/types.ts:59](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L59)

##### renderTooltipHTML()

> **renderTooltipHTML**: (`data`, `options`, `config`) => `string`

Defined in: [core/types.ts:62](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L62)

###### Parameters

###### data

`TData` | `null` | `undefined`

###### options

[`RenderTooltipOptions`](#rendertooltipoptions)

###### config

`TConfig`

###### Returns

`string`

##### renderVisuals()?

> `optional` **renderVisuals**: (`ctx`) => `void` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/types.ts:63](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L63)

###### Parameters

###### ctx

[`VisualRenderContext`](#visualrendercontext)\<`TData`, `TConfig`\>

###### Returns

`void` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### VisualRenderContext

Defined in: [core/types.ts:49](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L49)

#### Type Parameters

##### TData

`TData`

##### TConfig

`TConfig` *extends* [`CoreTooltipConfig`](config.md#coretooltipconfig)

#### Properties

##### config

> **config**: `TConfig`

Defined in: [core/types.ts:52](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L52)

##### data

> **data**: `TData`

Defined in: [core/types.ts:51](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L51)

##### instance

> **instance**: [`TippyInstanceWithCustoms`](#tippyinstancewithcustoms)\<`TData`\>

Defined in: [core/types.ts:50](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L50)

##### sectionKey?

> `optional` **sectionKey**: `string`

Defined in: [core/types.ts:54](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L54)

##### uniqueId

> **uniqueId**: `string`

Defined in: [core/types.ts:53](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L53)

## Type Aliases

### EntityDataMap

> **EntityDataMap**\<`TData`\> = [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, `TData`\>

Defined in: [core/types.ts:11](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L11)

#### Type Parameters

##### TData

`TData`

***

### FormattedItem

> **FormattedItem** = `object`

Defined in: [core/types.ts:20](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L20)

#### Properties

##### name

> **name**: `string`

Defined in: [core/types.ts:20](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L20)

##### url

> **url**: `string`

Defined in: [core/types.ts:20](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/core/types.ts#L20)

## References

### CoreTooltipConfig

Re-exports [CoreTooltipConfig](config.md#coretooltipconfig)
