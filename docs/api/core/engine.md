[**bio-tooltips**](../README.md)

***

## Functions

### createTooltipEngine()

> **createTooltipEngine**\<`TData`, `TConfig`\>(`options`): `object`

Defined in: [core/engine.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/c21e23be25099f386b5f5ccdea5d734fc7369996/src/core/engine.ts#L19)

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

##### init

> **init**: (`userConfig`) => () => `void`

###### Parameters

###### userConfig?

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`TConfig`\> = `{}`

###### Returns

() => `void`

##### preload

> **preload**: () => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

##### whenPrefetchReady

> **whenPrefetchReady**: () => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>
