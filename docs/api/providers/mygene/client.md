[**bio-tooltips**](../../README.md)

***

## Functions

### fetchMyGeneBatch()

> **fetchMyGeneBatch**(`geneSymbols`, `species`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyGeneInfoResult`](types.md#mygeneinforesult)\>\>

Defined in: [providers/mygene/client.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/acb01f2607b7371dc44a07b2a62fc3e79bec4f82/src/providers/mygene/client.ts#L10)

Fetches data for multiple genes in a single batch request from mygene.info.

#### Parameters

##### geneSymbols

`string`[]

An array of gene symbols.

##### species

`string`

The species for all genes in this batch.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyGeneInfoResult`](types.md#mygeneinforesult)\>\>

A Map of gene symbols to data.

***

### fetchMyGeneRefs()

> **fetchMyGeneRefs**(`refs`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyGeneInfoResult`](types.md#mygeneinforesult)\>\>

Defined in: [providers/mygene/client.ts:64](https://github.com/mattjmeier/bio-tooltips/blob/acb01f2607b7371dc44a07b2a62fc3e79bec4f82/src/providers/mygene/client.ts#L64)

#### Parameters

##### refs

[`EntityRef`](../../core/types.md#entityref)[]

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyGeneInfoResult`](types.md#mygeneinforesult)\>\>

***

### getMyGeneCacheKey()

> **getMyGeneCacheKey**(`symbol`, `taxid`): `string`

Defined in: [providers/mygene/client.ts:91](https://github.com/mattjmeier/bio-tooltips/blob/acb01f2607b7371dc44a07b2a62fc3e79bec4f82/src/providers/mygene/client.ts#L91)

#### Parameters

##### symbol

`string`

##### taxid

`number`

#### Returns

`string`
