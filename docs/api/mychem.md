[**bio-tooltips**](README.md)

***

## Variables

### ChemicalTooltip

> `const` **ChemicalTooltip**: `object`

Defined in: [mychem.ts:42](https://github.com/mattjmeier/bio-tooltips/blob/c21e23be25099f386b5f5ccdea5d734fc7369996/src/mychem.ts#L42)

#### Type Declaration

##### cacheSize

> **cacheSize**: () => `number`

###### Returns

`number`

##### clearCache

> **clearCache**: () => `void`

###### Returns

`void`

##### init

> **init**: (`userConfig`) => () => `void`

###### Parameters

###### userConfig?

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`MyChemTooltipConfig`](providers/mychem/config.md#mychemtooltipconfig)\> = `{}`

###### Returns

() => `void`

##### preload

> **preload**: () => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

##### whenPrefetchReady

> **whenPrefetchReady**: () => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

## Functions

### cacheSize()

> **cacheSize**(): `number`

Defined in: [mychem.ts:38](https://github.com/mattjmeier/bio-tooltips/blob/c21e23be25099f386b5f5ccdea5d734fc7369996/src/mychem.ts#L38)

#### Returns

`number`

***

### clearCache()

> **clearCache**(): `void`

Defined in: [mychem.ts:34](https://github.com/mattjmeier/bio-tooltips/blob/c21e23be25099f386b5f5ccdea5d734fc7369996/src/mychem.ts#L34)

#### Returns

`void`

***

### init()

> **init**(`userConfig?`): () => `void`

Defined in: [mychem.ts:22](https://github.com/mattjmeier/bio-tooltips/blob/c21e23be25099f386b5f5ccdea5d734fc7369996/src/mychem.ts#L22)

#### Parameters

##### userConfig?

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`MyChemTooltipConfig`](providers/mychem/config.md#mychemtooltipconfig)\> = `{}`

#### Returns

() => `void`

***

### preload()

> **preload**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

Defined in: [mychem.ts:26](https://github.com/mattjmeier/bio-tooltips/blob/c21e23be25099f386b5f5ccdea5d734fc7369996/src/mychem.ts#L26)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`unknown`\>

***

### whenPrefetchReady()

> **whenPrefetchReady**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [mychem.ts:30](https://github.com/mattjmeier/bio-tooltips/blob/c21e23be25099f386b5f5ccdea5d734fc7369996/src/mychem.ts#L30)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

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

### FixedPlacement

Re-exports [FixedPlacement](core/config.md#fixedplacement)

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

### sanitizeInlineHTML

Re-exports [sanitizeInlineHTML](providers/mychem/formatters.md#sanitizeinlinehtml)

***

### SectionVariant

Re-exports [SectionVariant](core/config.md#sectionvariant-1)

***

### SourceValue

Re-exports [SourceValue](providers/mychem/types.md#sourcevalue)

***

### TooltipOptions

Re-exports [TooltipOptions](core/config.md#tooltipoptions-1)

***

### TooltipPlacementOptions

Re-exports [TooltipPlacementOptions](core/config.md#tooltipplacementoptions)

***

### TooltipTimingEvent

Re-exports [TooltipTimingEvent](core/config.md#tooltiptimingevent)

***

### TooltipTimingObserver

Re-exports [TooltipTimingObserver](core/config.md#tooltiptimingobserver)

***

### uniqueStrings

Re-exports [uniqueStrings](providers/mychem/formatters.md#uniquestrings)
