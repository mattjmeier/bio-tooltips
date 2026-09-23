[**bio-tooltips**](../README.md)

***

## Classes

### TooltipController

Defined in: [core/tooltip-controller.ts:101](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L101)

#### Type Parameters

##### TData

`TData` = `unknown`

#### Constructors

##### Constructor

> **new TooltipController**\<`TData`\>(`reference`, `options`): [`TooltipController`](#tooltipcontroller)\<`TData`\>

Defined in: [core/tooltip-controller.ts:191](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L191)

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

Defined in: [core/tooltip-controller.ts:120](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L120)

##### \_entityData?

> `optional` **\_entityData?**: `TData` \| `null`

Defined in: [core/tooltip-controller.ts:119](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L119)

##### \_isPinned?

> `optional` **\_isPinned?**: `boolean`

Defined in: [core/tooltip-controller.ts:130](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L130)

##### \_isPointerInside?

> `optional` **\_isPointerInside?**: `boolean`

Defined in: [core/tooltip-controller.ts:131](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L131)

##### \_nestedTooltips

> **\_nestedTooltips**: [`TooltipController`](#tooltipcontroller)\<`any`\>[] = `[]`

Defined in: [core/tooltip-controller.ts:118](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L118)

##### \_peerDismissed?

> `optional` **\_peerDismissed?**: `boolean`

Defined in: [core/tooltip-controller.ts:138](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L138)

##### \_pinButton?

> `optional` **\_pinButton?**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) \| `null`

Defined in: [core/tooltip-controller.ts:139](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L139)

##### \_renderedVisualSections?

> `optional` **\_renderedVisualSections?**: [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`string`\>

Defined in: [core/tooltip-controller.ts:127](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L127)

##### \_renderingVisualSections?

> `optional` **\_renderingVisualSections?**: [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`string`\>

Defined in: [core/tooltip-controller.ts:128](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L128)

##### \_sectionKeydownHandler?

> `optional` **\_sectionKeydownHandler?**: (`event`) => `void`

Defined in: [core/tooltip-controller.ts:124](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L124)

###### Parameters

###### event

[`KeyboardEvent`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent)

###### Returns

`void`

##### \_sectionToggleHandler?

> `optional` **\_sectionToggleHandler?**: (`event`) => `void`

Defined in: [core/tooltip-controller.ts:123](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L123)

###### Parameters

###### event

[`Event`](https://developer.mozilla.org/docs/Web/API/Event)

###### Returns

`void`

##### \_themeIntent?

> `optional` **\_themeIntent?**: `string`

Defined in: [core/tooltip-controller.ts:122](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L122)

##### \_timingStart?

> `optional` **\_timingStart?**: `number`

Defined in: [core/tooltip-controller.ts:129](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L129)

##### \_uniqueId?

> `optional` **\_uniqueId?**: `string`

Defined in: [core/tooltip-controller.ts:121](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L121)

##### \_visualRenderPromise?

> `optional` **\_visualRenderPromise?**: [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/tooltip-controller.ts:126](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L126)

##### \_visualsRendered?

> `optional` **\_visualsRendered?**: `boolean`

Defined in: [core/tooltip-controller.ts:125](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L125)

##### \_visualViewportResizeHandler?

> `optional` **\_visualViewportResizeHandler?**: () => `void`

Defined in: [core/tooltip-controller.ts:140](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L140)

###### Returns

`void`

##### arrow

> `readonly` **arrow**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:106](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L106)

##### box

> `readonly` **box**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:104](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L104)

##### content

> `readonly` **content**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:105](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L105)

##### options

> **options**: [`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`TData`\>

Defined in: [core/tooltip-controller.ts:116](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L116)

##### reference

> `readonly` **reference**: [`Element`](https://developer.mozilla.org/docs/Web/API/Element)

Defined in: [core/tooltip-controller.ts:102](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L102)

##### root

> `readonly` **root**: [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [core/tooltip-controller.ts:103](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L103)

##### state

> `readonly` **state**: `object`

Defined in: [core/tooltip-controller.ts:107](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L107)

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

Defined in: [core/tooltip-controller.ts:114](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L114)

##### theme

> **theme**: `string`

Defined in: [core/tooltip-controller.ts:115](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L115)

#### Methods

##### addNestedTooltip()

> **addNestedTooltip**(`child`): `void`

Defined in: [core/tooltip-controller.ts:446](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L446)

###### Parameters

###### child

[`TooltipController`](#tooltipcontroller)\<`any`\>

###### Returns

`void`

##### close()

> **close**(): `void`

Defined in: [core/tooltip-controller.ts:552](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L552)

Explicitly dismiss this controller, including pinned dialogs.

###### Returns

`void`

##### destroy()

> **destroy**(): `void`

Defined in: [core/tooltip-controller.ts:484](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L484)

###### Returns

`void`

##### destroyNestedTooltips()

> **destroyNestedTooltips**(): `void`

Defined in: [core/tooltip-controller.ts:460](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L460)

###### Returns

`void`

##### dismiss()

> **dismiss**(): `void`

Defined in: [core/tooltip-controller.ts:395](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L395)

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

Defined in: [core/tooltip-controller.ts:546](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L546)

Explicitly enter a dialog from keyboard activation.

###### Returns

`void`

##### hasFocus()

> **hasFocus**(): `boolean`

Defined in: [core/tooltip-controller.ts:1523](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L1523)

###### Returns

`boolean`

##### hide()

> **hide**(): `void`

Defined in: [core/tooltip-controller.ts:356](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L356)

###### Returns

`void`

##### isDrawerPresentation()

> **isDrawerPresentation**(): `boolean`

Defined in: [core/tooltip-controller.ts:289](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L289)

The resolved presentation currently used by this controller.

###### Returns

`boolean`

##### open()

> **open**(`options?`): `void`

Defined in: [core/tooltip-controller.ts:530](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L530)

Open immediately, optionally moving focus into the dialog.

###### Parameters

###### options?

[`TooltipOpenOptions`](tooltip-handle.md#tooltipopenoptions) = `{}`

###### Returns

`void`

##### removeNestedTooltip()

> **removeNestedTooltip**(`child`): `void`

Defined in: [core/tooltip-controller.ts:454](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L454)

###### Parameters

###### child

[`TooltipController`](#tooltipcontroller)\<`any`\>

###### Returns

`void`

##### setContent()

> **setContent**(`content`): `void`

Defined in: [core/tooltip-controller.ts:409](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L409)

###### Parameters

###### content

`string`

###### Returns

`void`

##### setPinned()

> **setPinned**(`pinned`): `void`

Defined in: [core/tooltip-controller.ts:466](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L466)

###### Parameters

###### pinned

`boolean`

###### Returns

`void`

##### setPresentation()

> **setPresentation**(`presentation`): `void`

Defined in: [core/tooltip-controller.ts:294](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L294)

Update the presentation setting, including a live auto breakpoint change.

###### Parameters

###### presentation

[`TooltipPresentation`](config.md#tooltippresentation)

###### Returns

`void`

##### setTheme()

> **setTheme**(`theme`): `void`

Defined in: [core/tooltip-controller.ts:421](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L421)

###### Parameters

###### theme

`string`

###### Returns

`void`

##### show()

> **show**(): `void`

Defined in: [core/tooltip-controller.ts:337](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L337)

###### Returns

`void`

##### syncPinButton()

> **syncPinButton**(): `void`

Defined in: [core/tooltip-controller.ts:1177](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L1177)

Synchronize a rendered pin control with the controller's current state.

###### Returns

`void`

##### updateOptions()

> **updateOptions**(`options`): `void`

Defined in: [core/tooltip-controller.ts:428](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L428)

###### Parameters

###### options

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`TData`\>, `"tooltip"`\>\> & `object`

###### Returns

`void`

##### updatePosition()

> **updatePosition**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/tooltip-controller.ts:442](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L442)

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

##### triggerStyle?

> `optional` **triggerStyle?**: [`TooltipTriggerStyle`](config.md#tooltiptriggerstyle)

Defined in: [core/tooltip-controller.ts:52](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L52)

Explicitly managed for configured triggers; omitted nested controllers are untouched.

## Type Aliases

### TooltipStatus

> **TooltipStatus** = `"idle"` \| `"opening"` \| `"open"` \| `"closing"` \| `"destroyed"`

Defined in: [core/tooltip-controller.ts:24](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L24)

## Functions

### createStaticTooltip()

> **createStaticTooltip**(`reference`, `content`, `options`): [`TooltipController`](#tooltipcontroller)

Defined in: [core/tooltip-controller.ts:1746](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/tooltip-controller.ts#L1746)

#### Parameters

##### reference

[`Element`](https://developer.mozilla.org/docs/Web/API/Element)

##### content

`string`

##### options

[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`TooltipControllerOptions`](#tooltipcontrolleroptions-1)\<`unknown`\>, `"content"`\>

#### Returns

[`TooltipController`](#tooltipcontroller)
