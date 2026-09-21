[**bio-tooltips**](../../README.md)

***

## Functions

### getMyChemNestedTooltipDefinitions()

> **getMyChemNestedTooltipDefinitions**(`data`, `config`, `uniqueId`): [`NestedTooltipDefinition`](../../core/types.md#nestedtooltipdefinition)[]

Defined in: [providers/mychem/renderer.ts:694](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/renderer.ts#L694)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult)

##### config

[`MyChemTooltipConfig`](config.md#mychemtooltipconfig)

##### uniqueId

`string`

#### Returns

[`NestedTooltipDefinition`](../../core/types.md#nestedtooltipdefinition)[]

***

### renderMyChemTooltipFromConfig()

> **renderMyChemTooltipFromConfig**(`data`, `uniqueId`, `config`): `string`

Defined in: [providers/mychem/renderer.ts:152](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/renderer.ts#L152)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult) \| `null` \| `undefined`

##### uniqueId

`string`

##### config

[`MyChemTooltipConfig`](config.md#mychemtooltipconfig)

#### Returns

`string`

***

### renderTooltipHTML()

> **renderTooltipHTML**(`data`, `options?`): `string`

Defined in: [providers/mychem/renderer.ts:70](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/renderer.ts#L70)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult) \| `null` \| `undefined`

##### options?

`RenderOptions` = `{}`

#### Returns

`string`
