[**gene-tooltips**](README.md)

***

## Functions

### createOnShowHandler()

> **createOnShowHandler**(`config`, `inFlightRequests`): (`instance`) => `void`

Defined in: [lifecycle.ts:12](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/lifecycle.ts#L12)

#### Parameters

##### config

[`GeneTooltipConfig`](providers/mygene/config.md#genetooltipconfig)

##### inFlightRequests

[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyGeneInfoResult`](providers/mygene/types.md#mygeneinforesult)\>\>\>

#### Returns

> (`instance`): `void`

##### Parameters

###### instance

[`TippyInstanceWithCustoms`](core/types.md#tippyinstancewithcustoms)\<[`MyGeneInfoResult`](providers/mygene/types.md#mygeneinforesult)\>

##### Returns

`void`

***

### createOnShownHandler()

> **createOnShownHandler**(`config`): (`instance`) => `void`

Defined in: [lifecycle.ts:19](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/lifecycle.ts#L19)

#### Parameters

##### config

[`GeneTooltipConfig`](providers/mygene/config.md#genetooltipconfig)

#### Returns

> (`instance`): `void`

##### Parameters

###### instance

[`TippyInstanceWithCustoms`](core/types.md#tippyinstancewithcustoms)\<[`MyGeneInfoResult`](providers/mygene/types.md#mygeneinforesult)\>

##### Returns

`void`

## References

### createOnHideHandler

Re-exports [createOnHideHandler](core/lifecycle.md#createonhidehandler)

***

### TippyInstanceWithCustoms

Re-exports [TippyInstanceWithCustoms](core/types.md#tippyinstancewithcustoms)
