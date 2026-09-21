[**bio-tooltips**](../../../README.md)

***

## Functions

### getLongestTranscript()

> **getLongestTranscript**(`transcripts`): [`MyGeneExon`](../types.md#mygeneexon)

Defined in: [providers/mygene/visuals/transcript-selector.ts:11](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L11)

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

Defined in: [providers/mygene/visuals/transcript-selector.ts:126](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L126)

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

Defined in: [providers/mygene/visuals/transcript-selector.ts:70](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L70)

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

### setGeneTextAlternativeExpanded()

> **setGeneTextAlternativeExpanded**(`container`, `expanded`): `void`

Defined in: [providers/mygene/visuals/transcript-selector.ts:57](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L57)

#### Parameters

##### container

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

##### expanded

`boolean`

#### Returns

`void`
