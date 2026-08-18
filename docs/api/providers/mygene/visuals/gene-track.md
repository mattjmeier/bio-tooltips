[**bio-tooltips**](../../../README.md)

***

## Functions

### getD3()

> **getD3**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`__module` \| `null`\>

Defined in: [providers/mygene/visuals/gene-track.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/visuals/gene-track.ts#L16)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`__module` \| `null`\>

***

### renderGeneTrack()

> **renderGeneTrack**(`instance`, `data`, `uniqueId`, `config`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [providers/mygene/visuals/gene-track.ts:124](https://github.com/mattjmeier/bio-tooltips/blob/0b219d7c30b5f18beb729daa94cd741b310396f4/src/providers/mygene/visuals/gene-track.ts#L124)

Main rendering function

#### Parameters

##### instance

[`TooltipController`](../../../core/tooltip-controller.md#tooltipcontroller)\<`any`\>

##### data

[`MyGeneInfoResult`](../types.md#mygeneinforesult)

##### uniqueId

`string`

##### config

[`CoreTooltipConfig`](../../../core/config.md#coretooltipconfig)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>
