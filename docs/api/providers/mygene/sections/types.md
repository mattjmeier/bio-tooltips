[**gene-tooltips**](../../../README.md)

***

## Interfaces

### MyGeneSectionContext

Defined in: providers/mygene/sections/types.ts:5

#### Properties

##### data

> **data**: [`MyGeneInfoResult`](../types.md#mygeneinforesult)

Defined in: providers/mygene/sections/types.ts:6

##### display

> **display**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`TooltipDisplayConfig`](../config.md#tooltipdisplayconfig)\>

Defined in: providers/mygene/sections/types.ts:8

##### domainCount

> **domainCount**: `number`

Defined in: providers/mygene/sections/types.ts:12

##### generifCount

> **generifCount**: `number`

Defined in: providers/mygene/sections/types.ts:15

##### pathwayCount

> **pathwayCount**: `number`

Defined in: providers/mygene/sections/types.ts:11

##### pathwaySource

> **pathwaySource**: `"reactome"` \| `"kegg"` \| `"wikipathways"`

Defined in: providers/mygene/sections/types.ts:10

##### structureCount

> **structureCount**: `number`

Defined in: providers/mygene/sections/types.ts:14

##### transcriptCount

> **transcriptCount**: `number`

Defined in: providers/mygene/sections/types.ts:13

##### truncate

> **truncate**: `number`

Defined in: providers/mygene/sections/types.ts:9

##### uniqueId

> **uniqueId**: `string`

Defined in: providers/mygene/sections/types.ts:7

***

### MyGeneSectionDefinition

Defined in: providers/mygene/sections/types.ts:18

#### Properties

##### getNestedTooltipDefinition()?

> `optional` **getNestedTooltipDefinition**: (`context`) => [`NestedTooltipDefinition`](../../../core/types.md#nestedtooltipdefinition)

Defined in: providers/mygene/sections/types.ts:23

###### Parameters

###### context

[`MyGeneSectionContext`](#mygenesectioncontext)

###### Returns

[`NestedTooltipDefinition`](../../../core/types.md#nestedtooltipdefinition)

##### key

> **key**: keyof [`TooltipDisplayConfig`](../config.md#tooltipdisplayconfig)

Defined in: providers/mygene/sections/types.ts:19

##### render()

> **render**: (`context`) => `string`

Defined in: providers/mygene/sections/types.ts:21

###### Parameters

###### context

[`MyGeneSectionContext`](#mygenesectioncontext)

###### Returns

`string`

##### renderHeader()?

> `optional` **renderHeader**: (`context`) => `string`

Defined in: providers/mygene/sections/types.ts:22

###### Parameters

###### context

[`MyGeneSectionContext`](#mygenesectioncontext)

###### Returns

`string`

##### title

> **title**: `string`

Defined in: providers/mygene/sections/types.ts:20
