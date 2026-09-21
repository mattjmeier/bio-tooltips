[**bio-tooltips**](README.md)

***

## Functions

### createNestedContent()

> **createNestedContent**(`items`): `string`

Defined in: [utils.ts:51](https://github.com/mattjmeier/bio-tooltips/blob/main/src/utils.ts#L51)

#### Parameters

##### items

`object`[]

#### Returns

`string`

***

### filterNestedList()

> **filterNestedList**(`query`, `listId`): `void`

Defined in: [utils.ts:24](https://github.com/mattjmeier/bio-tooltips/blob/main/src/utils.ts#L24)

#### Parameters

##### query

`string`

##### listId

`string`

#### Returns

`void`

***

### generateUniqueTooltipId()

> **generateUniqueTooltipId**(): `string`

Defined in: [utils.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/main/src/utils.ts#L4)

#### Returns

`string`

***

### getSectionBackgroundColor()

> **getSectionBackgroundColor**(`instance`): `string` \| `null`

Defined in: [utils.ts:86](https://github.com/mattjmeier/bio-tooltips/blob/main/src/utils.ts#L86)

Gets the computed background color from a tooltip instance's root.

#### Parameters

##### instance

[`TooltipController`](core/tooltip-controller.md#tooltipcontroller)\<`any`\>

The tooltip instance to inspect.

#### Returns

`string` \| `null`

The background color string (e.g., 'rgb(255, 255, 255)') or null if not found.

***

### installNestedListFilter()

> **installNestedListFilter**(): `void`

Defined in: [utils.ts:43](https://github.com/mattjmeier/bio-tooltips/blob/main/src/utils.ts#L43)

#### Returns

`void`
