[**bio-tooltips**](../../README.md)

***

## Functions

### fetchMyChemAnnotationBatch()

> **fetchMyChemAnnotationBatch**(`ids`, `throwOnError?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:134](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/client.ts#L134)

#### Parameters

##### ids

`string`[]

##### throwOnError?

`boolean` = `false`

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### fetchMyChemBatch()

> **fetchMyChemBatch**(`queries`, `scope?`, `throwOnError?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:90](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/client.ts#L90)

#### Parameters

##### queries

`string`[]

##### scope?

[`MyChemScope`](types.md#mychemscope) = `'name'`

##### throwOnError?

`boolean` = `false`

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### fetchMyChemBestGuessBatch()

> **fetchMyChemBestGuessBatch**(`queries`, `throwOnError?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:177](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/client.ts#L177)

#### Parameters

##### queries

`string`[]

##### throwOnError?

`boolean` = `false`

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### fetchMyChemRefs()

> **fetchMyChemRefs**(`refs`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:201](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/client.ts#L201)

#### Parameters

##### refs

[`EntityRef`](../../core/types.md#entityref)[]

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### getMyChemCacheKey()

> **getMyChemCacheKey**(`query`, `scope?`, `lookup?`): `string`

Defined in: [providers/mychem/client.ts:235](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/client.ts#L235)

#### Parameters

##### query

`string`

##### scope?

[`MyChemScope`](types.md#mychemscope) = `'name'`

##### lookup?

[`MyChemLookupMode`](types.md#mychemlookupmode) = `...`

#### Returns

`string`

***

### normalizeMyChemLookupMode()

> **normalizeMyChemLookupMode**(`lookup`, `scope?`): [`MyChemLookupMode`](types.md#mychemlookupmode)

Defined in: [providers/mychem/client.ts:273](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/client.ts#L273)

#### Parameters

##### lookup

`unknown`

##### scope?

[`MyChemScope`](types.md#mychemscope) = `'name'`

#### Returns

[`MyChemLookupMode`](types.md#mychemlookupmode)

***

### normalizeMyChemScope()

> **normalizeMyChemScope**(`scope`): [`MyChemScope`](types.md#mychemscope)

Defined in: [providers/mychem/client.ts:243](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/client.ts#L243)

#### Parameters

##### scope

`unknown`

#### Returns

[`MyChemScope`](types.md#mychemscope)
