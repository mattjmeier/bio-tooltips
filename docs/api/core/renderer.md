[**bio-tooltips**](../README.md)

***

## Type Aliases

### FormattedItem

> **FormattedItem** = `object`

Defined in: [core/renderer.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L3)

#### Properties

##### name

> **name**: `string`

Defined in: [core/renderer.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L3)

##### url?

> `optional` **url?**: `string`

Defined in: [core/renderer.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L3)

## Variables

### copyIconHTML

> `const` **copyIconHTML**: "\<svg xmlns=\\"http://www.w3.org/2000/svg\\" aria-hidden=\\"true\\" focusable=\\"false\\" fill=\\"currentColor\\" viewBox=\\"0 0 16 16\\"\>\<path fill-rule=\\"evenodd\\" d=\\"M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z\\"/\>\</svg\>"

Defined in: [core/renderer.ts:65](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L65)

***

### loaderHTML

> `const` **loaderHTML**: "\<div class=\\"gt-loader-container\\"\>\<div class=\\"gt-spinner\\"\>\</div\>\<span\>Loading...\</span\>\</div\>"

Defined in: [core/renderer.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L5)

## Functions

### generateUniqueId()

> **generateUniqueId**(): `string`

Defined in: [core/renderer.ts:7](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L7)

#### Returns

`string`

***

### renderCloseButton()

> **renderCloseButton**(`label?`): `string`

Defined in: [core/renderer.ts:48](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L48)

#### Parameters

##### label?

`string` = `'Close'`

#### Returns

`string`

***

### renderCollapseButton()

> **renderCollapseButton**(`id`, `text`): `string`

Defined in: [core/renderer.ts:61](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L61)

#### Parameters

##### id

`string`

##### text

`string`

#### Returns

`string`

***

### renderListContent()

> **renderListContent**(`items`, `initialCount`, `moreButtonId`): `string`

Defined in: [core/renderer.ts:116](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L116)

#### Parameters

##### items

[`FormattedItem`](#formatteditem)[]

##### initialCount

`number`

##### moreButtonId

`string`

#### Returns

`string`

***

### renderMoreButton()

> **renderMoreButton**(`id`, `text`): `string`

Defined in: [core/renderer.ts:53](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L53)

#### Parameters

##### id

`string`

##### text

`string`

#### Returns

`string`

***

### renderParagraphContent()

> **renderParagraphContent**(`items`, `initialCount`, `moreButtonId`): `string`

Defined in: [core/renderer.ts:89](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L89)

#### Parameters

##### items

[`FormattedItem`](#formatteditem)[]

##### initialCount

`number`

##### moreButtonId

`string`

#### Returns

`string`

***

### renderSummaryActions()

> **renderSummaryActions**(`uniqueId`, `expanded?`): `string`

Defined in: [core/renderer.ts:76](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L76)

#### Parameters

##### uniqueId

`string`

##### expanded?

`boolean` = `false`

#### Returns

`string`

***

### renderSummaryCopyButton()

> **renderSummaryCopyButton**(`uniqueId`): `string`

Defined in: [core/renderer.ts:68](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L68)

A small, labelled copy affordance for the summary action row.

#### Parameters

##### uniqueId

`string`

#### Returns

`string`

***

### renderSummaryToggle()

> **renderSummaryToggle**(`uniqueId`, `expanded?`): `string`

Defined in: [core/renderer.ts:84](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L84)

#### Parameters

##### uniqueId

`string`

##### expanded?

`boolean` = `false`

#### Returns

`string`

***

### renderTooltipHeader()

> **renderTooltipHeader**(`titleHTML`, `actionHTML?`): `string`

Defined in: [core/renderer.ts:37](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L37)

#### Parameters

##### titleHTML

`string`

##### actionHTML?

`string` = `''`

#### Returns

`string`

***

### renderTooltipShell()

> **renderTooltipShell**(`uniqueId`, `innerHTML`, `sectionVariant?`): `string`

Defined in: [core/renderer.ts:23](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L23)

Wraps provider content in the standard shell markup (data attributes only).
Geometry and vertical scrolling are owned by the tooltip shell — the
positioning `size` middleware sets `max-width` on the box and `max-height`
on the content, and `.gt-tooltip-content` CSS provides `overflow-y`. No
inline sizing is applied here, so the inner wrapper never becomes a second
scroll container.

#### Parameters

##### uniqueId

`string`

##### innerHTML

`string`

##### sectionVariant?

[`SectionVariant`](config.md#sectionvariant-1) = `'cards'`

#### Returns

`string`
