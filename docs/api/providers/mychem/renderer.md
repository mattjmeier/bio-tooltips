[**bio-tooltips**](../../README.md)

***

## Functions

### getMyChemNestedTooltipDefinitions()

> **getMyChemNestedTooltipDefinitions**(`data`, `config`, `uniqueId`): [`NestedTooltipDefinition`](../../core/types.md#nestedtooltipdefinition)[]

Defined in: [providers/mychem/renderer.ts:697](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/renderer.ts#L697)

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

Defined in: [providers/mychem/renderer.ts:155](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/renderer.ts#L155)

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

Defined in: [providers/mychem/renderer.ts:68](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/renderer.ts#L68)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult) | `null` | `undefined`

##### options

`RenderOptions` = `{}`

#### Returns

`string`
