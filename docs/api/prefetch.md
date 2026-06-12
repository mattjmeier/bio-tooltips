[**gene-tooltips**](README.md)

***

## Functions

### runPrefetch()

> **runPrefetch**(`strategy`, `elements`, `threshold`, `inFlightRequests`): `void`

Defined in: [prefetch.ts:5](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/prefetch.ts#L5)

#### Parameters

##### strategy

`"smart"` | `"all"` | `"none"`

##### elements

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)[]

##### threshold

`number`

##### inFlightRequests

[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`MyGeneInfoResult`](providers/mygene/types.md#mygeneinforesult)\>\>\>

#### Returns

`void`
