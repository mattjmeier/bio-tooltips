[**bio-tooltips**](../../../README.md)

***

## Functions

### getIdeogram()

> **getIdeogram**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`any`\>

Defined in: [providers/mygene/visuals/ideogram.ts:12](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/visuals/ideogram.ts#L12)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`any`\>

***

### renderIdeogram()

> **renderIdeogram**(`instance`, `data`, `ideogramConfig`, `uniqueId`, `timingConfig`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [providers/mygene/visuals/ideogram.ts:44](https://github.com/mattjmeier/bio-tooltips/blob/3aa9621bfb943a079e9c714059d8a9e6e92dd484/src/providers/mygene/visuals/ideogram.ts#L44)

#### Parameters

##### instance

`Instance`

##### data

[`MyGeneInfoResult`](../types.md#mygeneinforesult)

##### ideogramConfig

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`IdeogramConfig`](../config.md#ideogramconfig)\>

##### uniqueId

`string`

##### timingConfig

[`CoreTooltipConfig`](../../../core/config.md#coretooltipconfig)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>
