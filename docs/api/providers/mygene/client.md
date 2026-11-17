[**bio-tooltips**](../../README.md)

***

## Functions

### fetchMyGeneBatch()

> **fetchMyGeneBatch**(`geneSymbols`, `species`, `throwOnError?`, `fields?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyGeneInfoResult`](types.md#mygeneinforesult)\>\>

Defined in: [providers/mygene/client.ts:29](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/client.ts#L29)

Fetches data for multiple genes in a single batch request from mygene.info.

#### Parameters

##### geneSymbols

`string`[]

An array of gene symbols.

##### species

`string`

The species for all genes in this batch.

##### throwOnError?

`boolean` = `false`

##### fields?

`string` = `MYGENE_FIELDS`

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyGeneInfoResult`](types.md#mygeneinforesult)\>\>

A Map of gene symbols to data.

***

### fetchMyGeneRefs()

> **fetchMyGeneRefs**(`refs`, `fields?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyGeneInfoResult`](types.md#mygeneinforesult)\>\>

Defined in: [providers/mygene/client.ts:67](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/client.ts#L67)

#### Parameters

##### refs

[`EntityRef`](../../core/types.md#entityref)[]

##### fields?

readonly `string`[]

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyGeneInfoResult`](types.md#mygeneinforesult)\>\>

***

### getMyGeneCacheKey()

> **getMyGeneCacheKey**(`symbol`, `taxid`): `string`

Defined in: [providers/mygene/client.ts:118](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/client.ts#L118)

#### Parameters

##### symbol

`string`

##### taxid

`number`

#### Returns

`string`
