[**bio-tooltips**](../README.md)

***

## Functions

### fetchRecords()

> **fetchRecords**\<`TData`\>(`refs`, `provider`, `inFlight`, `fields?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, `TData`\>\>

Defined in: [core/requests.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/requests.ts#L8)

#### Type Parameters

##### TData

`TData`

#### Parameters

##### refs

[`EntityRef`](types.md#entityref)[]

##### provider

[`DataProvider`](types.md#dataprovider)\<`TData`\>

##### inFlight

[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, `TData`\>\>\>

##### fields?

readonly `string`[]

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, `TData`\>\>

***

### requestKey()

> **requestKey**(`key`, `fields?`): `string`

Defined in: [core/requests.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/requests.ts#L4)

#### Parameters

##### key

`string`

##### fields?

readonly `string`[]

#### Returns

`string`
