[**bio-tooltips**](README.md)

***

## Functions

### createNestedContent()

> **createNestedContent**(`items`): `string`

Defined in: [utils.ts:46](https://github.com/mattjmeier/bio-tooltips/blob/442e0c8fc3a0fe0c2b130d3e1fd969bb92b63ad7/src/utils.ts#L46)

#### Parameters

##### items

`object`[]

#### Returns

`string`

***

### filterNestedList()

> **filterNestedList**(`query`, `listId`): `void`

Defined in: [utils.ts:24](https://github.com/mattjmeier/bio-tooltips/blob/442e0c8fc3a0fe0c2b130d3e1fd969bb92b63ad7/src/utils.ts#L24)

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

Defined in: [utils.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/442e0c8fc3a0fe0c2b130d3e1fd969bb92b63ad7/src/utils.ts#L4)

#### Returns

`string`

***

### getSectionBackgroundColor()

> **getSectionBackgroundColor**(`instance`): `string` \| `null`

Defined in: [utils.ts:74](https://github.com/mattjmeier/bio-tooltips/blob/442e0c8fc3a0fe0c2b130d3e1fd969bb92b63ad7/src/utils.ts#L74)

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

Defined in: [utils.ts:38](https://github.com/mattjmeier/bio-tooltips/blob/442e0c8fc3a0fe0c2b130d3e1fd969bb92b63ad7/src/utils.ts#L38)

#### Returns

`void`
