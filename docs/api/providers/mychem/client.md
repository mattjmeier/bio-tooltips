[**bio-tooltips**](../../README.md)

***

## Functions

### fetchMyChemAnnotationBatch()

> **fetchMyChemAnnotationBatch**(`ids`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:132](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mychem/client.ts#L132)

#### Parameters

##### ids

`string`[]

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### fetchMyChemBatch()

> **fetchMyChemBatch**(`queries`, `scope`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:90](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mychem/client.ts#L90)

#### Parameters

##### queries

`string`[]

##### scope

[`MyChemScope`](types.md#mychemscope) = `'name'`

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### fetchMyChemBestGuessBatch()

> **fetchMyChemBestGuessBatch**(`queries`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:173](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mychem/client.ts#L173)

#### Parameters

##### queries

`string`[]

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### fetchMyChemRefs()

> **fetchMyChemRefs**(`refs`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:194](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mychem/client.ts#L194)

#### Parameters

##### refs

[`EntityRef`](../../core/types.md#entityref)[]

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### getMyChemCacheKey()

> **getMyChemCacheKey**(`query`, `scope`, `lookup`): `string`

Defined in: [providers/mychem/client.ts:226](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mychem/client.ts#L226)

#### Parameters

##### query

`string`

##### scope

[`MyChemScope`](types.md#mychemscope) = `'name'`

##### lookup

[`MyChemLookupMode`](types.md#mychemlookupmode) = `...`

#### Returns

`string`

***

### normalizeMyChemLookupMode()

> **normalizeMyChemLookupMode**(`lookup`, `scope`): [`MyChemLookupMode`](types.md#mychemlookupmode)

Defined in: [providers/mychem/client.ts:264](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mychem/client.ts#L264)

#### Parameters

##### lookup

`unknown`

##### scope

[`MyChemScope`](types.md#mychemscope) = `'name'`

#### Returns

[`MyChemLookupMode`](types.md#mychemlookupmode)

***

### normalizeMyChemScope()

> **normalizeMyChemScope**(`scope`): [`MyChemScope`](types.md#mychemscope)

Defined in: [providers/mychem/client.ts:234](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mychem/client.ts#L234)

#### Parameters

##### scope

`unknown`

#### Returns

[`MyChemScope`](types.md#mychemscope)
