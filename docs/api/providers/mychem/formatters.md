[**bio-tooltips**](../../README.md)

***

## Interfaces

### ChemicalIdentity

Defined in: [providers/mychem/formatters.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L15)

#### Properties

##### badges

> **badges**: `string`[]

Defined in: [providers/mychem/formatters.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L19)

##### matchLabel?

> `optional` **matchLabel**: `string`

Defined in: [providers/mychem/formatters.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L20)

##### preferredName

> **preferredName**: `string`

Defined in: [providers/mychem/formatters.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L16)

##### secondaryName?

> `optional` **secondaryName**: `string`

Defined in: [providers/mychem/formatters.ts:17](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L17)

##### synonyms

> **synonyms**: `string`[]

Defined in: [providers/mychem/formatters.ts:18](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L18)

***

### FieldCandidate

Defined in: [providers/mychem/formatters.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L9)

#### Properties

##### path

> **path**: `string`

Defined in: [providers/mychem/formatters.ts:11](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L11)

##### source

> **source**: `string`

Defined in: [providers/mychem/formatters.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L10)

##### url?

> `optional` **url**: `string`

Defined in: [providers/mychem/formatters.ts:12](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L12)

## Functions

### asArray()

> **asArray**\<`T`\>(`value`): `T`[]

Defined in: [providers/mychem/formatters.ts:55](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L55)

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T` | `T`[] | `null` | `undefined`

#### Returns

`T`[]

***

### buildChemicalIdentity()

> **buildChemicalIdentity**(`data`, `query?`): [`ChemicalIdentity`](#chemicalidentity)

Defined in: [providers/mychem/formatters.ts:178](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L178)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult)

##### query?

`string`

#### Returns

[`ChemicalIdentity`](#chemicalidentity)

***

### collectSourceValues()

> **collectSourceValues**(`data`, `candidates`): [`SourceValue`](types.md#sourcevalue)\<`string`\>[]

Defined in: [providers/mychem/formatters.ts:106](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L106)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult)

##### candidates

[`FieldCandidate`](#fieldcandidate)[]

#### Returns

[`SourceValue`](types.md#sourcevalue)\<`string`\>[]

***

### collectStrings()

> **collectStrings**(`record`, `paths`): `string`[]

Defined in: [providers/mychem/formatters.ts:102](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L102)

#### Parameters

##### record

`unknown`

##### paths

`string`[]

#### Returns

`string`[]

***

### escapeAttr()

> **escapeAttr**(`value`): `string`

Defined in: [providers/mychem/formatters.ts:34](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L34)

#### Parameters

##### value

`unknown`

#### Returns

`string`

***

### escapeHTML()

> **escapeHTML**(`value`): `string`

Defined in: [providers/mychem/formatters.ts:25](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L25)

#### Parameters

##### value

`unknown`

#### Returns

`string`

***

### getBestStructureInput()

> **getBestStructureInput**(`data`): \{ `kind`: `"inchi"` \| `"cid"` \| `"smiles"`; `value`: `string`; \} \| `undefined`

Defined in: [providers/mychem/formatters.ts:221](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L221)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult)

#### Returns

\{ `kind`: `"inchi"` \| `"cid"` \| `"smiles"`; `value`: `string`; \} \| `undefined`

***

### getExternalUrl()

> **getExternalUrl**(`kind`, `value`): `string` \| `undefined`

Defined in: [providers/mychem/formatters.ts:245](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L245)

#### Parameters

##### kind

`string`

##### value

`string`

#### Returns

`string` \| `undefined`

***

### getFirstString()

> **getFirstString**(`record`, `paths`): `string` \| `undefined`

Defined in: [providers/mychem/formatters.ts:93](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L93)

#### Parameters

##### record

`unknown`

##### paths

`string`[]

#### Returns

`string` \| `undefined`

***

### getPathValues()

> **getPathValues**(`record`, `path`): `unknown`[]

Defined in: [providers/mychem/formatters.ts:76](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L76)

#### Parameters

##### record

`unknown`

##### path

`string`

#### Returns

`unknown`[]

***

### getPropertyValue()

> **getPropertyValue**(`data`, `names`): [`SourceValue`](types.md#sourcevalue)\<`string`\>[]

Defined in: [providers/mychem/formatters.ts:171](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L171)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult)

##### names

`string`[]

#### Returns

[`SourceValue`](types.md#sourcevalue)\<`string`\>[]

***

### getPubChemCid()

> **getPubChemCid**(`data`): `string` \| `undefined`

Defined in: [providers/mychem/formatters.ts:217](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L217)

#### Parameters

##### data

[`MyChemInfoResult`](types.md#mycheminforesult)

#### Returns

`string` \| `undefined`

***

### resolveField()

> **resolveField**(`label`, `values`, `options`): [`ResolvedField`](types.md#resolvedfield)\<`string`\> \| `undefined`

Defined in: [providers/mychem/formatters.ts:126](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L126)

#### Parameters

##### label

`string`

##### values

[`SourceValue`](types.md#sourcevalue)\<`string`\>[]

##### options

###### numeric?

`boolean`

###### precision?

`number`

#### Returns

[`ResolvedField`](types.md#resolvedfield)\<`string`\> \| `undefined`

***

### sanitizeInlineHTML()

> **sanitizeInlineHTML**(`value`): `string`

Defined in: [providers/mychem/formatters.ts:38](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L38)

#### Parameters

##### value

`unknown`

#### Returns

`string`

***

### uniqueStrings()

> **uniqueStrings**(`values`): `string`[]

Defined in: [providers/mychem/formatters.ts:60](https://github.com/mattjmeier/bio-tooltips/blob/d2b7813a9943eda04f9fda0321ab15e93fb3de15/src/providers/mychem/formatters.ts#L60)

#### Parameters

##### values

`unknown`[]

#### Returns

`string`[]
