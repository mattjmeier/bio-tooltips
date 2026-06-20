[**bio-tooltips**](../README.md)

***

## Type Aliases

### FormattedItem

> **FormattedItem** = `object`

Defined in: [core/renderer.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/renderer.ts#L3)

#### Properties

##### name

> **name**: `string`

Defined in: [core/renderer.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/renderer.ts#L3)

##### url?

> `optional` **url**: `string`

Defined in: [core/renderer.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/renderer.ts#L3)

## Variables

### loaderHTML

> `const` **loaderHTML**: "\<div class=\"gt-loader-container\"\>\<div class=\"gt-spinner\"\>\</div\>\<span\>Loading...\</span\>\</div\>"

Defined in: [core/renderer.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/renderer.ts#L5)

## Functions

### generateUniqueId()

> **generateUniqueId**(): `string`

Defined in: [core/renderer.ts:7](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/renderer.ts#L7)

#### Returns

`string`

***

### renderCollapseButton()

> **renderCollapseButton**(`id`, `text`): `string`

Defined in: [core/renderer.ts:49](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/renderer.ts#L49)

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

Defined in: [core/renderer.ts:80](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/renderer.ts#L80)

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

Defined in: [core/renderer.ts:41](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/renderer.ts#L41)

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

Defined in: [core/renderer.ts:53](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/renderer.ts#L53)

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

### renderTooltipHeader()

> **renderTooltipHeader**(`titleHTML`, `actionHTML`): `string`

Defined in: [core/renderer.ts:30](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/renderer.ts#L30)

#### Parameters

##### titleHTML

`string`

##### actionHTML

`string` = `''`

#### Returns

`string`

***

### renderTooltipShell()

> **renderTooltipShell**(`uniqueId`, `innerHTML`, `inlineStyle`, `sectionVariant`): `string`

Defined in: [core/renderer.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/core/renderer.ts#L15)

#### Parameters

##### uniqueId

`string`

##### innerHTML

`string`

##### inlineStyle

`string` = `''`

##### sectionVariant

[`SectionVariant`](config.md#sectionvariant-1) = `'cards'`

#### Returns

`string`
