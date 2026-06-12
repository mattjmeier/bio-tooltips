[**gene-tooltips**](../../../README.md)

***

## Interfaces

### MyGeneSectionContext

Defined in: [providers/mygene/sections/types.ts:5](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L5)

#### Properties

##### data

> **data**: [`MyGeneInfoResult`](../types.md#mygeneinforesult)

Defined in: [providers/mygene/sections/types.ts:6](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L6)

##### display

> **display**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`TooltipDisplayConfig`](../config.md#tooltipdisplayconfig)\>

Defined in: [providers/mygene/sections/types.ts:8](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L8)

##### domainCount

> **domainCount**: `number`

Defined in: [providers/mygene/sections/types.ts:12](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L12)

##### generifCount

> **generifCount**: `number`

Defined in: [providers/mygene/sections/types.ts:15](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L15)

##### pathwayCount

> **pathwayCount**: `number`

Defined in: [providers/mygene/sections/types.ts:11](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L11)

##### pathwaySource

> **pathwaySource**: `"reactome"` \| `"kegg"` \| `"wikipathways"`

Defined in: [providers/mygene/sections/types.ts:10](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L10)

##### structureCount

> **structureCount**: `number`

Defined in: [providers/mygene/sections/types.ts:14](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L14)

##### transcriptCount

> **transcriptCount**: `number`

Defined in: [providers/mygene/sections/types.ts:13](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L13)

##### truncate

> **truncate**: `number`

Defined in: [providers/mygene/sections/types.ts:9](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L9)

##### uniqueId

> **uniqueId**: `string`

Defined in: [providers/mygene/sections/types.ts:7](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L7)

***

### MyGeneSectionDefinition

Defined in: [providers/mygene/sections/types.ts:18](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L18)

#### Properties

##### getNestedTooltipDefinition()?

> `optional` **getNestedTooltipDefinition**: (`context`) => [`NestedTooltipDefinition`](../../../core/types.md#nestedtooltipdefinition)

Defined in: [providers/mygene/sections/types.ts:23](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L23)

###### Parameters

###### context

[`MyGeneSectionContext`](#mygenesectioncontext)

###### Returns

[`NestedTooltipDefinition`](../../../core/types.md#nestedtooltipdefinition)

##### key

> **key**: keyof [`TooltipDisplayConfig`](../config.md#tooltipdisplayconfig)

Defined in: [providers/mygene/sections/types.ts:19](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L19)

##### render()

> **render**: (`context`) => `string`

Defined in: [providers/mygene/sections/types.ts:21](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L21)

###### Parameters

###### context

[`MyGeneSectionContext`](#mygenesectioncontext)

###### Returns

`string`

##### renderHeader()?

> `optional` **renderHeader**: (`context`) => `string`

Defined in: [providers/mygene/sections/types.ts:22](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L22)

###### Parameters

###### context

[`MyGeneSectionContext`](#mygenesectioncontext)

###### Returns

`string`

##### title

> **title**: `string`

Defined in: [providers/mygene/sections/types.ts:20](https://github.com/mattjmeier/gene-tooltips/blob/baad00fdcebf79c187a1c0cb042d1cfa1bb952f7/src/providers/mygene/sections/types.ts#L20)
