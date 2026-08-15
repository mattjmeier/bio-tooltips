[**bio-tooltips**](../README.md)

***

## Interfaces

### ActivePositioner

Defined in: core/positioning.ts:30

#### Properties

##### destroy

> **destroy**: () => `void`

Defined in: core/positioning.ts:32

###### Returns

`void`

##### update

> **update**: () => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: core/positioning.ts:31

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### PositioningElements

Defined in: core/positioning.ts:15

#### Properties

##### arrow

> **arrow**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

Defined in: core/positioning.ts:20

##### box

> **box**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

Defined in: core/positioning.ts:18

##### content

> **content**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

Defined in: core/positioning.ts:19

##### reference

> **reference**: [`Element`](https://developer.mozilla.org/docs/Web/API/Element)

Defined in: core/positioning.ts:16

##### root

> **root**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

Defined in: core/positioning.ts:17

***

### PositioningOptions

Defined in: core/positioning.ts:23

#### Properties

##### constrainToViewport

> **constrainToViewport**: `boolean`

Defined in: core/positioning.ts:25

##### maxHeight?

> `optional` **maxHeight?**: `number`

Defined in: core/positioning.ts:27

##### maxWidth?

> `optional` **maxWidth?**: `number`

Defined in: core/positioning.ts:26

##### tooltip

> **tooltip**: [`TooltipOptions`](config.md#tooltipoptions-1)

Defined in: core/positioning.ts:24

## Functions

### getDefaultFallbackPlacements()

> **getDefaultFallbackPlacements**(`placement`): [`FixedPlacement`](config.md#fixedplacement)[]

Defined in: core/positioning.ts:131

#### Parameters

##### placement

[`FixedPlacement`](config.md#fixedplacement)

#### Returns

[`FixedPlacement`](config.md#fixedplacement)[]

***

### startPositioning()

> **startPositioning**(`elements`, `options`): [`ActivePositioner`](#activepositioner)

Defined in: core/positioning.ts:35

#### Parameters

##### elements

[`PositioningElements`](#positioningelements)

##### options

[`PositioningOptions`](#positioningoptions)

#### Returns

[`ActivePositioner`](#activepositioner)
