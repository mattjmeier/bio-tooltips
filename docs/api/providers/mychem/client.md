[**gene-tooltips**](../../README.md)

***

## Functions

### fetchMyChemBatch()

> **fetchMyChemBatch**(`queries`, `scope`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:22](https://github.com/mattjmeier/gene-tooltips/blob/935219a3f41469ff6c3a4052652cf1f04712b73a/src/providers/mychem/client.ts#L22)

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

Defined in: [providers/mychem/client.ts:58](https://github.com/mattjmeier/gene-tooltips/blob/935219a3f41469ff6c3a4052652cf1f04712b73a/src/providers/mychem/client.ts#L58)

#### Parameters

##### refs

[`EntityRef`](../../core/types.md#entityref)[]

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### getMyChemCacheKey()

> **getMyChemCacheKey**(`query`, `scope`): `string`

Defined in: [providers/mychem/client.ts:82](https://github.com/mattjmeier/gene-tooltips/blob/935219a3f41469ff6c3a4052652cf1f04712b73a/src/providers/mychem/client.ts#L82)

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

Defined in: [providers/mychem/client.ts:86](https://github.com/mattjmeier/gene-tooltips/blob/935219a3f41469ff6c3a4052652cf1f04712b73a/src/providers/mychem/client.ts#L86)

#### Parameters

##### scope

`unknown`

#### Returns

[`MyChemScope`](types.md#mychemscope)
