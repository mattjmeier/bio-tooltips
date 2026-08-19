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

### renderCollapseButton()

> **renderCollapseButton**(`id`, `text`): `string`

Defined in: [core/renderer.ts:56](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L56)

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

Defined in: [core/renderer.ts:103](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L103)

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

Defined in: [core/renderer.ts:48](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L48)

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

Defined in: [core/renderer.ts:76](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L76)

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

### renderSummaryCopyButton()

> **renderSummaryCopyButton**(`uniqueId`): `string`

Defined in: [core/renderer.ts:68](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/renderer.ts#L68)

A small copy affordance for the summary. It is rendered inline at the end of
the `.gene-tooltip-summary` paragraph's text. The icon button carries no text
itself (accessibility is via aria-label/title); the click handler reads the
owning `.gene-tooltip-summary` paragraph's full text (truncation is CSS-only,
so `textContent` is always the complete value) after stripping the button. The
inline SVG follows the same convention as the pin button icon.

#### Parameters

##### uniqueId

`string`

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
