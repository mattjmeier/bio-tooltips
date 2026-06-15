[**bio-tooltips**](../../README.md)

***

## Variables

### myGeneSections

> `const` **myGeneSections**: [`MyGeneSectionDefinition`](sections/types.md#mygenesectiondefinition)[]

Defined in: [providers/mygene/sections/index.ts:17](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mygene/sections/index.ts#L17)

## Functions

### createMyGeneSectionContext()

> **createMyGeneSectionContext**(`data`, `config`, `uniqueId`): [`MyGeneSectionContext`](sections/types.md#mygenesectioncontext)

Defined in: [providers/mygene/sections/index.ts:29](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mygene/sections/index.ts#L29)

#### Parameters

##### data

[`MyGeneInfoResult`](types.md#mygeneinforesult)

##### config

[`Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)\<[`GeneTooltipConfig`](config.md#genetooltipconfig), `"display"` \| `"truncateSummary"` \| `"pathwaySource"` \| `"pathwayCount"` \| `"domainCount"` \| `"transcriptCount"` \| `"structureCount"` \| `"generifCount"`\>

##### uniqueId

`string`

#### Returns

[`MyGeneSectionContext`](sections/types.md#mygenesectioncontext)

***

### getMyGeneNestedTooltipDefinitions()

> **getMyGeneNestedTooltipDefinitions**(`data`, `config`, `uniqueId`): [`NestedTooltipDefinition`](../../core/types.md#nestedtooltipdefinition)[]

Defined in: [providers/mygene/sections/index.ts:58](https://github.com/mattjmeier/bio-tooltips/blob/e945c48a9853be325fa1f71fc622d3ab3695de74/src/providers/mygene/sections/index.ts#L58)

#### Parameters

##### data

[`MyGeneInfoResult`](types.md#mygeneinforesult)

##### config

[`GeneTooltipConfig`](config.md#genetooltipconfig)

##### uniqueId

`string`

#### Returns

[`NestedTooltipDefinition`](../../core/types.md#nestedtooltipdefinition)[]

## References

### MyGeneSectionContext

Re-exports [MyGeneSectionContext](sections/types.md#mygenesectioncontext)

***

### MyGeneSectionDefinition

Re-exports [MyGeneSectionDefinition](sections/types.md#mygenesectiondefinition)

***

### renderSpecies

Re-exports [renderSpecies](sections/species.md#renderspecies)
