[**bio-tooltips**](README.md)

***

## Interfaces

### RDKitStructureRendererOptions

Defined in: [mychem-rdkit.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/mychem-rdkit.ts#L13)

#### Properties

##### className?

> `optional` **className**: `string`

Defined in: [mychem-rdkit.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/mychem-rdkit.ts#L16)

##### module?

> `optional` **module**: `RDKitModule`

Defined in: [mychem-rdkit.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/mychem-rdkit.ts#L14)

##### moduleOptions?

> `optional` **moduleOptions**: [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `unknown`\>

Defined in: [mychem-rdkit.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/mychem-rdkit.ts#L15)

## Functions

### createRDKitStructureRenderer()

> **createRDKitStructureRenderer**(`options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`MyChemStructureRenderer`](providers/mychem/config.md#mychemstructurerenderer)\>

Defined in: [mychem-rdkit.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/mychem-rdkit.ts#L19)

#### Parameters

##### options

[`RDKitStructureRendererOptions`](#rdkitstructurerendereroptions) = `{}`

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`MyChemStructureRenderer`](providers/mychem/config.md#mychemstructurerenderer)\>

***

### renderRDKitStructureSVG()

> **renderRDKitStructureSVG**(`rdkit`, `smiles`): `string` \| `undefined`

Defined in: [mychem-rdkit.ts:35](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/mychem-rdkit.ts#L35)

#### Parameters

##### rdkit

`RDKitModule`

##### smiles

`string`

#### Returns

`string` \| `undefined`
