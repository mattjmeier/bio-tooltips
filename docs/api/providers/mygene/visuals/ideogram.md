[**bio-tooltips**](../../../README.md)

***

## Functions

### getIdeogram()

> **getIdeogram**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`any`\>

Defined in: [providers/mygene/visuals/ideogram.ts:11](https://github.com/mattjmeier/bio-tooltips/blob/442e0c8fc3a0fe0c2b130d3e1fd969bb92b63ad7/src/providers/mygene/visuals/ideogram.ts#L11)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`any`\>

***

### renderIdeogram()

> **renderIdeogram**(`instance`, `data`, `ideogramConfig`, `uniqueId`, `timingConfig`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [providers/mygene/visuals/ideogram.ts:43](https://github.com/mattjmeier/bio-tooltips/blob/442e0c8fc3a0fe0c2b130d3e1fd969bb92b63ad7/src/providers/mygene/visuals/ideogram.ts#L43)

#### Parameters

##### instance

[`TooltipController`](../../../core/tooltip-controller.md#tooltipcontroller)\<`any`\>

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
