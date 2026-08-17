[**bio-tooltips**](../README.md)

***

## Classes

### TooltipController

Defined in: [core/tooltip-controller.ts:26](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L26)

#### Type Parameters

##### TData

`TData` = `unknown`

#### Constructors

##### Constructor

> **new TooltipController**\<`TData`\>(`reference`, `options`): [`TooltipController`](#tooltipcontroller)\<`TData`\>

Defined in: [core/tooltip-controller.ts:71](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L71)

###### Parameters

###### reference

[`Element`](https://developer.mozilla.org/docs/Web/API/Element)

###### options

[`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`TData`\>

###### Returns

[`TooltipController`](#tooltipcontroller)\<`TData`\>

#### Properties

##### \_entityData?

> `optional` **\_entityData?**: `TData` \| `null`

Defined in: [core/tooltip-controller.ts:44](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L44)

##### \_isPinned?

> `optional` **\_isPinned?**: `boolean`

Defined in: [core/tooltip-controller.ts:54](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L54)

##### \_nestedTooltips

> **\_nestedTooltips**: [`TooltipController`](#tooltipcontroller)\<`any`\>[] = `[]`

Defined in: [core/tooltip-controller.ts:43](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L43)

##### \_pinButton?

> `optional` **\_pinButton?**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) \| `null`

Defined in: [core/tooltip-controller.ts:55](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L55)

##### \_renderedVisualSections?

> `optional` **\_renderedVisualSections?**: [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`string`\>

Defined in: [core/tooltip-controller.ts:51](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L51)

##### \_renderingVisualSections?

> `optional` **\_renderingVisualSections?**: [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`string`\>

Defined in: [core/tooltip-controller.ts:52](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L52)

##### \_sectionKeydownHandler?

> `optional` **\_sectionKeydownHandler?**: (`event`) => `void`

Defined in: [core/tooltip-controller.ts:48](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L48)

###### Parameters

###### event

[`KeyboardEvent`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent)

###### Returns

`void`

##### \_sectionToggleHandler?

> `optional` **\_sectionToggleHandler?**: (`event`) => `void`

Defined in: [core/tooltip-controller.ts:47](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L47)

###### Parameters

###### event

[`Event`](https://developer.mozilla.org/docs/Web/API/Event)

###### Returns

`void`

##### \_themeIntent?

> `optional` **\_themeIntent?**: `string`

Defined in: [core/tooltip-controller.ts:46](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L46)

##### \_timingStart?

> `optional` **\_timingStart?**: `number`

Defined in: [core/tooltip-controller.ts:53](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L53)

##### \_uniqueId?

> `optional` **\_uniqueId?**: `string`

Defined in: [core/tooltip-controller.ts:45](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L45)

##### \_visualRenderPromise?

> `optional` **\_visualRenderPromise?**: [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/tooltip-controller.ts:50](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L50)

##### \_visualsRendered?

> `optional` **\_visualsRendered?**: `boolean`

Defined in: [core/tooltip-controller.ts:49](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L49)

##### \_visualViewportResizeHandler?

> `optional` **\_visualViewportResizeHandler?**: () => `void`

Defined in: [core/tooltip-controller.ts:56](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L56)

###### Returns

`void`

##### arrow

> `readonly` **arrow**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:31](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L31)

##### box

> `readonly` **box**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:29](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L29)

##### content

> `readonly` **content**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:30](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L30)

##### options

> **options**: [`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`TData`\>

Defined in: [core/tooltip-controller.ts:41](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L41)

##### reference

> `readonly` **reference**: [`Element`](https://developer.mozilla.org/docs/Web/API/Element)

Defined in: [core/tooltip-controller.ts:27](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L27)

##### root

> `readonly` **root**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:28](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L28)

##### state

> `readonly` **state**: `object`

Defined in: [core/tooltip-controller.ts:32](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L32)

###### isDestroyed

> **isDestroyed**: `boolean` = `false`

###### isMounted

> **isMounted**: `boolean` = `false`

###### isShown

> **isShown**: `boolean` = `false`

###### isVisible

> **isVisible**: `boolean` = `false`

##### status

> **status**: [`TooltipStatus`](#tooltipstatus) = `'idle'`

Defined in: [core/tooltip-controller.ts:39](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L39)

##### theme

> **theme**: `string`

Defined in: [core/tooltip-controller.ts:40](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L40)

#### Methods

##### addNestedTooltip()

> **addNestedTooltip**(`child`): `void`

Defined in: [core/tooltip-controller.ts:153](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L153)

###### Parameters

###### child

[`TooltipController`](#tooltipcontroller)\<`any`\>

###### Returns

`void`

##### destroy()

> **destroy**(): `void`

Defined in: [core/tooltip-controller.ts:184](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L184)

###### Returns

`void`

##### destroyNestedTooltips()

> **destroyNestedTooltips**(): `void`

Defined in: [core/tooltip-controller.ts:167](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L167)

###### Returns

`void`

##### hide()

> **hide**(): `void`

Defined in: [core/tooltip-controller.ts:112](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L112)

###### Returns

`void`

##### removeNestedTooltip()

> **removeNestedTooltip**(`child`): `void`

Defined in: [core/tooltip-controller.ts:161](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L161)

###### Parameters

###### child

[`TooltipController`](#tooltipcontroller)\<`any`\>

###### Returns

`void`

##### setContent()

> **setContent**(`content`): `void`

Defined in: [core/tooltip-controller.ts:123](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L123)

###### Parameters

###### content

`string`

###### Returns

`void`

##### setPinned()

> **setPinned**(`pinned`): `void`

Defined in: [core/tooltip-controller.ts:173](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L173)

###### Parameters

###### pinned

`boolean`

###### Returns

`void`

##### setTheme()

> **setTheme**(`theme`): `void`

Defined in: [core/tooltip-controller.ts:131](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L131)

###### Parameters

###### theme

`string`

###### Returns

`void`

##### show()

> **show**(): `void`

Defined in: [core/tooltip-controller.ts:104](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L104)

###### Returns

`void`

##### updateOptions()

> **updateOptions**(`options`): `void`

Defined in: [core/tooltip-controller.ts:138](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L138)

###### Parameters

###### options

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`TData`\>, `"tooltip"`\>\> & `object`

###### Returns

`void`

##### updatePosition()

> **updatePosition**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/tooltip-controller.ts:149](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L149)

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

## Interfaces

### TooltipControllerHooks

Defined in: [core/tooltip-controller.ts:6](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L6)

#### Type Parameters

##### TData

`TData`

#### Properties

##### onDestroy?

> `optional` **onDestroy?**: (`instance`) => `void`

Defined in: [core/tooltip-controller.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L10)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`void`

##### onHide?

> `optional` **onHide?**: (`instance`) => `false` \| `void`

Defined in: [core/tooltip-controller.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L9)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`false` \| `void`

##### onShow?

> `optional` **onShow?**: (`instance`) => `false` \| `void`

Defined in: [core/tooltip-controller.ts:7](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L7)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`false` \| `void`

##### onShown?

> `optional` **onShown?**: (`instance`) => `void`

Defined in: [core/tooltip-controller.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L8)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`void`

***

### TooltipControllerOptions

Defined in: [core/tooltip-controller.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L13)

#### Type Parameters

##### TData

`TData`

#### Properties

##### constrainToViewport?

> `optional` **constrainToViewport?**: `boolean`

Defined in: [core/tooltip-controller.ts:17](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L17)

##### content?

> `optional` **content?**: `string`

Defined in: [core/tooltip-controller.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L14)

##### hooks?

> `optional` **hooks?**: [`TooltipControllerHooks`](#tooltipcontrollerhooks)\<`TData`\>

Defined in: [core/tooltip-controller.ts:23](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L23)

##### interactiveBorder?

> `optional` **interactiveBorder?**: `number`

Defined in: [core/tooltip-controller.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L20)

##### interactiveDebounce?

> `optional` **interactiveDebounce?**: `number`

Defined in: [core/tooltip-controller.ts:21](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L21)

##### maxHeight?

> `optional` **maxHeight?**: `number`

Defined in: [core/tooltip-controller.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L19)

##### maxWidth?

> `optional` **maxWidth?**: `number`

Defined in: [core/tooltip-controller.ts:18](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L18)

##### parent?

> `optional` **parent?**: [`TooltipController`](#tooltipcontroller)\<`any`\>

Defined in: [core/tooltip-controller.ts:22](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L22)

##### theme

> **theme**: `string`

Defined in: [core/tooltip-controller.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L16)

##### tooltip

> **tooltip**: [`TooltipOptions`](config.md#tooltipoptions-1)

Defined in: [core/tooltip-controller.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L15)

## Type Aliases

### TooltipStatus

> **TooltipStatus** = `"idle"` \| `"opening"` \| `"open"` \| `"closing"` \| `"destroyed"`

Defined in: [core/tooltip-controller.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L4)

## Functions

### createStaticTooltip()

> **createStaticTooltip**(`reference`, `content`, `options`): [`TooltipController`](#tooltipcontroller)

Defined in: [core/tooltip-controller.ts:445](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/tooltip-controller.ts#L445)

#### Parameters

##### reference

[`Element`](https://developer.mozilla.org/docs/Web/API/Element)

##### content

`string`

##### options

[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`unknown`\>, `"content"`\>

#### Returns

[`TooltipController`](#tooltipcontroller)
