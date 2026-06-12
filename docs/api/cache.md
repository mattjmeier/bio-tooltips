[**gene-tooltips**](README.md)

***

## Functions

### get()

> **get**(`symbol`, `taxid`): [`MyGeneInfoResult`](providers/mygene/types.md#mygeneinforesult) \| `null` \| `undefined`

Defined in: [cache.ts:9](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/cache.ts#L9)

#### Parameters

##### symbol

`string`

##### taxid

`number`

#### Returns

[`MyGeneInfoResult`](providers/mygene/types.md#mygeneinforesult) \| `null` \| `undefined`

***

### getCacheKey()

> **getCacheKey**(`symbol`, `taxid`): `string`

Defined in: [cache.ts:5](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/cache.ts#L5)

#### Parameters

##### symbol

`string`

##### taxid

`number`

#### Returns

`string`

***

### has()

> **has**(`symbol`, `taxid`): `boolean`

Defined in: [cache.ts:7](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/cache.ts#L7)

#### Parameters

##### symbol

`string`

##### taxid

`number`

#### Returns

`boolean`

***

### set()

> **set**(`symbol`, `taxid`, `data`): `void`

Defined in: [cache.ts:13](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/cache.ts#L13)

#### Parameters

##### symbol

`string`

##### taxid

`number`

##### data

[`MyGeneInfoResult`](providers/mygene/types.md#mygeneinforesult) | `null`

#### Returns

`void`

***

### setBatch()

> **setBatch**(`resultsMap`): `void`

Defined in: [cache.ts:17](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/cache.ts#L17)

#### Parameters

##### resultsMap

[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyGeneInfoResult`](providers/mygene/types.md#mygeneinforesult)\>

#### Returns

`void`
