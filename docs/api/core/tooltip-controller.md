[**bio-tooltips**](../README.md)

***

## Classes

### TooltipController

Defined in: [core/tooltip-controller.ts:31](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L31)

#### Type Parameters

##### TData

`TData` = `unknown`

#### Constructors

##### Constructor

> **new TooltipController**\<`TData`\>(`reference`, `options`): [`TooltipController`](#tooltipcontroller)\<`TData`\>

Defined in: [core/tooltip-controller.ts:91](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L91)

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

Defined in: [core/tooltip-controller.ts:49](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L49)

##### \_isPinned?

> `optional` **\_isPinned?**: `boolean`

Defined in: [core/tooltip-controller.ts:59](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L59)

##### \_nestedTooltips

> **\_nestedTooltips**: [`TooltipController`](#tooltipcontroller)\<`any`\>[] = `[]`

Defined in: [core/tooltip-controller.ts:48](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L48)

##### \_peerDismissed?

> `optional` **\_peerDismissed?**: `boolean`

Defined in: [core/tooltip-controller.ts:65](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L65)

##### \_pinButton?

> `optional` **\_pinButton?**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) \| `null`

Defined in: [core/tooltip-controller.ts:66](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L66)

##### \_renderedVisualSections?

> `optional` **\_renderedVisualSections?**: [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`string`\>

Defined in: [core/tooltip-controller.ts:56](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L56)

##### \_renderingVisualSections?

> `optional` **\_renderingVisualSections?**: [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`string`\>

Defined in: [core/tooltip-controller.ts:57](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L57)

##### \_sectionKeydownHandler?

> `optional` **\_sectionKeydownHandler?**: (`event`) => `void`

Defined in: [core/tooltip-controller.ts:53](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L53)

###### Parameters

###### event

[`KeyboardEvent`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent)

###### Returns

`void`

##### \_sectionToggleHandler?

> `optional` **\_sectionToggleHandler?**: (`event`) => `void`

Defined in: [core/tooltip-controller.ts:52](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L52)

###### Parameters

###### event

[`Event`](https://developer.mozilla.org/docs/Web/API/Event)

###### Returns

`void`

##### \_themeIntent?

> `optional` **\_themeIntent?**: `string`

Defined in: [core/tooltip-controller.ts:51](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L51)

##### \_timingStart?

> `optional` **\_timingStart?**: `number`

Defined in: [core/tooltip-controller.ts:58](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L58)

##### \_uniqueId?

> `optional` **\_uniqueId?**: `string`

Defined in: [core/tooltip-controller.ts:50](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L50)

##### \_visualRenderPromise?

> `optional` **\_visualRenderPromise?**: [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/tooltip-controller.ts:55](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L55)

##### \_visualsRendered?

> `optional` **\_visualsRendered?**: `boolean`

Defined in: [core/tooltip-controller.ts:54](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L54)

##### \_visualViewportResizeHandler?

> `optional` **\_visualViewportResizeHandler?**: () => `void`

Defined in: [core/tooltip-controller.ts:67](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L67)

###### Returns

`void`

##### arrow

> `readonly` **arrow**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:36](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L36)

##### box

> `readonly` **box**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:34](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L34)

##### content

> `readonly` **content**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:35](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L35)

##### options

> **options**: [`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`TData`\>

Defined in: [core/tooltip-controller.ts:46](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L46)

##### reference

> `readonly` **reference**: [`Element`](https://developer.mozilla.org/docs/Web/API/Element)

Defined in: [core/tooltip-controller.ts:32](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L32)

##### root

> `readonly` **root**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:33](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L33)

##### state

> `readonly` **state**: `object`

Defined in: [core/tooltip-controller.ts:37](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L37)

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

Defined in: [core/tooltip-controller.ts:44](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L44)

##### theme

> **theme**: `string`

Defined in: [core/tooltip-controller.ts:45](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L45)

#### Methods

##### addNestedTooltip()

> **addNestedTooltip**(`child`): `void`

Defined in: [core/tooltip-controller.ts:219](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L219)

###### Parameters

###### child

[`TooltipController`](#tooltipcontroller)\<`any`\>

###### Returns

`void`

##### destroy()

> **destroy**(): `void`

Defined in: [core/tooltip-controller.ts:250](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L250)

###### Returns

`void`

##### destroyNestedTooltips()

> **destroyNestedTooltips**(): `void`

Defined in: [core/tooltip-controller.ts:233](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L233)

###### Returns

`void`

##### dismiss()

> **dismiss**(): `void`

Defined in: [core/tooltip-controller.ts:177](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L177)

Close this tooltip immediately, bypassing the interactive hide debounce and
the pointer bridge that otherwise keep an open panel alive while the cursor
drifts toward the next trigger. The engine calls this on the open siblings
whenever a tooltip opens so only one top-level tooltip is visible at a time.
Pinned tooltips are left untouched.

The `_peerDismissed` flag marks this close as "lost to a sibling" so that
hovering this tooltip's own panel cannot revive it (its panel may still be
under the cursor, now covered by the sibling's panel). The flag is cleared
once the tooltip is fully unmounted or genuinely reopens.

###### Returns

`void`

##### hide()

> **hide**(): `void`

Defined in: [core/tooltip-controller.ts:146](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L146)

###### Returns

`void`

##### removeNestedTooltip()

> **removeNestedTooltip**(`child`): `void`

Defined in: [core/tooltip-controller.ts:227](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L227)

###### Parameters

###### child

[`TooltipController`](#tooltipcontroller)\<`any`\>

###### Returns

`void`

##### setContent()

> **setContent**(`content`): `void`

Defined in: [core/tooltip-controller.ts:189](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L189)

###### Parameters

###### content

`string`

###### Returns

`void`

##### setPinned()

> **setPinned**(`pinned`): `void`

Defined in: [core/tooltip-controller.ts:239](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L239)

###### Parameters

###### pinned

`boolean`

###### Returns

`void`

##### setTheme()

> **setTheme**(`theme`): `void`

Defined in: [core/tooltip-controller.ts:197](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L197)

###### Parameters

###### theme

`string`

###### Returns

`void`

##### show()

> **show**(): `void`

Defined in: [core/tooltip-controller.ts:127](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L127)

###### Returns

`void`

##### updateOptions()

> **updateOptions**(`options`): `void`

Defined in: [core/tooltip-controller.ts:204](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L204)

###### Parameters

###### options

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`TData`\>, `"tooltip"`\>\> & `object`

###### Returns

`void`

##### updatePosition()

> **updatePosition**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/tooltip-controller.ts:215](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L215)

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

## Interfaces

### TooltipControllerHooks

Defined in: [core/tooltip-controller.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L8)

#### Type Parameters

##### TData

`TData`

#### Properties

##### onDestroy?

> `optional` **onDestroy?**: (`instance`) => `void`

Defined in: [core/tooltip-controller.ts:12](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L12)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`void`

##### onHide?

> `optional` **onHide?**: (`instance`) => `false` \| `void`

Defined in: [core/tooltip-controller.ts:11](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L11)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`false` \| `void`

##### onShow?

> `optional` **onShow?**: (`instance`) => `false` \| `void`

Defined in: [core/tooltip-controller.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L9)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`false` \| `void`

##### onShown?

> `optional` **onShown?**: (`instance`) => `void`

Defined in: [core/tooltip-controller.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L10)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`void`

***

### TooltipControllerOptions

Defined in: [core/tooltip-controller.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L15)

#### Type Parameters

##### TData

`TData`

#### Properties

##### constrainToViewport?

> `optional` **constrainToViewport?**: `boolean`

Defined in: [core/tooltip-controller.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L19)

##### content?

> `optional` **content?**: `string`

Defined in: [core/tooltip-controller.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L16)

##### hooks?

> `optional` **hooks?**: [`TooltipControllerHooks`](#tooltipcontrollerhooks)\<`TData`\>

Defined in: [core/tooltip-controller.ts:25](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L25)

##### interactiveBorder?

> `optional` **interactiveBorder?**: `number`

Defined in: [core/tooltip-controller.ts:22](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L22)

##### interactiveDebounce?

> `optional` **interactiveDebounce?**: `number`

Defined in: [core/tooltip-controller.ts:23](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L23)

##### maxHeight?

> `optional` **maxHeight?**: `number`

Defined in: [core/tooltip-controller.ts:21](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L21)

##### maxWidth?

> `optional` **maxWidth?**: `number`

Defined in: [core/tooltip-controller.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L20)

##### parent?

> `optional` **parent?**: [`TooltipController`](#tooltipcontroller)\<`any`\>

Defined in: [core/tooltip-controller.ts:24](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L24)

##### theme

> **theme**: `string`

Defined in: [core/tooltip-controller.ts:18](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L18)

##### timingConfig?

> `optional` **timingConfig?**: [`CoreTooltipConfig`](config.md#coretooltipconfig)

Defined in: [core/tooltip-controller.ts:28](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L28)

##### tooltip

> **tooltip**: [`TooltipOptions`](config.md#tooltipoptions-1)

Defined in: [core/tooltip-controller.ts:17](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L17)

## Type Aliases

### TooltipStatus

> **TooltipStatus** = `"idle"` \| `"opening"` \| `"open"` \| `"closing"` \| `"destroyed"`

Defined in: [core/tooltip-controller.ts:6](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L6)

## Functions

### createStaticTooltip()

> **createStaticTooltip**(`reference`, `content`, `options`): [`TooltipController`](#tooltipcontroller)

Defined in: [core/tooltip-controller.ts:593](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L593)

#### Parameters

##### reference

[`Element`](https://developer.mozilla.org/docs/Web/API/Element)

##### content

`string`

##### options

[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`unknown`\>, `"content"`\>

#### Returns

[`TooltipController`](#tooltipcontroller)
