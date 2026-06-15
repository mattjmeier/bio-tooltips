[**bio-tooltips**](../README.md)

***

## Functions

### createTooltipEngine()

> **createTooltipEngine**\<`TData`, `TConfig`\>(`options`): `object`

Defined in: [core/engine.ts:17](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/core/engine.ts#L17)

#### Type Parameters

##### TData

`TData`

##### TConfig

`TConfig` *extends* [`CoreTooltipConfig`](config.md#coretooltipconfig)

#### Parameters

##### options

`TooltipEngineOptions`\<`TData`, `TConfig`\>

#### Returns

`object`

##### init()

> **init**: (`userConfig`) => () => `void`

###### Parameters

###### userConfig

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`TConfig`\> = `{}`

###### Returns

> (): `void`

###### Returns

`void`

##### preload()

> **preload**: () => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>
