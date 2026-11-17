[**bio-tooltips**](../../README.md)

***

## Functions

### fetchMyChemAnnotationBatch()

> **fetchMyChemAnnotationBatch**(`ids`, `throwOnError?`, `fields?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:136](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/client.ts#L136)

#### Parameters

##### ids

`string`[]

##### throwOnError?

`boolean` = `false`

##### fields?

`string` = `MYCHEM_FIELDS`

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### fetchMyChemBatch()

> **fetchMyChemBatch**(`queries`, `scope?`, `throwOnError?`, `fields?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:91](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/client.ts#L91)

#### Parameters

##### queries

`string`[]

##### scope?

[`MyChemScope`](types.md#mychemscope) = `'name'`

##### throwOnError?

`boolean` = `false`

##### fields?

`string` = `MYCHEM_FIELDS`

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### fetchMyChemBestGuessBatch()

> **fetchMyChemBestGuessBatch**(`queries`, `throwOnError?`, `fields?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:180](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/client.ts#L180)

#### Parameters

##### queries

`string`[]

##### throwOnError?

`boolean` = `false`

##### fields?

`string` = `MYCHEM_FIELDS`

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### fetchMyChemRefs()

> **fetchMyChemRefs**(`refs`, `fields?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

Defined in: [providers/mychem/client.ts:205](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/client.ts#L205)

#### Parameters

##### refs

[`EntityRef`](../../core/types.md#entityref)[]

##### fields?

readonly `string`[]

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyChemInfoResult`](types.md#mycheminforesult)\>\>

***

### getMyChemCacheKey()

> **getMyChemCacheKey**(`query`, `scope?`, `lookup?`): `string`

Defined in: [providers/mychem/client.ts:257](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/client.ts#L257)

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

Defined in: [providers/mychem/client.ts:295](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/client.ts#L295)

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

Defined in: [providers/mychem/client.ts:265](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/client.ts#L265)

#### Parameters

##### scope

`unknown`

#### Returns

[`MyChemScope`](types.md#mychemscope)
