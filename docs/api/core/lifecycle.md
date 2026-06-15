[**bio-tooltips**](../README.md)

***

## Functions

### createOnHideHandler()

> **createOnHideHandler**(): (`instance`) => `false` \| `undefined`

Defined in: [core/lifecycle.ts:238](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/core/lifecycle.ts#L238)

#### Returns

> (`instance`): `false` \| `undefined`

##### Parameters

###### instance

[`TippyInstanceWithCustoms`](types.md#tippyinstancewithcustoms)

##### Returns

`false` \| `undefined`

***

### createOnShowHandler()

> **createOnShowHandler**\<`TData`, `TConfig`\>(`config`, `profile`, `inFlightRequests`): (`instance`) => `void`

Defined in: [core/lifecycle.ts:103](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/core/lifecycle.ts#L103)

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

> (`instance`): `void`

##### Parameters

###### instance

[`TippyInstanceWithCustoms`](types.md#tippyinstancewithcustoms)\<`TData`\>

##### Returns

`void`

***

### createOnShownHandler()

> **createOnShownHandler**\<`TData`, `TConfig`\>(`config`, `profile`): (`instance`) => `void`

Defined in: [core/lifecycle.ts:174](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/core/lifecycle.ts#L174)

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

> (`instance`): `void`

##### Parameters

###### instance

[`TippyInstanceWithCustoms`](types.md#tippyinstancewithcustoms)\<`TData`\>

##### Returns

`void`
