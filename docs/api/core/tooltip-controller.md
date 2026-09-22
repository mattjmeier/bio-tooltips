[**bio-tooltips**](../README.md)

***

## Classes

### TooltipController

Defined in: [core/tooltip-controller.ts:94](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L94)

#### Type Parameters

##### TData

`TData` = `unknown`

#### Constructors

##### Constructor

> **new TooltipController**\<`TData`\>(`reference`, `options`): [`TooltipController`](#tooltipcontroller)\<`TData`\>

Defined in: [core/tooltip-controller.ts:183](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L183)

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

Defined in: [core/tooltip-controller.ts:113](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L113)

##### \_entityData?

> `optional` **\_entityData?**: `TData` \| `null`

Defined in: [core/tooltip-controller.ts:112](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L112)

##### \_isPinned?

> `optional` **\_isPinned?**: `boolean`

Defined in: [core/tooltip-controller.ts:123](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L123)

##### \_isPointerInside?

> `optional` **\_isPointerInside?**: `boolean`

Defined in: [core/tooltip-controller.ts:124](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L124)

##### \_nestedTooltips

> **\_nestedTooltips**: [`TooltipController`](#tooltipcontroller)\<`any`\>[] = `[]`

Defined in: [core/tooltip-controller.ts:111](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L111)

##### \_peerDismissed?

> `optional` **\_peerDismissed?**: `boolean`

Defined in: [core/tooltip-controller.ts:131](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L131)

##### \_pinButton?

> `optional` **\_pinButton?**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) \| `null`

Defined in: [core/tooltip-controller.ts:132](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L132)

##### \_renderedVisualSections?

> `optional` **\_renderedVisualSections?**: [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`string`\>

Defined in: [core/tooltip-controller.ts:120](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L120)

##### \_renderingVisualSections?

> `optional` **\_renderingVisualSections?**: [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`string`\>

Defined in: [core/tooltip-controller.ts:121](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L121)

##### \_sectionKeydownHandler?

> `optional` **\_sectionKeydownHandler?**: (`event`) => `void`

Defined in: [core/tooltip-controller.ts:117](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L117)

###### Parameters

###### event

[`KeyboardEvent`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent)

###### Returns

`void`

##### \_sectionToggleHandler?

> `optional` **\_sectionToggleHandler?**: (`event`) => `void`

Defined in: [core/tooltip-controller.ts:116](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L116)

###### Parameters

###### event

[`Event`](https://developer.mozilla.org/docs/Web/API/Event)

###### Returns

`void`

##### \_themeIntent?

> `optional` **\_themeIntent?**: `string`

Defined in: [core/tooltip-controller.ts:115](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L115)

##### \_timingStart?

> `optional` **\_timingStart?**: `number`

Defined in: [core/tooltip-controller.ts:122](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L122)

##### \_uniqueId?

> `optional` **\_uniqueId?**: `string`

Defined in: [core/tooltip-controller.ts:114](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L114)

##### \_visualRenderPromise?

> `optional` **\_visualRenderPromise?**: [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/tooltip-controller.ts:119](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L119)

##### \_visualsRendered?

> `optional` **\_visualsRendered?**: `boolean`

Defined in: [core/tooltip-controller.ts:118](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L118)

##### \_visualViewportResizeHandler?

> `optional` **\_visualViewportResizeHandler?**: () => `void`

Defined in: [core/tooltip-controller.ts:133](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L133)

###### Returns

`void`

##### arrow

> `readonly` **arrow**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:99](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L99)

##### box

> `readonly` **box**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:97](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L97)

##### content

> `readonly` **content**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:98](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L98)

##### options

> **options**: [`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`TData`\>

Defined in: [core/tooltip-controller.ts:109](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L109)

##### reference

> `readonly` **reference**: [`Element`](https://developer.mozilla.org/docs/Web/API/Element)

Defined in: [core/tooltip-controller.ts:95](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L95)

##### root

> `readonly` **root**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:96](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L96)

##### state

> `readonly` **state**: `object`

Defined in: [core/tooltip-controller.ts:100](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L100)

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

Defined in: [core/tooltip-controller.ts:107](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L107)

##### theme

> **theme**: `string`

Defined in: [core/tooltip-controller.ts:108](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L108)

#### Methods

##### addNestedTooltip()

> **addNestedTooltip**(`child`): `void`

Defined in: [core/tooltip-controller.ts:431](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L431)

###### Parameters

###### child

[`TooltipController`](#tooltipcontroller)\<`any`\>

###### Returns

`void`

##### close()

> **close**(): `void`

Defined in: [core/tooltip-controller.ts:536](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L536)

Explicitly dismiss this controller, including pinned dialogs.

###### Returns

`void`

##### destroy()

> **destroy**(): `void`

Defined in: [core/tooltip-controller.ts:469](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L469)

###### Returns

`void`

##### destroyNestedTooltips()

> **destroyNestedTooltips**(): `void`

Defined in: [core/tooltip-controller.ts:445](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L445)

###### Returns

`void`

##### dismiss()

> **dismiss**(): `void`

Defined in: [core/tooltip-controller.ts:380](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L380)

Close this tooltip immediately, bypassing the interactive hide debounce and
the pointer bridge that otherwise keep an open panel alive while the cursor
drifts toward the next trigger. The engine calls this on the open siblings
whenever a tooltip opens so only one top-level tooltip is visible at a time.
Pinned tooltips are left untouched. Keyboard focus inside an unpinned panel
is restored to its trigger as the panel closes, preserving focus while still
enforcing the single-open-tooltip rule.

The `_peerDismissed` flag marks this close as "lost to a sibling" so that
hovering this tooltip's own panel cannot revive it (its panel may still be
under the cursor, now covered by the sibling's panel). The flag is cleared
once the tooltip is fully unmounted or genuinely reopens.

###### Returns

`void`

##### enter()

> **enter**(): `void`

Defined in: [core/tooltip-controller.ts:530](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L530)

Explicitly enter a dialog from keyboard activation.

###### Returns

`void`

##### hasFocus()

> **hasFocus**(): `boolean`

Defined in: [core/tooltip-controller.ts:1476](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L1476)

###### Returns

`boolean`

##### hide()

> **hide**(): `void`

Defined in: [core/tooltip-controller.ts:341](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L341)

###### Returns

`void`

##### isDrawerPresentation()

> **isDrawerPresentation**(): `boolean`

Defined in: [core/tooltip-controller.ts:274](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L274)

The resolved presentation currently used by this controller.

###### Returns

`boolean`

##### open()

> **open**(`options?`): `void`

Defined in: [core/tooltip-controller.ts:514](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L514)

Open immediately, optionally moving focus into the dialog.

###### Parameters

###### options?

[`TooltipOpenOptions`](tooltip-handle.md#tooltipopenoptions) = `{}`

###### Returns

`void`

##### removeNestedTooltip()

> **removeNestedTooltip**(`child`): `void`

Defined in: [core/tooltip-controller.ts:439](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L439)

###### Parameters

###### child

[`TooltipController`](#tooltipcontroller)\<`any`\>

###### Returns

`void`

##### setContent()

> **setContent**(`content`): `void`

Defined in: [core/tooltip-controller.ts:394](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L394)

###### Parameters

###### content

`string`

###### Returns

`void`

##### setPinned()

> **setPinned**(`pinned`): `void`

Defined in: [core/tooltip-controller.ts:451](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L451)

###### Parameters

###### pinned

`boolean`

###### Returns

`void`

##### setPresentation()

> **setPresentation**(`presentation`): `void`

Defined in: [core/tooltip-controller.ts:279](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L279)

Update the presentation setting, including a live auto breakpoint change.

###### Parameters

###### presentation

[`TooltipPresentation`](config.md#tooltippresentation)

###### Returns

`void`

##### setTheme()

> **setTheme**(`theme`): `void`

Defined in: [core/tooltip-controller.ts:406](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L406)

###### Parameters

###### theme

`string`

###### Returns

`void`

##### show()

> **show**(): `void`

Defined in: [core/tooltip-controller.ts:322](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L322)

###### Returns

`void`

##### syncPinButton()

> **syncPinButton**(): `void`

Defined in: [core/tooltip-controller.ts:1130](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L1130)

Synchronize a rendered pin control with the controller's current state.

###### Returns

`void`

##### updateOptions()

> **updateOptions**(`options`): `void`

Defined in: [core/tooltip-controller.ts:413](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L413)

###### Parameters

###### options

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`TData`\>, `"tooltip"`\>\> & `object`

###### Returns

`void`

##### updatePosition()

> **updatePosition**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/tooltip-controller.ts:427](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L427)

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

## Interfaces

### TooltipControllerHooks

Defined in: [core/tooltip-controller.ts:26](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L26)

#### Type Parameters

##### TData

`TData`

#### Properties

##### onDestroy?

> `optional` **onDestroy?**: (`instance`) => `void`

Defined in: [core/tooltip-controller.ts:30](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L30)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`void`

##### onHide?

> `optional` **onHide?**: (`instance`) => `false` \| `void`

Defined in: [core/tooltip-controller.ts:29](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L29)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`false` \| `void`

##### onShow?

> `optional` **onShow?**: (`instance`) => `false` \| `void`

Defined in: [core/tooltip-controller.ts:27](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L27)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`false` \| `void`

##### onShown?

> `optional` **onShown?**: (`instance`) => `void`

Defined in: [core/tooltip-controller.ts:28](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L28)

###### Parameters

###### instance

[`TooltipController`](#tooltipcontroller)\<`TData`\>

###### Returns

`void`

***

### TooltipControllerOptions

Defined in: [core/tooltip-controller.ts:33](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L33)

#### Type Parameters

##### TData

`TData`

#### Properties

##### accessibleName?

> `optional` **accessibleName?**: `string`

Defined in: [core/tooltip-controller.ts:48](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L48)

##### constrainToViewport?

> `optional` **constrainToViewport?**: `boolean`

Defined in: [core/tooltip-controller.ts:37](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L37)

##### content?

> `optional` **content?**: `string`

Defined in: [core/tooltip-controller.ts:34](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L34)

##### hooks?

> `optional` **hooks?**: [`TooltipControllerHooks`](#tooltipcontrollerhooks)\<`TData`\>

Defined in: [core/tooltip-controller.ts:43](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L43)

##### interactiveBorder?

> `optional` **interactiveBorder?**: `number`

Defined in: [core/tooltip-controller.ts:40](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L40)

##### interactiveDebounce?

> `optional` **interactiveDebounce?**: `number`

Defined in: [core/tooltip-controller.ts:41](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L41)

##### kind?

> `optional` **kind?**: `"dialog"` \| `"tooltip"`

Defined in: [core/tooltip-controller.ts:47](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L47)

##### maxHeight?

> `optional` **maxHeight?**: `number`

Defined in: [core/tooltip-controller.ts:39](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L39)

##### maxWidth?

> `optional` **maxWidth?**: `number`

Defined in: [core/tooltip-controller.ts:38](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L38)

##### parent?

> `optional` **parent?**: [`TooltipController`](#tooltipcontroller)\<`any`\>

Defined in: [core/tooltip-controller.ts:42](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L42)

##### presentation?

> `optional` **presentation?**: [`TooltipPresentation`](config.md#tooltippresentation)

Defined in: [core/tooltip-controller.ts:50](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L50)

Presentation for top-level dialogs. Nested tooltips always use popovers.

##### theme

> **theme**: `string`

Defined in: [core/tooltip-controller.ts:36](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L36)

##### timingConfig?

> `optional` **timingConfig?**: [`CoreTooltipConfig`](config.md#coretooltipconfig)

Defined in: [core/tooltip-controller.ts:46](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L46)

##### tooltip

> **tooltip**: [`TooltipOptions`](config.md#tooltipoptions-1)

Defined in: [core/tooltip-controller.ts:35](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L35)

## Type Aliases

### TooltipStatus

> **TooltipStatus** = `"idle"` \| `"opening"` \| `"open"` \| `"closing"` \| `"destroyed"`

Defined in: [core/tooltip-controller.ts:24](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L24)

## Functions

### createStaticTooltip()

> **createStaticTooltip**(`reference`, `content`, `options`): [`TooltipController`](#tooltipcontroller)

Defined in: [core/tooltip-controller.ts:1699](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L1699)

#### Parameters

##### reference

[`Element`](https://developer.mozilla.org/docs/Web/API/Element)

##### content

`string`

##### options

[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`unknown`\>, `"content"`\>

#### Returns

[`TooltipController`](#tooltipcontroller)
