[**bio-tooltips**](../README.md)

***

## Functions

### createTooltipEngine()

> **createTooltipEngine**\<`TData`, `TConfig`\>(`options`): `object`

Defined in: [core/engine.ts:18](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/engine.ts#L18)

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

##### attach

> **attach**: (`anchor`, `userConfig`) => [`TooltipHandle`](tooltip-handle.md#tooltiphandle)

###### Parameters

###### anchor

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

###### userConfig?

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`TConfig`\> = `{}`

###### Returns

[`TooltipHandle`](tooltip-handle.md#tooltiphandle)

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
