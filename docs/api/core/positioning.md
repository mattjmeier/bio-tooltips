[**bio-tooltips**](../README.md)

***

## Interfaces

### ActivePositioner

Defined in: [core/positioning.ts:31](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L31)

#### Properties

##### destroy

> **destroy**: () => `void`

Defined in: [core/positioning.ts:33](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L33)

###### Returns

`void`

##### update

> **update**: () => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/positioning.ts:32](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L32)

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### PositioningElements

Defined in: [core/positioning.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L15)

#### Properties

##### arrow

> **arrow**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

Defined in: [core/positioning.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L20)

##### box

> **box**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

Defined in: [core/positioning.ts:18](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L18)

##### content

> **content**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

Defined in: [core/positioning.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L19)

##### reference

> **reference**: [`Element`](https://developer.mozilla.org/docs/Web/API/Element)

Defined in: [core/positioning.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L16)

##### root

> **root**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

Defined in: [core/positioning.ts:17](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L17)

***

### PositioningOptions

Defined in: [core/positioning.ts:23](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L23)

#### Properties

##### constrainToViewport

> **constrainToViewport**: `boolean`

Defined in: [core/positioning.ts:25](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L25)

##### isTopLevel?

> `optional` **isTopLevel?**: `boolean`

Defined in: [core/positioning.ts:28](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L28)

##### maxHeight?

> `optional` **maxHeight?**: `number`

Defined in: [core/positioning.ts:27](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L27)

##### maxWidth?

> `optional` **maxWidth?**: `number`

Defined in: [core/positioning.ts:26](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L26)

##### tooltip

> **tooltip**: [`TooltipOptions`](config.md#tooltipoptions-1)

Defined in: [core/positioning.ts:24](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L24)

## Functions

### getDefaultFallbackPlacements()

> **getDefaultFallbackPlacements**(`placement`): [`FixedPlacement`](config.md#fixedplacement)[]

Defined in: [core/positioning.ts:143](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L143)

#### Parameters

##### placement

[`FixedPlacement`](config.md#fixedplacement)

#### Returns

[`FixedPlacement`](config.md#fixedplacement)[]

***

### startPositioning()

> **startPositioning**(`elements`, `options`): [`ActivePositioner`](#activepositioner)

Defined in: [core/positioning.ts:36](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/positioning.ts#L36)

#### Parameters

##### elements

[`PositioningElements`](#positioningelements)

##### options

[`PositioningOptions`](#positioningoptions)

#### Returns

[`ActivePositioner`](#activepositioner)
