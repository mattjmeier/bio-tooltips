[**bio-tooltips**](../README.md)

***

## Functions

### runPrefetch()

> **runPrefetch**\<`TData`\>(`strategy`, `elements`, `threshold`, `inFlightRequests`, `provider`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/prefetch.ts:95](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/core/prefetch.ts#L95)

#### Type Parameters

##### TData

`TData`

#### Parameters

##### strategy

`"smart"` \| `"all"` \| `"none"`

##### elements

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)[]

##### threshold

`number`

##### inFlightRequests

[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, `TData`\>\>\>

##### provider

[`DataProvider`](types.md#dataprovider)\<`TData`\>

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>
