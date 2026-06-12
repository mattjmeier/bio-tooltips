[**gene-tooltips**](README.md)

***

## Functions

### createNestedContent()

> **createNestedContent**(`items`): `string`

Defined in: [utils.ts:12](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/utils.ts#L12)

#### Parameters

##### items

`object`[]

#### Returns

`string`

***

### generateUniqueTooltipId()

> **generateUniqueTooltipId**(): `string`

Defined in: [utils.ts:4](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/utils.ts#L4)

#### Returns

`string`

***

### getSectionBackgroundColor()

> **getSectionBackgroundColor**(`instance`): `string` \| `null`

Defined in: [utils.ts:38](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/utils.ts#L38)

Gets the computed background color from a Tippy instance's popper.

#### Parameters

##### instance

`Instance`

The Tippy instance to inspect.

#### Returns

`string` \| `null`

The background color string (e.g., 'rgb(255, 255, 255)') or null if not found.
