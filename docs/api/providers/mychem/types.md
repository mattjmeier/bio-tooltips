[**bio-tooltips**](../../README.md)

***

## Interfaces

### MyChemInfoResult

Defined in: [providers/mychem/types.ts:28](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L28)

#### Extends

- [`MyChemRecord`](#mychemrecord)

#### Indexable

\[`key`: `string`\]: [`MyChemRecordValue`](#mychemrecordvalue)

#### Properties

##### \_id

> **\_id**: `string`

Defined in: [providers/mychem/types.ts:29](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L29)

##### chebi?

> `optional` **chebi**: `object`

Defined in: [providers/mychem/types.ts:40](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L40)

###### Index Signature

\[`key`: `string`\]: [`MyChemRecordValue`](#mychemrecordvalue)

###### id?

> `optional` **id**: `string`

###### name?

> `optional` **name**: `string`

##### chembl?

> `optional` **chembl**: `object`

Defined in: [providers/mychem/types.ts:35](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L35)

###### Index Signature

\[`key`: `string`\]: [`MyChemRecordValue`](#mychemrecordvalue)

###### molecule\_chembl\_id?

> `optional` **molecule\_chembl\_id**: `string`

###### pref\_name?

> `optional` **pref\_name**: `string`

##### drugbank?

> `optional` **drugbank**: `object`

Defined in: [providers/mychem/types.ts:45](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L45)

###### Index Signature

\[`key`: `string`\]: [`MyChemRecordValue`](#mychemrecordvalue)

###### description?

> `optional` **description**: `string`

###### id?

> `optional` **id**: `string`

###### name?

> `optional` **name**: `string`

##### formula?

> `optional` **formula**: `string`

Defined in: [providers/mychem/types.ts:34](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L34)

##### inchi?

> `optional` **inchi**: `string`

Defined in: [providers/mychem/types.ts:32](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L32)

##### inchikey?

> `optional` **inchikey**: `string`

Defined in: [providers/mychem/types.ts:33](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L33)

##### name?

> `optional` **name**: `string` \| `string`[]

Defined in: [providers/mychem/types.ts:31](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L31)

##### pubchem?

> `optional` **pubchem**: `object`

Defined in: [providers/mychem/types.ts:51](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L51)

###### Index Signature

\[`key`: `string`\]: [`MyChemRecordValue`](#mychemrecordvalue)

###### cid?

> `optional` **cid**: `string` \| `number`

##### query?

> `optional` **query**: `string`

Defined in: [providers/mychem/types.ts:30](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L30)

##### unii?

> `optional` **unii**: `object`

Defined in: [providers/mychem/types.ts:55](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L55)

###### Index Signature

\[`key`: `string`\]: [`MyChemRecordValue`](#mychemrecordvalue)

###### preferred\_term?

> `optional` **preferred\_term**: `string`

###### unii?

> `optional` **unii**: `string`

***

### MyChemRecord

Defined in: [providers/mychem/types.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L9)

#### Extended by

- [`MyChemInfoResult`](#mycheminforesult)

#### Indexable

\[`key`: `string`\]: [`MyChemRecordValue`](#mychemrecordvalue)

***

### ResolvedField

Defined in: [providers/mychem/types.ts:21](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L21)

#### Type Parameters

##### T

`T`

#### Properties

##### alternatives

> **alternatives**: [`SourceValue`](#sourcevalue)\<`T`\>[]

Defined in: [providers/mychem/types.ts:24](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L24)

##### canonical

> **canonical**: [`SourceValue`](#sourcevalue)\<`T`\>

Defined in: [providers/mychem/types.ts:23](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L23)

##### label

> **label**: `string`

Defined in: [providers/mychem/types.ts:22](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L22)

##### resolution

> **resolution**: `"conflict"` \| `"single"` \| `"agreement"` \| `"precision-difference"`

Defined in: [providers/mychem/types.ts:25](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L25)

***

### SourceValue

Defined in: [providers/mychem/types.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L13)

#### Type Parameters

##### T

`T`

#### Properties

##### quality?

> `optional` **quality**: `"preferred"` \| `"alternate"` \| `"conflict"` \| `"derived"`

Defined in: [providers/mychem/types.ts:18](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L18)

##### source

> **source**: `string`

Defined in: [providers/mychem/types.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L15)

##### sourcePath

> **sourcePath**: `string`

Defined in: [providers/mychem/types.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L16)

##### url?

> `optional` **url**: `string`

Defined in: [providers/mychem/types.ts:17](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L17)

##### value

> **value**: `T`

Defined in: [providers/mychem/types.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L14)

## Type Aliases

### MyChemLookupMode

> **MyChemLookupMode** = `"id"` \| `"best-guess"`

Defined in: [providers/mychem/types.ts:72](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L72)

***

### MyChemPrimitive

> **MyChemPrimitive** = `string` \| `number` \| `boolean`

Defined in: [providers/mychem/types.ts:1](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L1)

***

### MyChemRecordValue

> **MyChemRecordValue** = [`MyChemPrimitive`](#mychemprimitive) \| [`MyChemRecord`](#mychemrecord) \| [`MyChemRecordValue`](#mychemrecordvalue)[] \| `null` \| `undefined`

Defined in: [providers/mychem/types.ts:2](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L2)

***

### MyChemScope

> **MyChemScope** = `"name"` \| `"inchikey"` \| `"inchi"` \| `"chebi.id"` \| `"chembl.molecule_chembl_id"` \| `"drugbank.id"` \| `"pubchem.cid"` \| `"unii.unii"`

Defined in: [providers/mychem/types.ts:62](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mychem/types.ts#L62)
