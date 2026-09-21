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

### loaderHTML

> `const` **loaderHTML**: "\<div class=\"gt-loader-container\"\>\<div class=\"gt-spinner\"\>\</div\>\<span\>Loading...\</span\>\</div\>"

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

Defined in: [core/renderer.ts:114](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L114)

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

Defined in: [core/renderer.ts:87](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L87)

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

Defined in: [core/renderer.ts:74](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L74)

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

Defined in: [core/renderer.ts:66](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L66)

A small, labelled copy affordance for the summary action row.

#### Parameters

##### uniqueId

`string`

#### Returns

`string`

***

### renderSummaryToggle()

> **renderSummaryToggle**(`uniqueId`, `expanded?`): `string`

Defined in: [core/renderer.ts:82](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L82)

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
