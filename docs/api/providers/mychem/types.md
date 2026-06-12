[**gene-tooltips**](../../README.md)

***

## Interfaces

### MyChemInfoResult

Defined in: [providers/mychem/types.ts:1](https://github.com/mattjmeier/gene-tooltips/blob/0ace97422ac9fd146992b5d4f865f0eef15b5d06/src/providers/mychem/types.ts#L1)

#### Properties

##### \_id

> **\_id**: `string`

Defined in: [providers/mychem/types.ts:2](https://github.com/mattjmeier/gene-tooltips/blob/0ace97422ac9fd146992b5d4f865f0eef15b5d06/src/providers/mychem/types.ts#L2)

##### chebi?

> `optional` **chebi**: `object`

Defined in: [providers/mychem/types.ts:12](https://github.com/mattjmeier/gene-tooltips/blob/0ace97422ac9fd146992b5d4f865f0eef15b5d06/src/providers/mychem/types.ts#L12)

###### id?

> `optional` **id**: `string`

###### name?

> `optional` **name**: `string`

##### chembl?

> `optional` **chembl**: `object`

Defined in: [providers/mychem/types.ts:8](https://github.com/mattjmeier/gene-tooltips/blob/0ace97422ac9fd146992b5d4f865f0eef15b5d06/src/providers/mychem/types.ts#L8)

###### molecule\_chembl\_id?

> `optional` **molecule\_chembl\_id**: `string`

###### pref\_name?

> `optional` **pref\_name**: `string`

##### drugbank?

> `optional` **drugbank**: `object`

Defined in: [providers/mychem/types.ts:16](https://github.com/mattjmeier/gene-tooltips/blob/0ace97422ac9fd146992b5d4f865f0eef15b5d06/src/providers/mychem/types.ts#L16)

###### description?

> `optional` **description**: `string`

###### id?

> `optional` **id**: `string`

###### name?

> `optional` **name**: `string`

##### formula?

> `optional` **formula**: `string`

Defined in: [providers/mychem/types.ts:7](https://github.com/mattjmeier/gene-tooltips/blob/0ace97422ac9fd146992b5d4f865f0eef15b5d06/src/providers/mychem/types.ts#L7)

##### inchi?

> `optional` **inchi**: `string`

Defined in: [providers/mychem/types.ts:5](https://github.com/mattjmeier/gene-tooltips/blob/0ace97422ac9fd146992b5d4f865f0eef15b5d06/src/providers/mychem/types.ts#L5)

##### inchikey?

> `optional` **inchikey**: `string`

Defined in: [providers/mychem/types.ts:6](https://github.com/mattjmeier/gene-tooltips/blob/0ace97422ac9fd146992b5d4f865f0eef15b5d06/src/providers/mychem/types.ts#L6)

##### name?

> `optional` **name**: `string` \| `string`[]

Defined in: [providers/mychem/types.ts:4](https://github.com/mattjmeier/gene-tooltips/blob/0ace97422ac9fd146992b5d4f865f0eef15b5d06/src/providers/mychem/types.ts#L4)

##### pubchem?

> `optional` **pubchem**: `object`

Defined in: [providers/mychem/types.ts:21](https://github.com/mattjmeier/gene-tooltips/blob/0ace97422ac9fd146992b5d4f865f0eef15b5d06/src/providers/mychem/types.ts#L21)

###### cid?

> `optional` **cid**: `string` \| `number`

##### query?

> `optional` **query**: `string`

Defined in: [providers/mychem/types.ts:3](https://github.com/mattjmeier/gene-tooltips/blob/0ace97422ac9fd146992b5d4f865f0eef15b5d06/src/providers/mychem/types.ts#L3)

##### unii?

> `optional` **unii**: `object`

Defined in: [providers/mychem/types.ts:24](https://github.com/mattjmeier/gene-tooltips/blob/0ace97422ac9fd146992b5d4f865f0eef15b5d06/src/providers/mychem/types.ts#L24)

###### preferred\_term?

> `optional` **preferred\_term**: `string`

###### unii?

> `optional` **unii**: `string`

## Type Aliases

### MyChemScope

> **MyChemScope** = `"name"` \| `"inchikey"` \| `"chebi"` \| `"chembl"` \| `"drugbank"` \| `"pubchem"` \| `"unii"`

Defined in: [providers/mychem/types.ts:30](https://github.com/mattjmeier/gene-tooltips/blob/0ace97422ac9fd146992b5d4f865f0eef15b5d06/src/providers/mychem/types.ts#L30)
