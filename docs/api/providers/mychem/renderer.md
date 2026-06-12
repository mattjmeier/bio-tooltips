[**gene-tooltips**](../../README.md)

***

## Functions

### getMyChemNestedTooltipDefinitions()

> **getMyChemNestedTooltipDefinitions**(`data`, `config`, `uniqueId`): [`NestedTooltipDefinition`](../../core/types.md#nestedtooltipdefinition)[]

Defined in: [providers/mychem/renderer.ts:653](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/renderer.ts#L653)

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

Defined in: [providers/mychem/renderer.ts:152](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/renderer.ts#L152)

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

Defined in: [providers/mychem/renderer.ts:65](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mychem/renderer.ts#L65)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult) | `null` | `undefined`

##### options

`RenderOptions` = `{}`

#### Returns

`string`
