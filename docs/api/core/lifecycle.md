[**bio-tooltips**](../README.md)

***

## Functions

### cleanupTooltipLifecycle()

> **cleanupTooltipLifecycle**\<`TData`\>(`instance`): `void`

Defined in: [core/lifecycle.ts:388](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/lifecycle.ts#L388)

#### Type Parameters

##### TData

`TData`

#### Parameters

##### instance

[`TooltipController`](tooltip-controller.md#tooltipcontroller)\<`TData`\>

#### Returns

`void`

***

### createHideHandler()

> **createHideHandler**\<`TData`\>(): (`instance`) => `false` \| `undefined`

Defined in: [core/lifecycle.ts:358](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/lifecycle.ts#L358)

#### Type Parameters

##### TData

`TData` = `unknown`

#### Returns

(`instance`) => `false` \| `undefined`

***

### createShowHandler()

> **createShowHandler**\<`TData`, `TConfig`\>(`config`, `profile`, `inFlightRequests`): (`instance`) => `void`

Defined in: [core/lifecycle.ts:152](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/lifecycle.ts#L152)

#### Type Parameters

##### TData

`TData`

##### TConfig

`TConfig` *extends* [`CoreTooltipConfig`](config.md#coretooltipconfig)

#### Parameters

##### config

`TConfig`

##### profile

[`TooltipProfile`](types.md#tooltipprofile)\<`TData`, `TConfig`\>

##### inFlightRequests

[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`, `TData`\>\>\>

#### Returns

(`instance`) => `void`

***

### createShownHandler()

> **createShownHandler**\<`TData`, `TConfig`\>(`config`, `profile`): (`instance`) => `void`

Defined in: [core/lifecycle.ts:238](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/core/lifecycle.ts#L238)

#### Type Parameters

##### TData

`TData`

##### TConfig

`TConfig` *extends* [`CoreTooltipConfig`](config.md#coretooltipconfig)

#### Parameters

##### config

`TConfig`

##### profile

[`TooltipProfile`](types.md#tooltipprofile)\<`TData`, `TConfig`\>

#### Returns

(`instance`) => `void`
