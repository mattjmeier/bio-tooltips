[**bio-tooltips**](../../../README.md)

***

## Functions

### getD3()

> **getD3**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`__module` \| `null`\>

Defined in: [providers/mygene/visuals/gene-track.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/442e0c8fc3a0fe0c2b130d3e1fd969bb92b63ad7/src/providers/mygene/visuals/gene-track.ts#L16)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`__module` \| `null`\>

***

### renderGeneTrack()

> **renderGeneTrack**(`instance`, `data`, `uniqueId`, `config`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [providers/mygene/visuals/gene-track.ts:124](https://github.com/mattjmeier/bio-tooltips/blob/442e0c8fc3a0fe0c2b130d3e1fd969bb92b63ad7/src/providers/mygene/visuals/gene-track.ts#L124)

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
