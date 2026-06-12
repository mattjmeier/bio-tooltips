[**gene-tooltips**](../README.md)

***

## Functions

### runPrefetch()

> **runPrefetch**\<`TData`\>(`strategy`, `elements`, `threshold`, `inFlightRequests`, `provider`): `void`

Defined in: [core/prefetch.ts:94](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/core/prefetch.ts#L94)

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
