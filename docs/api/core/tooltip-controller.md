[**bio-tooltips**](../README.md)

***

## Classes

### TooltipController

Defined in: [core/tooltip-controller.ts:57](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L57)

#### Type Parameters

##### TData

`TData` = `unknown`

#### Constructors

##### Constructor

> **new TooltipController**\<`TData`\>(`reference`, `options`): [`TooltipController`](#tooltipcontroller)\<`TData`\>

Defined in: [core/tooltip-controller.ts:135](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L135)

###### Parameters

###### reference

[`Element`](https://developer.mozilla.org/docs/Web/API/Element)

###### options

[`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`TData`\>

###### Returns

[`TooltipController`](#tooltipcontroller)\<`TData`\>

#### Properties

##### \_entityCacheKey?

> `optional` **\_entityCacheKey?**: `string`

Defined in: [core/tooltip-controller.ts:76](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L76)

##### \_entityData?

> `optional` **\_entityData?**: `TData` \| `null`

Defined in: [core/tooltip-controller.ts:75](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L75)

##### \_isPinned?

> `optional` **\_isPinned?**: `boolean`

Defined in: [core/tooltip-controller.ts:86](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L86)

##### \_isPointerInside?

> `optional` **\_isPointerInside?**: `boolean`

Defined in: [core/tooltip-controller.ts:87](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L87)

##### \_nestedTooltips

> **\_nestedTooltips**: [`TooltipController`](#tooltipcontroller)\<`any`\>[] = `[]`

Defined in: [core/tooltip-controller.ts:74](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L74)

##### \_peerDismissed?

> `optional` **\_peerDismissed?**: `boolean`

Defined in: [core/tooltip-controller.ts:94](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L94)

##### \_pinButton?

> `optional` **\_pinButton?**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) \| `null`

Defined in: [core/tooltip-controller.ts:95](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L95)

##### \_renderedVisualSections?

> `optional` **\_renderedVisualSections?**: [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`string`\>

Defined in: [core/tooltip-controller.ts:83](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L83)

##### \_renderingVisualSections?

> `optional` **\_renderingVisualSections?**: [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`string`\>

Defined in: [core/tooltip-controller.ts:84](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L84)

##### \_sectionKeydownHandler?

> `optional` **\_sectionKeydownHandler?**: (`event`) => `void`

Defined in: [core/tooltip-controller.ts:80](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L80)

###### Parameters

###### event

[`KeyboardEvent`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent)

###### Returns

`void`

##### \_sectionToggleHandler?

> `optional` **\_sectionToggleHandler?**: (`event`) => `void`

Defined in: [core/tooltip-controller.ts:79](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L79)

###### Parameters

###### event

[`Event`](https://developer.mozilla.org/docs/Web/API/Event)

###### Returns

`void`

##### \_themeIntent?

> `optional` **\_themeIntent?**: `string`

Defined in: [core/tooltip-controller.ts:78](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L78)

##### \_timingStart?

> `optional` **\_timingStart?**: `number`

Defined in: [core/tooltip-controller.ts:85](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L85)

##### \_uniqueId?

> `optional` **\_uniqueId?**: `string`

Defined in: [core/tooltip-controller.ts:77](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L77)

##### \_visualRenderPromise?

> `optional` **\_visualRenderPromise?**: [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/tooltip-controller.ts:82](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L82)

##### \_visualsRendered?

> `optional` **\_visualsRendered?**: `boolean`

Defined in: [core/tooltip-controller.ts:81](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L81)

##### \_visualViewportResizeHandler?

> `optional` **\_visualViewportResizeHandler?**: () => `void`

Defined in: [core/tooltip-controller.ts:96](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L96)

###### Returns

`void`

##### arrow

> `readonly` **arrow**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:62](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L62)

##### box

> `readonly` **box**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:60](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L60)

##### content

> `readonly` **content**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:61](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L61)

##### options

> **options**: [`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`TData`\>

Defined in: [core/tooltip-controller.ts:72](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L72)

##### reference

> `readonly` **reference**: [`Element`](https://developer.mozilla.org/docs/Web/API/Element)

Defined in: [core/tooltip-controller.ts:58](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L58)

##### root

> `readonly` **root**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:59](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L59)

##### state

> `readonly` **state**: `object`

Defined in: [core/tooltip-controller.ts:63](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L63)

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

Defined in: [core/tooltip-controller.ts:70](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L70)

##### theme

> **theme**: `string`

Defined in: [core/tooltip-controller.ts:71](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L71)

#### Methods

##### addNestedTooltip()

> **addNestedTooltip**(`child`): `void`

Defined in: [core/tooltip-controller.ts:345](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L345)

###### Parameters

###### child

[`TooltipController`](#tooltipcontroller)\<`any`\>

###### Returns

`void`

##### close()

> **close**(): `void`

Defined in: [core/tooltip-controller.ts:444](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L444)

Explicitly dismiss this controller, including pinned dialogs.

###### Returns

`void`

##### destroy()

> **destroy**(): `void`

Defined in: [core/tooltip-controller.ts:381](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L381)

###### Returns

`void`

##### destroyNestedTooltips()

> **destroyNestedTooltips**(): `void`

Defined in: [core/tooltip-controller.ts:359](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L359)

###### Returns

`void`

##### dismiss()

> **dismiss**(): `void`

Defined in: [core/tooltip-controller.ts:297](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L297)

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

##### enter()

> **enter**(): `void`

Defined in: [core/tooltip-controller.ts:438](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L438)

Explicitly enter a dialog from keyboard activation.

###### Returns

`void`

##### hasFocus()

> **hasFocus**(): `boolean`

Defined in: [core/tooltip-controller.ts:842](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L842)

###### Returns

`boolean`

##### hide()

> **hide**(): `void`

Defined in: [core/tooltip-controller.ts:264](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L264)

###### Returns

`void`

##### isDrawerPresentation()

> **isDrawerPresentation**(): `boolean`

Defined in: [core/tooltip-controller.ts:213](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L213)

The resolved presentation currently used by this controller.

###### Returns

`boolean`

##### open()

> **open**(`options?`): `void`

Defined in: [core/tooltip-controller.ts:422](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L422)

Open immediately, optionally moving focus into the dialog.

###### Parameters

###### options?

[`TooltipOpenOptions`](tooltip-handle.md#tooltipopenoptions) = `{}`

###### Returns

`void`

##### removeNestedTooltip()

> **removeNestedTooltip**(`child`): `void`

Defined in: [core/tooltip-controller.ts:353](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L353)

###### Parameters

###### child

[`TooltipController`](#tooltipcontroller)\<`any`\>

###### Returns

`void`

##### setContent()

> **setContent**(`content`): `void`

Defined in: [core/tooltip-controller.ts:312](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L312)

###### Parameters

###### content

`string`

###### Returns

`void`

##### setPinned()

> **setPinned**(`pinned`): `void`

Defined in: [core/tooltip-controller.ts:365](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L365)

###### Parameters

###### pinned

`boolean`

###### Returns

`void`

##### setPresentation()

> **setPresentation**(`presentation`): `void`

Defined in: [core/tooltip-controller.ts:218](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L218)

Update the presentation setting, including a live auto breakpoint change.

###### Parameters

###### presentation

[`TooltipPresentation`](config.md#tooltippresentation)

###### Returns

`void`

##### setTheme()

> **setTheme**(`theme`): `void`

Defined in: [core/tooltip-controller.ts:321](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L321)

###### Parameters

###### theme

`string`

###### Returns

`void`

##### show()

> **show**(): `void`

Defined in: [core/tooltip-controller.ts:245](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L245)

###### Returns

`void`

##### syncPinButton()

> **syncPinButton**(): `void`

Defined in: [core/tooltip-controller.ts:748](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L748)

Synchronize a rendered pin control with the controller's current state.

###### Returns

`void`

##### updateOptions()

> **updateOptions**(`options`): `void`

Defined in: [core/tooltip-controller.ts:328](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L328)

###### Parameters

###### options

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`TData`\>, `"tooltip"`\>\> & `object`

###### Returns

`void`

##### updatePosition()

> **updatePosition**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/tooltip-controller.ts:341](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L341)

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

## Interfaces

### TooltipControllerHooks

Defined in: [core/tooltip-controller.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L20)

#### Type Parameters

##### TData

`TData`

#### Properties

##### onDestroy?

> `optional` **onDestroy?**: (`instance`) => `void`

Defined in: [core/tooltip-controller.ts:24](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L24)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`void`

##### onHide?

> `optional` **onHide?**: (`instance`) => `false` \| `void`

Defined in: [core/tooltip-controller.ts:23](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L23)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`false` \| `void`

##### onShow?

> `optional` **onShow?**: (`instance`) => `false` \| `void`

Defined in: [core/tooltip-controller.ts:21](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L21)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`false` \| `void`

##### onShown?

> `optional` **onShown?**: (`instance`) => `void`

Defined in: [core/tooltip-controller.ts:22](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L22)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`void`

***

### TooltipControllerOptions

Defined in: [core/tooltip-controller.ts:27](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L27)

#### Type Parameters

##### TData

`TData`

#### Properties

##### accessibleName?

> `optional` **accessibleName?**: `string`

Defined in: [core/tooltip-controller.ts:42](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L42)

##### constrainToViewport?

> `optional` **constrainToViewport?**: `boolean`

Defined in: [core/tooltip-controller.ts:31](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L31)

##### content?

> `optional` **content?**: `string`

Defined in: [core/tooltip-controller.ts:28](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L28)

##### hooks?

> `optional` **hooks?**: [`TooltipControllerHooks`](#tooltipcontrollerhooks)\<`TData`\>

Defined in: [core/tooltip-controller.ts:37](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L37)

##### interactiveBorder?

> `optional` **interactiveBorder?**: `number`

Defined in: [core/tooltip-controller.ts:34](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L34)

##### interactiveDebounce?

> `optional` **interactiveDebounce?**: `number`

Defined in: [core/tooltip-controller.ts:35](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L35)

##### kind?

> `optional` **kind?**: `"dialog"` \| `"tooltip"`

Defined in: [core/tooltip-controller.ts:41](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L41)

##### maxHeight?

> `optional` **maxHeight?**: `number`

Defined in: [core/tooltip-controller.ts:33](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L33)

##### maxWidth?

> `optional` **maxWidth?**: `number`

Defined in: [core/tooltip-controller.ts:32](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L32)

##### parent?

> `optional` **parent?**: [`TooltipController`](#tooltipcontroller)\<`any`\>

Defined in: [core/tooltip-controller.ts:36](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L36)

##### presentation?

> `optional` **presentation?**: [`TooltipPresentation`](config.md#tooltippresentation)

Defined in: [core/tooltip-controller.ts:44](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L44)

Presentation for top-level dialogs. Nested tooltips always use popovers.

##### theme

> **theme**: `string`

Defined in: [core/tooltip-controller.ts:30](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L30)

##### timingConfig?

> `optional` **timingConfig?**: [`CoreTooltipConfig`](config.md#coretooltipconfig)

Defined in: [core/tooltip-controller.ts:40](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L40)

##### tooltip

> **tooltip**: [`TooltipOptions`](config.md#tooltipoptions-1)

Defined in: [core/tooltip-controller.ts:29](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L29)

## Type Aliases

### TooltipStatus

> **TooltipStatus** = `"idle"` \| `"opening"` \| `"open"` \| `"closing"` \| `"destroyed"`

Defined in: [core/tooltip-controller.ts:18](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L18)

## Functions

### createStaticTooltip()

> **createStaticTooltip**(`reference`, `content`, `options`): [`TooltipController`](#tooltipcontroller)

Defined in: [core/tooltip-controller.ts:1057](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L1057)

#### Parameters

##### reference

[`Element`](https://developer.mozilla.org/docs/Web/API/Element)

##### content

`string`

##### options

[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`unknown`\>, `"content"`\>

#### Returns

[`TooltipController`](#tooltipcontroller)
