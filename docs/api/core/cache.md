[**bio-tooltips**](../README.md)

***

## Functions

### get()

> **get**\<`TData`\>(`cacheKey`): `TData` \| `null` \| `undefined`

Defined in: [core/cache.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/cache.ts#L9)

#### Type Parameters

##### TData

`TData`

#### Parameters

##### cacheKey

`string`

#### Returns

`TData` \| `null` \| `undefined`

***

### has()

> **has**(`cacheKey`): `boolean`

Defined in: [core/cache.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/cache.ts#L5)

#### Parameters

##### cacheKey

`string`

#### Returns

`boolean`

***

### set()

> **set**\<`TData`\>(`cacheKey`, `data`): `void`

Defined in: [core/cache.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/cache.ts#L13)

#### Type Parameters

##### TData

`TData`

#### Parameters

##### cacheKey

`string`

##### data

`TData` | `null`

#### Returns

`void`

***

### setBatch()

> **setBatch**\<`TData`\>(`resultsMap`): `void`

Defined in: [core/cache.ts:24](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/cache.ts#L24)

#### Type Parameters

##### TData

`TData`

#### Parameters

##### resultsMap

[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, `TData`\>

#### Returns

`void`
