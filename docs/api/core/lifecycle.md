[**bio-tooltips**](../README.md)

***

## Functions

### cleanupTooltipLifecycle()

> **cleanupTooltipLifecycle**\<`TData`\>(`instance`): `void`

Defined in: [core/lifecycle.ts:376](https://github.com/mattjmeier/bio-tooltips/blob/442e0c8fc3a0fe0c2b130d3e1fd969bb92b63ad7/src/core/lifecycle.ts#L376)

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

Defined in: [core/lifecycle.ts:346](https://github.com/mattjmeier/bio-tooltips/blob/442e0c8fc3a0fe0c2b130d3e1fd969bb92b63ad7/src/core/lifecycle.ts#L346)

#### Type Parameters

##### TData

`TData` = `unknown`

#### Returns

(`instance`) => `false` \| `undefined`

***

### createShowHandler()

> **createShowHandler**\<`TData`, `TConfig`\>(`config`, `profile`, `inFlightRequests`): (`instance`) => `void`

Defined in: [core/lifecycle.ts:149](https://github.com/mattjmeier/bio-tooltips/blob/442e0c8fc3a0fe0c2b130d3e1fd969bb92b63ad7/src/core/lifecycle.ts#L149)

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

Defined in: [core/lifecycle.ts:235](https://github.com/mattjmeier/bio-tooltips/blob/442e0c8fc3a0fe0c2b130d3e1fd969bb92b63ad7/src/core/lifecycle.ts#L235)

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
