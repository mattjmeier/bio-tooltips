[**bio-tooltips**](../../../README.md)

***

## Functions

### getD3()

> **getD3**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`__module` \| `null`\>

Defined in: [providers/mygene/visuals/gene-track.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/providers/mygene/visuals/gene-track.ts#L19)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`__module` \| `null`\>

***

### renderGeneTrack()

> **renderGeneTrack**(`instance`, `data`, `uniqueId`, `config`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [providers/mygene/visuals/gene-track.ts:112](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/providers/mygene/visuals/gene-track.ts#L112)

Main rendering function

#### Parameters

##### instance

[`TippyInstanceWithCustoms`](../../../core/types.md#tippyinstancewithcustoms)

##### data

[`MyGeneInfoResult`](../types.md#mygeneinforesult)

##### uniqueId

`string`

##### config

[`CoreTooltipConfig`](../../../core/config.md#coretooltipconfig)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>
