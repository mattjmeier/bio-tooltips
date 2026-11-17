[**bio-tooltips**](../README.md)

***

## Functions

### runPrefetch()

> **runPrefetch**\<`TData`\>(`strategy`, `elements`, `threshold`, `inFlightRequests`, `provider`, `fields?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [core/prefetch.ts:104](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/prefetch.ts#L104)

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

##### fields?

readonly `string`[]

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>
