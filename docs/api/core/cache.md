[**bio-tooltips**](../README.md)

***

## Functions

### clear()

> **clear**(): `void`

Defined in: [core/cache.ts:50](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/cache.ts#L50)

#### Returns

`void`

***

### get()

> **get**\<`TData`\>(`cacheKey`, `fields?`): `TData` \| `null` \| `undefined`

Defined in: [core/cache.ts:21](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/cache.ts#L21)

#### Type Parameters

##### TData

`TData`

#### Parameters

##### cacheKey

`string`

##### fields?

readonly `string`[]

#### Returns

`TData` \| `null` \| `undefined`

***

### has()

> **has**(`cacheKey`, `fields?`): `boolean`

Defined in: [core/cache.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/cache.ts#L16)

#### Parameters

##### cacheKey

`string`

##### fields?

readonly `string`[]

#### Returns

`boolean`

***

### missingFields()

> **missingFields**(`cacheKey`, `fields`): `string`[]

Defined in: [core/cache.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/cache.ts#L8)

#### Parameters

##### cacheKey

`string`

##### fields

readonly `string`[]

#### Returns

`string`[]

***

### set()

> **set**\<`TData`\>(`cacheKey`, `data`, `fields?`): `void`

Defined in: [core/cache.ts:37](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/cache.ts#L37)

#### Type Parameters

##### TData

`TData`

#### Parameters

##### cacheKey

`string`

##### data

`TData` \| `null`

##### fields?

readonly `string`[]

#### Returns

`void`

***

### setBatch()

> **setBatch**\<`TData`\>(`resultsMap`): `void`

Defined in: [core/cache.ts:47](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/cache.ts#L47)

#### Type Parameters

##### TData

`TData`

#### Parameters

##### resultsMap

[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, `TData`\>

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: [core/cache.ts:51](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/cache.ts#L51)

#### Returns

`number`
