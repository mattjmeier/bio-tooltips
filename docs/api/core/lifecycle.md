[**bio-tooltips**](../README.md)

***

## Functions

### createOnHideHandler()

> **createOnHideHandler**(): (`instance`) => `false` \| `undefined`

Defined in: [core/lifecycle.ts:309](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/lifecycle.ts#L309)

#### Returns

(`instance`) => `false` \| `undefined`

***

### createOnShowHandler()

> **createOnShowHandler**\<`TData`, `TConfig`\>(`config`, `profile`, `inFlightRequests`): (`instance`) => `void`

Defined in: [core/lifecycle.ts:157](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/lifecycle.ts#L157)

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

### createOnShownHandler()

> **createOnShownHandler**\<`TData`, `TConfig`\>(`config`, `profile`): (`instance`) => `void`

Defined in: [core/lifecycle.ts:241](https://github.com/mattjmeier/bio-tooltips/blob/515b4aaeb547597dc0329796de87565eb2307074/src/core/lifecycle.ts#L241)

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
