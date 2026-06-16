[**bio-tooltips**](../../../README.md)

***

## Functions

### getD3()

> **getD3**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`__module` \| `null`\>

Defined in: [providers/mygene/visuals/gene-track.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/4283d4e2636443760fa3c0aaa51ba34ef052cf5e/src/providers/mygene/visuals/gene-track.ts#L15)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`__module` \| `null`\>

***

### renderGeneTrack()

> **renderGeneTrack**(`instance`, `data`, `uniqueId`, `config`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [providers/mygene/visuals/gene-track.ts:108](https://github.com/mattjmeier/bio-tooltips/blob/4283d4e2636443760fa3c0aaa51ba34ef052cf5e/src/providers/mygene/visuals/gene-track.ts#L108)

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
