[**bio-tooltips**](../../README.md)

***

## Interfaces

### GeneRIF

Defined in: [providers/mygene/types.ts:19](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L19)

#### Properties

##### pubmed

> **pubmed**: `number`

Defined in: [providers/mygene/types.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L20)

##### text

> **text**: `string`

Defined in: [providers/mygene/types.ts:21](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L21)

***

### GenomicPosition

Defined in: [providers/mygene/types.ts:1](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L1)

#### Properties

##### chr

> **chr**: `string`

Defined in: [providers/mygene/types.ts:2](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L2)

##### end

> **end**: `number`

Defined in: [providers/mygene/types.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L4)

##### start

> **start**: `number`

Defined in: [providers/mygene/types.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L3)

##### strand

> **strand**: `number`

Defined in: [providers/mygene/types.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L5)

***

### MyGeneExon

Defined in: [providers/mygene/types.ts:24](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L24)

#### Properties

##### cdsend

> **cdsend**: `number`

Defined in: [providers/mygene/types.ts:25](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L25)

##### cdsstart

> **cdsstart**: `number`

Defined in: [providers/mygene/types.ts:26](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L26)

##### chr

> **chr**: `string`

Defined in: [providers/mygene/types.ts:27](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L27)

##### end?

> `optional` **end**: `number`

Defined in: [providers/mygene/types.ts:34](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L34)

##### position?

> `optional` **position**: \[`number`, `number`\][]

Defined in: [providers/mygene/types.ts:32](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L32)

##### start?

> `optional` **start**: `number`

Defined in: [providers/mygene/types.ts:33](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L33)

##### strand

> **strand**: `number`

Defined in: [providers/mygene/types.ts:28](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L28)

##### transcript

> **transcript**: `string`

Defined in: [providers/mygene/types.ts:31](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L31)

##### txend

> **txend**: `number`

Defined in: [providers/mygene/types.ts:29](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L29)

##### txstart

> **txstart**: `number`

Defined in: [providers/mygene/types.ts:30](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L30)

***

### MyGeneInfoResult

Defined in: [providers/mygene/types.ts:37](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L37)

#### Properties

##### \_id

> **\_id**: `string`

Defined in: [providers/mygene/types.ts:38](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L38)

##### ensembl?

> `optional` **ensembl**: `object`

Defined in: [providers/mygene/types.ts:52](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L52)

###### gene

> **gene**: `string`

###### protein?

> `optional` **protein**: `string` \| `string`[]

###### transcript?

> `optional` **transcript**: `string` \| `string`[]

##### exons?

> `optional` **exons**: [`MyGeneExon`](#mygeneexon)[]

Defined in: [providers/mygene/types.ts:51](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L51)

##### generif?

> `optional` **generif**: [`GeneRIF`](#generif) \| [`GeneRIF`](#generif)[]

Defined in: [providers/mygene/types.ts:61](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L61)

##### genomic\_pos?

> `optional` **genomic\_pos**: [`GenomicPosition`](#genomicposition) \| [`GenomicPosition`](#genomicposition)[]

Defined in: [providers/mygene/types.ts:44](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L44)

##### interpro?

> `optional` **interpro**: [`MyGeneInterproDomain`](#mygeneinterprodomain) \| [`MyGeneInterproDomain`](#mygeneinterprodomain)[]

Defined in: [providers/mygene/types.ts:50](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L50)

##### name

> **name**: `string`

Defined in: [providers/mygene/types.ts:41](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L41)

##### pathway?

> `optional` **pathway**: `object`

Defined in: [providers/mygene/types.ts:45](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L45)

###### kegg?

> `optional` **kegg**: [`MyGenePathway`](#mygenepathway) \| [`MyGenePathway`](#mygenepathway)[]

###### reactome?

> `optional` **reactome**: [`MyGenePathway`](#mygenepathway) \| [`MyGenePathway`](#mygenepathway)[]

###### wikipathways?

> `optional` **wikipathways**: [`MyGenePathway`](#mygenepathway) \| [`MyGenePathway`](#mygenepathway)[]

##### pdb?

> `optional` **pdb**: `string` \| `string`[]

Defined in: [providers/mygene/types.ts:57](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L57)

##### query

> **query**: `string`

Defined in: [providers/mygene/types.ts:39](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L39)

##### summary?

> `optional` **summary**: `string`

Defined in: [providers/mygene/types.ts:42](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L42)

##### symbol

> **symbol**: `string`

Defined in: [providers/mygene/types.ts:40](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L40)

##### taxid

> **taxid**: `number`

Defined in: [providers/mygene/types.ts:43](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L43)

##### wikipedia?

> `optional` **wikipedia**: `object`

Defined in: [providers/mygene/types.ts:58](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L58)

###### url\_stub?

> `optional` **url\_stub**: `string`

***

### MyGeneInterproDomain

Defined in: [providers/mygene/types.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L13)

#### Properties

##### desc

> **desc**: `string`

Defined in: [providers/mygene/types.ts:14](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L14)

##### id

> **id**: `string`

Defined in: [providers/mygene/types.ts:15](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L15)

##### short\_desc

> **short\_desc**: `string`

Defined in: [providers/mygene/types.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L16)

***

### MyGenePathway

Defined in: [providers/mygene/types.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L8)

#### Properties

##### id

> **id**: `string`

Defined in: [providers/mygene/types.ts:10](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L10)

##### name

> **name**: `string`

Defined in: [providers/mygene/types.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/types.ts#L9)
