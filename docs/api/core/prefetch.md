[**bio-tooltips**](../README.md)

***

## Functions

### runPrefetch()

> **runPrefetch**\<`TData`\>(`strategy`, `elements`, `threshold`, `inFlightRequests`, `provider`): `void`

Defined in: [core/prefetch.ts:94](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/core/prefetch.ts#L94)

#### Type Parameters

##### TData

`TData`

#### Parameters

##### strategy

`"smart"` | `"all"` | `"none"`

##### elements

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)[]

##### threshold

`number`

##### inFlightRequests

[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, `TData`\>\>\>

##### provider

[`DataProvider`](types.md#dataprovider)\<`TData`\>

#### Returns

`void`
