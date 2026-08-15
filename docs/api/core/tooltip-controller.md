[**bio-tooltips**](../README.md)

***

## Classes

### TooltipController

Defined in: core/tooltip-controller.ts:26

#### Type Parameters

##### TData

`TData` = `unknown`

#### Constructors

##### Constructor

> **new TooltipController**\<`TData`\>(`reference`, `options`): [`TooltipController`](#tooltipcontroller)\<`TData`\>

Defined in: core/tooltip-controller.ts:70

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

Defined in: core/tooltip-controller.ts:44

##### \_isPinned?

> `optional` **\_isPinned?**: `boolean`

Defined in: core/tooltip-controller.ts:54

##### \_nestedTooltips

> **\_nestedTooltips**: [`TooltipController`](#tooltipcontroller)\<`any`\>[] = `[]`

Defined in: core/tooltip-controller.ts:43

##### \_pinButton?

> `optional` **\_pinButton?**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) \| `null`

Defined in: core/tooltip-controller.ts:55

##### \_renderedVisualSections?

> `optional` **\_renderedVisualSections?**: [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`string`\>

Defined in: core/tooltip-controller.ts:51

##### \_renderingVisualSections?

> `optional` **\_renderingVisualSections?**: [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`string`\>

Defined in: core/tooltip-controller.ts:52

##### \_sectionKeydownHandler?

> `optional` **\_sectionKeydownHandler?**: (`event`) => `void`

Defined in: core/tooltip-controller.ts:48

###### Parameters

###### event

[`KeyboardEvent`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent)

###### Returns

`void`

##### \_sectionToggleHandler?

> `optional` **\_sectionToggleHandler?**: (`event`) => `void`

Defined in: core/tooltip-controller.ts:47

###### Parameters

###### event

[`Event`](https://developer.mozilla.org/docs/Web/API/Event)

###### Returns

`void`

##### \_themeIntent?

> `optional` **\_themeIntent?**: `string`

Defined in: core/tooltip-controller.ts:46

##### \_timingStart?

> `optional` **\_timingStart?**: `number`

Defined in: core/tooltip-controller.ts:53

##### \_uniqueId?

> `optional` **\_uniqueId?**: `string`

Defined in: core/tooltip-controller.ts:45

##### \_visualRenderPromise?

> `optional` **\_visualRenderPromise?**: [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: core/tooltip-controller.ts:50

##### \_visualsRendered?

> `optional` **\_visualsRendered?**: `boolean`

Defined in: core/tooltip-controller.ts:49

##### \_visualViewportResizeHandler?

> `optional` **\_visualViewportResizeHandler?**: () => `void`

Defined in: core/tooltip-controller.ts:56

###### Returns

`void`

##### arrow

> `readonly` **arrow**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: core/tooltip-controller.ts:31

##### box

> `readonly` **box**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: core/tooltip-controller.ts:29

##### content

> `readonly` **content**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: core/tooltip-controller.ts:30

##### options

> **options**: [`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`TData`\>

Defined in: core/tooltip-controller.ts:41

##### reference

> `readonly` **reference**: [`Element`](https://developer.mozilla.org/docs/Web/API/Element)

Defined in: core/tooltip-controller.ts:27

##### root

> `readonly` **root**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: core/tooltip-controller.ts:28

##### state

> `readonly` **state**: `object`

Defined in: core/tooltip-controller.ts:32

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

Defined in: core/tooltip-controller.ts:39

##### theme

> **theme**: `string`

Defined in: core/tooltip-controller.ts:40

#### Methods

##### addNestedTooltip()

> **addNestedTooltip**(`child`): `void`

Defined in: core/tooltip-controller.ts:152

###### Parameters

###### child

[`TooltipController`](#tooltipcontroller)\<`any`\>

###### Returns

`void`

##### destroy()

> **destroy**(): `void`

Defined in: core/tooltip-controller.ts:183

###### Returns

`void`

##### destroyNestedTooltips()

> **destroyNestedTooltips**(): `void`

Defined in: core/tooltip-controller.ts:166

###### Returns

`void`

##### hide()

> **hide**(): `void`

Defined in: core/tooltip-controller.ts:111

###### Returns

`void`

##### removeNestedTooltip()

> **removeNestedTooltip**(`child`): `void`

Defined in: core/tooltip-controller.ts:160

###### Parameters

###### child

[`TooltipController`](#tooltipcontroller)\<`any`\>

###### Returns

`void`

##### setContent()

> **setContent**(`content`): `void`

Defined in: core/tooltip-controller.ts:122

###### Parameters

###### content

`string`

###### Returns

`void`

##### setPinned()

> **setPinned**(`pinned`): `void`

Defined in: core/tooltip-controller.ts:172

###### Parameters

###### pinned

`boolean`

###### Returns

`void`

##### setTheme()

> **setTheme**(`theme`): `void`

Defined in: core/tooltip-controller.ts:130

###### Parameters

###### theme

`string`

###### Returns

`void`

##### show()

> **show**(): `void`

Defined in: core/tooltip-controller.ts:103

###### Returns

`void`

##### updateOptions()

> **updateOptions**(`options`): `void`

Defined in: core/tooltip-controller.ts:137

###### Parameters

###### options

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`TData`\>, `"tooltip"`\>\> & `object`

###### Returns

`void`

##### updatePosition()

> **updatePosition**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: core/tooltip-controller.ts:148

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

## Interfaces

### TooltipControllerHooks

Defined in: core/tooltip-controller.ts:6

#### Type Parameters

##### TData

`TData`

#### Properties

##### onDestroy?

> `optional` **onDestroy?**: (`instance`) => `void`

Defined in: core/tooltip-controller.ts:10

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`void`

##### onHide?

> `optional` **onHide?**: (`instance`) => `false` \| `void`

Defined in: core/tooltip-controller.ts:9

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`false` \| `void`

##### onShow?

> `optional` **onShow?**: (`instance`) => `false` \| `void`

Defined in: core/tooltip-controller.ts:7

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`false` \| `void`

##### onShown?

> `optional` **onShown?**: (`instance`) => `void`

Defined in: core/tooltip-controller.ts:8

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`void`

***

### TooltipControllerOptions

Defined in: core/tooltip-controller.ts:13

#### Type Parameters

##### TData

`TData`

#### Properties

##### constrainToViewport?

> `optional` **constrainToViewport?**: `boolean`

Defined in: core/tooltip-controller.ts:17

##### content?

> `optional` **content?**: `string`

Defined in: core/tooltip-controller.ts:14

##### hooks?

> `optional` **hooks?**: [`TooltipControllerHooks`](#tooltipcontrollerhooks)\<`TData`\>

Defined in: core/tooltip-controller.ts:23

##### interactiveBorder?

> `optional` **interactiveBorder?**: `number`

Defined in: core/tooltip-controller.ts:20

##### interactiveDebounce?

> `optional` **interactiveDebounce?**: `number`

Defined in: core/tooltip-controller.ts:21

##### maxHeight?

> `optional` **maxHeight?**: `number`

Defined in: core/tooltip-controller.ts:19

##### maxWidth?

> `optional` **maxWidth?**: `number`

Defined in: core/tooltip-controller.ts:18

##### parent?

> `optional` **parent?**: [`TooltipController`](#tooltipcontroller)\<`any`\>

Defined in: core/tooltip-controller.ts:22

##### theme

> **theme**: `string`

Defined in: core/tooltip-controller.ts:16

##### tooltip

> **tooltip**: [`TooltipOptions`](config.md#tooltipoptions-1)

Defined in: core/tooltip-controller.ts:15

## Type Aliases

### TooltipStatus

> **TooltipStatus** = `"idle"` \| `"opening"` \| `"open"` \| `"closing"` \| `"destroyed"`

Defined in: core/tooltip-controller.ts:4

## Functions

### createStaticTooltip()

> **createStaticTooltip**(`reference`, `content`, `options`): [`TooltipController`](#tooltipcontroller)

Defined in: core/tooltip-controller.ts:402

#### Parameters

##### reference

[`Element`](https://developer.mozilla.org/docs/Web/API/Element)

##### content

`string`

##### options

[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`unknown`\>, `"content"`\>

#### Returns

[`TooltipController`](#tooltipcontroller)
