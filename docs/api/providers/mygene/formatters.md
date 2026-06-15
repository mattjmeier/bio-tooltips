[**bio-tooltips**](../../README.md)

***

## Type Aliases

### FormattedItem

> **FormattedItem** = `object`

Defined in: [providers/mygene/formatters.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mygene/formatters.ts#L14)

#### Properties

##### name

> **name**: `string`

Defined in: [providers/mygene/formatters.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mygene/formatters.ts#L14)

##### url

> **url**: `string`

Defined in: [providers/mygene/formatters.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mygene/formatters.ts#L14)

## Functions

### asArray()

> **asArray**\<`T`\>(`data`): `T`[]

Defined in: [providers/mygene/formatters.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mygene/formatters.ts#L4)

#### Type Parameters

##### T

`T`

#### Parameters

##### data

`T` | `T`[] | `undefined`

#### Returns

`T`[]

***

### formatDomains()

> **formatDomains**(`domains`): [`FormattedItem`](#formatteditem)[]

Defined in: [providers/mygene/formatters.ts:31](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mygene/formatters.ts#L31)

#### Parameters

##### domains

[`MyGeneInterproDomain`](types.md#mygeneinterprodomain) | [`MyGeneInterproDomain`](types.md#mygeneinterprodomain)[] | `undefined`

#### Returns

[`FormattedItem`](#formatteditem)[]

***

### formatGeneRIFs()

> **formatGeneRIFs**(`generifs`): [`FormattedItem`](#formatteditem)[]

Defined in: [providers/mygene/formatters.ts:53](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mygene/formatters.ts#L53)

#### Parameters

##### generifs

[`GeneRIF`](types.md#generif) | [`GeneRIF`](types.md#generif)[] | `undefined`

#### Returns

[`FormattedItem`](#formatteditem)[]

***

### formatPathways()

> **formatPathways**(`pathways`, `source`): [`FormattedItem`](#formatteditem)[]

Defined in: [providers/mygene/formatters.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mygene/formatters.ts#L16)

#### Parameters

##### pathways

[`MyGenePathway`](types.md#mygenepathway) | [`MyGenePathway`](types.md#mygenepathway)[] | `undefined`

##### source

`"reactome"` | `"kegg"` | `"wikipathways"`

#### Returns

[`FormattedItem`](#formatteditem)[]

***

### formatStructures()

> **formatStructures**(`pdbs`): [`FormattedItem`](#formatteditem)[]

Defined in: [providers/mygene/formatters.ts:46](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mygene/formatters.ts#L46)

#### Parameters

##### pdbs

`string` | `string`[] | `undefined`

#### Returns

[`FormattedItem`](#formatteditem)[]

***

### formatTranscripts()

> **formatTranscripts**(`transcripts`): [`FormattedItem`](#formatteditem)[]

Defined in: [providers/mygene/formatters.ts:40](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mygene/formatters.ts#L40)

#### Parameters

##### transcripts

`string` | `string`[] | `undefined`

#### Returns

[`FormattedItem`](#formatteditem)[]

***

### getUniqueItems()

> **getUniqueItems**\<`T`\>(`items`, `key`): `T`[]

Defined in: [providers/mygene/formatters.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mygene/formatters.ts#L10)

#### Type Parameters

##### T

`T`

#### Parameters

##### items

`T`[]

##### key

keyof `T`

#### Returns

`T`[]
