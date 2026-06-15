[**bio-tooltips**](../../README.md)

***

## Functions

### getMyChemNestedTooltipDefinitions()

> **getMyChemNestedTooltipDefinitions**(`data`, `config`, `uniqueId`): [`NestedTooltipDefinition`](../../core/types.md#nestedtooltipdefinition)[]

Defined in: [providers/mychem/renderer.ts:696](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/renderer.ts#L696)

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

Defined in: [providers/mychem/renderer.ts:154](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/renderer.ts#L154)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult) | `null` | `undefined`

##### uniqueId

`string`

##### config

[`MyChemTooltipConfig`](config.md#mychemtooltipconfig)

#### Returns

`string`

***

### renderTooltipHTML()

> **renderTooltipHTML**(`data`, `options`): `string`

Defined in: [providers/mychem/renderer.ts:67](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/renderer.ts#L67)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult) | `null` | `undefined`

##### options

`RenderOptions` = `{}`

#### Returns

`string`
