[**bio-tooltips**](../README.md)

***

## Functions

### cleanupTooltipLifecycle()

> **cleanupTooltipLifecycle**\<`TData`\>(`instance`): `void`

Defined in: [core/lifecycle.ts:487](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/lifecycle.ts#L487)

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

Defined in: [core/lifecycle.ts:451](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/lifecycle.ts#L451)

#### Type Parameters

##### TData

`TData` = `unknown`

#### Returns

(`instance`) => `false` \| `undefined`

***

### createShowHandler()

> **createShowHandler**\<`TData`, `TConfig`\>(`config`, `profile`, `inFlightRequests`): (`instance`) => `void`

Defined in: [core/lifecycle.ts:326](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/lifecycle.ts#L326)

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

Defined in: [core/lifecycle.ts:433](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/lifecycle.ts#L433)

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
