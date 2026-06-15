[**bio-tooltips**](README.md)

***

## Variables

### ChemicalTooltip

> `const` **ChemicalTooltip**: `object`

Defined in: [mychem.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/2436b839994618bb922d1d5602095884f890c86e/src/mychem.ts#L20)

#### Type Declaration

##### init()

> **init**: (`userConfig`) => () => `void`

###### Parameters

###### userConfig

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`MyChemTooltipConfig`](providers/mychem/config.md#mychemtooltipconfig)\> = `{}`

###### Returns

> (): `void`

###### Returns

`void`

##### preload()

> **preload**: () => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

## Functions

### init()

> **init**(`userConfig`): () => `void`

Defined in: [mychem.ts:12](https://github.com/mattjmeier/bio-tooltips/blob/2436b839994618bb922d1d5602095884f890c86e/src/mychem.ts#L12)

#### Parameters

##### userConfig

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`MyChemTooltipConfig`](providers/mychem/config.md#mychemtooltipconfig)\> = `{}`

#### Returns

> (): `void`

##### Returns

`void`

***

### preload()

> **preload**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

Defined in: [mychem.ts:16](https://github.com/mattjmeier/bio-tooltips/blob/2436b839994618bb922d1d5602095884f890c86e/src/mychem.ts#L16)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

## References

### asArray

Re-exports [asArray](providers/mychem/formatters.md#asarray)

***

### buildChemicalIdentity

Re-exports [buildChemicalIdentity](providers/mychem/formatters.md#buildchemicalidentity)

***

### ChemicalIdentity

Re-exports [ChemicalIdentity](providers/mychem/formatters.md#chemicalidentity)

***

### collectSourceValues

Re-exports [collectSourceValues](providers/mychem/formatters.md#collectsourcevalues)

***

### collectStrings

Re-exports [collectStrings](providers/mychem/formatters.md#collectstrings)

***

### default

Renames and re-exports [ChemicalTooltip](#chemicaltooltip)

***

### defaultMyChemConfig

Re-exports [defaultMyChemConfig](providers/mychem/config.md#defaultmychemconfig)

***

### escapeAttr

Re-exports [escapeAttr](providers/mychem/formatters.md#escapeattr)

***

### escapeHTML

Re-exports [escapeHTML](providers/mychem/formatters.md#escapehtml)

***

### fetchMyChemAnnotationBatch

Re-exports [fetchMyChemAnnotationBatch](providers/mychem/client.md#fetchmychemannotationbatch)

***

### fetchMyChemBatch

Re-exports [fetchMyChemBatch](providers/mychem/client.md#fetchmychembatch)

***

### fetchMyChemBestGuessBatch

Re-exports [fetchMyChemBestGuessBatch](providers/mychem/client.md#fetchmychembestguessbatch)

***

### fetchMyChemRefs

Re-exports [fetchMyChemRefs](providers/mychem/client.md#fetchmychemrefs)

***

### FieldCandidate

Re-exports [FieldCandidate](providers/mychem/formatters.md#fieldcandidate)

***

### findChemicalElements

Re-exports [findChemicalElements](providers/mychem/parser.md#findchemicalelements)

***

### getBestStructureInput

Re-exports [getBestStructureInput](providers/mychem/formatters.md#getbeststructureinput)

***

### getExternalUrl

Re-exports [getExternalUrl](providers/mychem/formatters.md#getexternalurl)

***

### getFirstString

Re-exports [getFirstString](providers/mychem/formatters.md#getfirststring)

***

### getMyChemCacheKey

Re-exports [getMyChemCacheKey](providers/mychem/client.md#getmychemcachekey)

***

### getMyChemNestedTooltipDefinitions

Re-exports [getMyChemNestedTooltipDefinitions](providers/mychem/renderer.md#getmychemnestedtooltipdefinitions)

***

### getPathValues

Re-exports [getPathValues](providers/mychem/formatters.md#getpathvalues)

***

### getPropertyValue

Re-exports [getPropertyValue](providers/mychem/formatters.md#getpropertyvalue)

***

### getPubChemCid

Re-exports [getPubChemCid](providers/mychem/formatters.md#getpubchemcid)

***

### mergeConfig

Re-exports [mergeConfig](providers/mychem/config.md#mergeconfig)

***

### MyChemDisplayConfig

Re-exports [MyChemDisplayConfig](providers/mychem/config.md#mychemdisplayconfig)

***

### MyChemInfoResult

Re-exports [MyChemInfoResult](providers/mychem/types.md#mycheminforesult)

***

### MyChemLookupMode

Re-exports [MyChemLookupMode](providers/mychem/types.md#mychemlookupmode)

***

### MyChemPrimitive

Re-exports [MyChemPrimitive](providers/mychem/types.md#mychemprimitive)

***

### myChemProfile

Re-exports [myChemProfile](providers/mychem/profile.md#mychemprofile)

***

### MyChemRecord

Re-exports [MyChemRecord](providers/mychem/types.md#mychemrecord)

***

### MyChemRecordValue

Re-exports [MyChemRecordValue](providers/mychem/types.md#mychemrecordvalue)

***

### MyChemScope

Re-exports [MyChemScope](providers/mychem/types.md#mychemscope)

***

### MyChemSectionVisibility

Re-exports [MyChemSectionVisibility](providers/mychem/config.md#mychemsectionvisibility)

***

### MyChemStructureRenderContext

Re-exports [MyChemStructureRenderContext](providers/mychem/config.md#mychemstructurerendercontext)

***

### MyChemStructureRenderer

Re-exports [MyChemStructureRenderer](providers/mychem/config.md#mychemstructurerenderer)

***

### MyChemTooltipConfig

Re-exports [MyChemTooltipConfig](providers/mychem/config.md#mychemtooltipconfig)

***

### normalizeMyChemLookupMode

Re-exports [normalizeMyChemLookupMode](providers/mychem/client.md#normalizemychemlookupmode)

***

### normalizeMyChemScope

Re-exports [normalizeMyChemScope](providers/mychem/client.md#normalizemychemscope)

***

### parseChemicalElement

Re-exports [parseChemicalElement](providers/mychem/parser.md#parsechemicalelement)

***

### renderMyChemTooltipFromConfig

Re-exports [renderMyChemTooltipFromConfig](providers/mychem/renderer.md#rendermychemtooltipfromconfig)

***

### renderTooltipHTML

Re-exports [renderTooltipHTML](providers/mychem/renderer.md#rendertooltiphtml)

***

### ResolvedField

Re-exports [ResolvedField](providers/mychem/types.md#resolvedfield)

***

### resolveField

Re-exports [resolveField](providers/mychem/formatters.md#resolvefield)

***

### SourceValue

Re-exports [SourceValue](providers/mychem/types.md#sourcevalue)

***

### uniqueStrings

Re-exports [uniqueStrings](providers/mychem/formatters.md#uniquestrings)
