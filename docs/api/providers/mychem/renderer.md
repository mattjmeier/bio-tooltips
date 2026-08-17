[**bio-tooltips**](../../README.md)

***

## Functions

### getMyChemNestedTooltipDefinitions()

> **getMyChemNestedTooltipDefinitions**(`data`, `config`, `uniqueId`): [`NestedTooltipDefinition`](../../core/types.md#nestedtooltipdefinition)[]

Defined in: [providers/mychem/renderer.ts:693](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/providers/mychem/renderer.ts#L693)

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

Defined in: [providers/mychem/renderer.ts:151](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/providers/mychem/renderer.ts#L151)

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

Defined in: [providers/mychem/renderer.ts:69](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/providers/mychem/renderer.ts#L69)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult) \| `null` \| `undefined`

##### options?

`RenderOptions` = `{}`

#### Returns

`string`
