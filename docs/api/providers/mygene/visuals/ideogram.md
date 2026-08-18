[**bio-tooltips**](../../../README.md)

***

## Functions

### getIdeogram()

> **getIdeogram**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`any`\>

Defined in: [providers/mygene/visuals/ideogram.ts:33](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/visuals/ideogram.ts#L33)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`any`\>

***

### renderIdeogram()

> **renderIdeogram**(`instance`, `data`, `ideogramConfig`, `uniqueId`, `timingConfig`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [providers/mygene/visuals/ideogram.ts:65](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/visuals/ideogram.ts#L65)

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
