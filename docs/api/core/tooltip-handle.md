[**bio-tooltips**](../README.md)

***

## Interfaces

### TooltipHandle

Defined in: core/tooltip-handle.ts:8

Public controls for one tooltip attached to a DOM element.

#### Methods

##### close()

> **close**(): `void`

Defined in: core/tooltip-handle.ts:12

Close the tooltip, allowing its configured hide transition to finish.

###### Returns

`void`

##### destroy()

> **destroy**(): `void`

Defined in: core/tooltip-handle.ts:14

Close and remove the tooltip, restoring the anchor's original attributes.

###### Returns

`void`

##### open()

> **open**(`options?`): `void`

Defined in: core/tooltip-handle.ts:10

Open immediately, using the anchor's current text and data attributes.

###### Parameters

###### options?

[`TooltipOpenOptions`](#tooltipopenoptions)

###### Returns

`void`

***

### TooltipOpenOptions

Defined in: core/tooltip-handle.ts:2

Options for opening a tooltip attached to a single element.

#### Properties

##### focus?

> `optional` **focus?**: `boolean`

Defined in: core/tooltip-handle.ts:4

Move focus into the tooltip dialog after it opens. Defaults to `false`.
