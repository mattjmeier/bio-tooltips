[**gene-tooltips**](README.md)

***

## Variables

### GeneTooltip

> `const` **GeneTooltip**: `object`

Defined in: [mygene.ts:38](https://github.com/mattjmeier/gene-tooltips/blob/b5d09179fd4d947739c7e3359f147dfdd0a65905/src/mygene.ts#L38)

#### Type Declaration

##### filterNestedList()

> **filterNestedList**: (`query`, `listId`) => `void`

###### Parameters

###### query

`string`

###### listId

`string`

###### Returns

`void`

##### init()

> **init**: (`userConfig`) => () => `void`

###### Parameters

###### userConfig

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`GeneTooltipConfig`](providers/mygene/config.md#genetooltipconfig)\> = `{}`

###### Returns

> (): `void`

###### Returns

`void`

##### preload()

> **preload**: () => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

Preloads the optional heavy dependencies (d3, ideogram) so they
are ready when tooltips are first shown.

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

## Functions

### filterNestedList()

> **filterNestedList**(`query`, `listId`): `void`

Defined in: [mygene.ts:24](https://github.com/mattjmeier/gene-tooltips/blob/b5d09179fd4d947739c7e3359f147dfdd0a65905/src/mygene.ts#L24)

#### Parameters

##### query

`string`

##### listId

`string`

#### Returns

`void`

***

### init()

> **init**(`userConfig`): () => `void`

Defined in: [mygene.ts:12](https://github.com/mattjmeier/gene-tooltips/blob/b5d09179fd4d947739c7e3359f147dfdd0a65905/src/mygene.ts#L12)

#### Parameters

##### userConfig

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`GeneTooltipConfig`](providers/mygene/config.md#genetooltipconfig)\> = `{}`

#### Returns

> (): `void`

##### Returns

`void`

***

### preload()

> **preload**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

Defined in: [mygene.ts:20](https://github.com/mattjmeier/gene-tooltips/blob/b5d09179fd4d947739c7e3359f147dfdd0a65905/src/mygene.ts#L20)

Preloads the optional heavy dependencies (d3, ideogram) so they
are ready when tooltips are first shown.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

## References

### asArray

Re-exports [asArray](providers/mygene/formatters.md#asarray)

***

### createMyGeneSectionContext

Re-exports [createMyGeneSectionContext](providers/mygene/sections.md#createmygenesectioncontext)

***

### default

Renames and re-exports [GeneTooltip](#genetooltip)

***

### defaultConfig

Re-exports [defaultConfig](providers/mygene/config.md#defaultconfig)

***

### fetchMyGeneBatch

Re-exports [fetchMyGeneBatch](providers/mygene/client.md#fetchmygenebatch)

***

### fetchMyGeneRefs

Re-exports [fetchMyGeneRefs](providers/mygene/client.md#fetchmygenerefs)

***

### findGeneElements

Re-exports [findGeneElements](providers/mygene/parser.md#findgeneelements)

***

### findSpecies

Re-exports [findSpecies](providers/mygene/species.md#findspecies)

***

### formatDomains

Re-exports [formatDomains](providers/mygene/formatters.md#formatdomains)

***

### formatGeneRIFs

Re-exports [formatGeneRIFs](providers/mygene/formatters.md#formatgenerifs)

***

### formatPathways

Re-exports [formatPathways](providers/mygene/formatters.md#formatpathways)

***

### formatStructures

Re-exports [formatStructures](providers/mygene/formatters.md#formatstructures)

***

### FormattedItem

Re-exports [FormattedItem](providers/mygene/formatters.md#formatteditem)

***

### formatTranscripts

Re-exports [formatTranscripts](providers/mygene/formatters.md#formattranscripts)

***

### GeneInfo

Re-exports [GeneInfo](providers/mygene/parser.md#geneinfo)

***

### GeneRIF

Re-exports [GeneRIF](providers/mygene/types.md#generif)

***

### GeneTooltipConfig

Re-exports [GeneTooltipConfig](providers/mygene/config.md#genetooltipconfig)

***

### GenomicPosition

Re-exports [GenomicPosition](providers/mygene/types.md#genomicposition)

***

### getD3

Re-exports [getD3](providers/mygene/visuals/gene-track.md#getd3)

***

### getGeneInfoFromElement

Re-exports [getGeneInfoFromElement](providers/mygene/parser.md#getgeneinfofromelement)

***

### getIdeogram

Re-exports [getIdeogram](providers/mygene/visuals/ideogram.md#getideogram)

***

### getMyGeneCacheKey

Re-exports [getMyGeneCacheKey](providers/mygene/client.md#getmygenecachekey)

***

### getMyGeneNestedTooltipDefinitions

Re-exports [getMyGeneNestedTooltipDefinitions](providers/mygene/sections.md#getmygenenestedtooltipdefinitions)

***

### getUniqueItems

Re-exports [getUniqueItems](providers/mygene/formatters.md#getuniqueitems)

***

### IdeogramConfig

Re-exports [IdeogramConfig](providers/mygene/config.md#ideogramconfig)

***

### mergeConfig

Re-exports [mergeConfig](providers/mygene/config.md#mergeconfig)

***

### MyGeneExon

Re-exports [MyGeneExon](providers/mygene/types.md#mygeneexon)

***

### MyGeneInfoResult

Re-exports [MyGeneInfoResult](providers/mygene/types.md#mygeneinforesult)

***

### MyGeneInterproDomain

Re-exports [MyGeneInterproDomain](providers/mygene/types.md#mygeneinterprodomain)

***

### MyGenePathway

Re-exports [MyGenePathway](providers/mygene/types.md#mygenepathway)

***

### myGeneProfile

Re-exports [myGeneProfile](providers/mygene/profile.md#mygeneprofile)

***

### MyGeneSectionContext

Re-exports [MyGeneSectionContext](providers/mygene/sections/types.md#mygenesectioncontext)

***

### MyGeneSectionDefinition

Re-exports [MyGeneSectionDefinition](providers/mygene/sections/types.md#mygenesectiondefinition)

***

### myGeneSections

Re-exports [myGeneSections](providers/mygene/sections.md#mygenesections)

***

### parseGeneElement

Re-exports [parseGeneElement](providers/mygene/parser.md#parsegeneelement)

***

### renderGeneTrack

Re-exports [renderGeneTrack](providers/mygene/visuals/gene-track.md#rendergenetrack)

***

### renderIdeogram

Re-exports [renderIdeogram](providers/mygene/visuals/ideogram.md#renderideogram)

***

### renderSpecies

Re-exports [renderSpecies](providers/mygene/sections/species.md#renderspecies)

***

### renderTooltipHTML

Re-exports [renderTooltipHTML](providers/mygene/renderer.md#rendertooltiphtml)

***

### SectionVisibility

Re-exports [SectionVisibility](providers/mygene/config.md#sectionvisibility)

***

### speciesMap

Re-exports [speciesMap](providers/mygene/species.md#speciesmap)

***

### TooltipDisplayConfig

Re-exports [TooltipDisplayConfig](providers/mygene/config.md#tooltipdisplayconfig)
