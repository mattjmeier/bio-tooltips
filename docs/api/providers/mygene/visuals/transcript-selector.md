[**bio-tooltips**](../../../README.md)

***

## Functions

### getLinkedTranscriptsWithoutExons()

> **getLinkedTranscriptsWithoutExons**(`transcripts`, `linkedTranscriptIds`): `string`[]

Defined in: [providers/mygene/visuals/transcript-selector.ts:12](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L12)

Linked IDs without a matching drawable model; cross-source aliases remain linked IDs.

#### Parameters

##### transcripts

[`MyGeneExon`](../types.md#mygeneexon)[]

##### linkedTranscriptIds

`string` \| `string`[] \| `undefined`

#### Returns

`string`[]

***

### getLongestTranscript()

> **getLongestTranscript**(`transcripts`): [`MyGeneExon`](../types.md#mygeneexon)

Defined in: [providers/mygene/visuals/transcript-selector.ts:23](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L23)

#### Parameters

##### transcripts

[`MyGeneExon`](../types.md#mygeneexon)[]

#### Returns

[`MyGeneExon`](../types.md#mygeneexon)

***

### getUsableTranscripts()

> **getUsableTranscripts**(`transcripts`): [`MyGeneExon`](../types.md#mygeneexon)[]

Defined in: [providers/mygene/visuals/transcript-selector.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L3)

#### Parameters

##### transcripts

[`MyGeneExon`](../types.md#mygeneexon)[] \| `undefined`

#### Returns

[`MyGeneExon`](../types.md#mygeneexon)[]

***

### initializeNativeTranscriptSelector()

> **initializeNativeTranscriptSelector**(`selectorEl`, `transcripts`, `__namedParameters`): `string` \| `null`

Defined in: [providers/mygene/visuals/transcript-selector.ts:145](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L145)

#### Parameters

##### selectorEl

[`HTMLSelectElement`](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement)

##### transcripts

[`MyGeneExon`](../types.md#mygeneexon)[]

##### \_\_namedParameters

`NativeTranscriptSelectorOptions`

#### Returns

`string` \| `null`

***

### renderGeneTextAlternative()

> **renderGeneTextAlternative**(`container`, `transcript`, `symbol`, `uniqueId?`): [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [providers/mygene/visuals/transcript-selector.ts:89](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L89)

Render a keyboard-readable equivalent of the exon SVG.

#### Parameters

##### container

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

##### transcript

[`MyGeneExon`](../types.md#mygeneexon)

##### symbol

`string`

##### uniqueId?

`string`

#### Returns

[`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

***

### renderSingleTranscriptSummary()

> **renderSingleTranscriptSummary**(`transcript`): `string`

Defined in: [providers/mygene/visuals/transcript-selector.ts:42](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L42)

Plain transcript identity for gene models with no transcript choice.

#### Parameters

##### transcript

[`MyGeneExon`](../types.md#mygeneexon)

#### Returns

`string`

***

### setGeneTextAlternativeExpanded()

> **setGeneTextAlternativeExpanded**(`container`, `expanded`): `void`

Defined in: [providers/mygene/visuals/transcript-selector.ts:76](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L76)

#### Parameters

##### container

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

##### expanded

`boolean`

#### Returns

`void`
