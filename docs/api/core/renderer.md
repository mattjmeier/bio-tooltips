[**bio-tooltips**](../README.md)

***

## Type Aliases

### FormattedItem

> **FormattedItem** = `object`

Defined in: [core/renderer.ts:1](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/renderer.ts#L1)

#### Properties

##### name

> **name**: `string`

Defined in: [core/renderer.ts:1](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/renderer.ts#L1)

##### url?

> `optional` **url**: `string`

Defined in: [core/renderer.ts:1](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/renderer.ts#L1)

## Variables

### loaderHTML

> `const` **loaderHTML**: "\<div class=\"gt-loader-container\"\>\<div class=\"gt-spinner\"\>\</div\>\<span\>Loading...\</span\>\</div\>"

Defined in: [core/renderer.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/renderer.ts#L3)

## Functions

### generateUniqueId()

> **generateUniqueId**(): `string`

Defined in: [core/renderer.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/renderer.ts#L5)

#### Returns

`string`

***

### renderCollapseButton()

> **renderCollapseButton**(`id`, `text`): `string`

Defined in: [core/renderer.ts:44](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/renderer.ts#L44)

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

Defined in: [core/renderer.ts:75](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/renderer.ts#L75)

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

Defined in: [core/renderer.ts:36](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/renderer.ts#L36)

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

Defined in: [core/renderer.ts:48](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/renderer.ts#L48)

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

Defined in: [core/renderer.ts:25](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/renderer.ts#L25)

#### Parameters

##### titleHTML

`string`

##### actionHTML

`string` = `''`

#### Returns

`string`

***

### renderTooltipShell()

> **renderTooltipShell**(`uniqueId`, `innerHTML`, `inlineStyle`): `string`

Defined in: [core/renderer.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/renderer.ts#L13)

#### Parameters

##### uniqueId

`string`

##### innerHTML

`string`

##### inlineStyle

`string` = `''`

#### Returns

`string`
