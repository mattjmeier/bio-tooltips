[**bio-tooltips**](../../README.md)

***

## Functions

### getMyChemNestedTooltipDefinitions()

> **getMyChemNestedTooltipDefinitions**(`data`, `config`, `uniqueId`): [`NestedTooltipDefinition`](../../core/types.md#nestedtooltipdefinition)[]

Defined in: [providers/mychem/renderer.ts:713](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/renderer.ts#L713)

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

### installChemicalStructureImageFallback()

> **installChemicalStructureImageFallback**(`root`): `void`

Defined in: [providers/mychem/renderer.ts:317](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/renderer.ts#L317)

Replace an unavailable remote structure image with an explicit fallback.

#### Parameters

##### root

`ParentNode`

#### Returns

`void`

***

### renderMyChemTooltipFromConfig()

> **renderMyChemTooltipFromConfig**(`data`, `uniqueId`, `config`, `deferredSections?`): `string`

Defined in: [providers/mychem/renderer.ts:156](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/renderer.ts#L156)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult) \| `null` \| `undefined`

##### uniqueId

`string`

##### config

[`MyChemTooltipConfig`](config.md#mychemtooltipconfig)

##### deferredSections?

`string`[]

#### Returns

`string`

***

### renderTooltipHTML()

> **renderTooltipHTML**(`data`, `options?`): `string`

Defined in: [providers/mychem/renderer.ts:71](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mychem/renderer.ts#L71)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult) \| `null` \| `undefined`

##### options?

`RenderOptions` = `{}`

#### Returns

`string`
