[**bio-tooltips**](../../../README.md)

***

## Functions

### getLongestTranscript()

> **getLongestTranscript**(`transcripts`): [`MyGeneExon`](../types.md#mygeneexon)

Defined in: [providers/mygene/visuals/transcript-selector.ts:11](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/providers/mygene/visuals/transcript-selector.ts#L11)

#### Parameters

##### transcripts

[`MyGeneExon`](../types.md#mygeneexon)[]

#### Returns

[`MyGeneExon`](../types.md#mygeneexon)

***

### getUsableTranscripts()

> **getUsableTranscripts**(`transcripts`): [`MyGeneExon`](../types.md#mygeneexon)[]

Defined in: [providers/mygene/visuals/transcript-selector.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/providers/mygene/visuals/transcript-selector.ts#L3)

#### Parameters

##### transcripts

[`MyGeneExon`](../types.md#mygeneexon)[] \| `undefined`

#### Returns

[`MyGeneExon`](../types.md#mygeneexon)[]

***

### initializeNativeTranscriptSelector()

> **initializeNativeTranscriptSelector**(`selectorEl`, `transcripts`, `__namedParameters`): `string` \| `null`

Defined in: [providers/mygene/visuals/transcript-selector.ts:26](https://github.com/mattjmeier/bio-tooltips/blob/e4c56b87748ac60c9f6f32554d054d9cfcfe0a60/src/providers/mygene/visuals/transcript-selector.ts#L26)

Rebuild the native transcript control before the gene track waits for D3.
Replacing `onchange` keeps repeated visual renders from accumulating handlers.

#### Parameters

##### selectorEl

[`HTMLSelectElement`](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement)

##### transcripts

[`MyGeneExon`](../types.md#mygeneexon)[]

##### \_\_namedParameters

`NativeTranscriptSelectorOptions`

#### Returns

`string` \| `null`
