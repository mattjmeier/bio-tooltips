[**gene-tooltips**](../../README.md)

***

## Functions

### fetchMyChemBatch()

> **fetchMyChemBatch**(`queries`, `scope`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:78](https://github.com/mattjmeier/gene-tooltips/blob/b5d09179fd4d947739c7e3359f147dfdd0a65905/src/providers/mychem/client.ts#L78)

#### Parameters

##### queries

`string`[]

##### scope

[`MyChemScope`](types.md#mychemscope) = `'name'`

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### fetchMyChemRefs()

> **fetchMyChemRefs**(`refs`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:120](https://github.com/mattjmeier/gene-tooltips/blob/b5d09179fd4d947739c7e3359f147dfdd0a65905/src/providers/mychem/client.ts#L120)

#### Parameters

##### refs

[`EntityRef`](../../core/types.md#entityref)[]

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### getMyChemCacheKey()

> **getMyChemCacheKey**(`query`, `scope`): `string`

Defined in: [providers/mychem/client.ts:144](https://github.com/mattjmeier/gene-tooltips/blob/b5d09179fd4d947739c7e3359f147dfdd0a65905/src/providers/mychem/client.ts#L144)

#### Parameters

##### query

`string`

##### scope

[`MyChemScope`](types.md#mychemscope) = `'name'`

#### Returns

`string`

***

### normalizeMyChemScope()

> **normalizeMyChemScope**(`scope`): [`MyChemScope`](types.md#mychemscope)

Defined in: [providers/mychem/client.ts:148](https://github.com/mattjmeier/gene-tooltips/blob/b5d09179fd4d947739c7e3359f147dfdd0a65905/src/providers/mychem/client.ts#L148)

#### Parameters

##### scope

`unknown`

#### Returns

[`MyChemScope`](types.md#mychemscope)
