[**bio-tooltips**](../README.md)

***

## Functions

### cleanupTooltipLifecycle()

> **cleanupTooltipLifecycle**\<`TData`\>(`instance`): `void`

Defined in: [core/lifecycle.ts:389](https://github.com/mattjmeier/bio-tooltips/blob/acb01f2607b7371dc44a07b2a62fc3e79bec4f82/src/core/lifecycle.ts#L389)

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

Defined in: [core/lifecycle.ts:359](https://github.com/mattjmeier/bio-tooltips/blob/acb01f2607b7371dc44a07b2a62fc3e79bec4f82/src/core/lifecycle.ts#L359)

#### Type Parameters

##### TData

`TData` = `unknown`

#### Returns

(`instance`) => `false` \| `undefined`

***

### createShowHandler()

> **createShowHandler**\<`TData`, `TConfig`\>(`config`, `profile`, `inFlightRequests`): (`instance`) => `void`

Defined in: [core/lifecycle.ts:153](https://github.com/mattjmeier/bio-tooltips/blob/acb01f2607b7371dc44a07b2a62fc3e79bec4f82/src/core/lifecycle.ts#L153)

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

Defined in: [core/lifecycle.ts:239](https://github.com/mattjmeier/bio-tooltips/blob/acb01f2607b7371dc44a07b2a62fc3e79bec4f82/src/core/lifecycle.ts#L239)

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
