[**bio-tooltips**](../../../README.md)

***

## Functions

### getLongestTranscript()

> **getLongestTranscript**(`transcripts`): [`MyGeneExon`](../types.md#mygeneexon)

Defined in: [providers/mygene/visuals/transcript-selector.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L13)

#### Parameters

##### transcripts

[`MyGeneExon`](../types.md#mygeneexon)[]

#### Returns

[`MyGeneExon`](../types.md#mygeneexon)

***

### getUsableTranscripts()

> **getUsableTranscripts**(`transcripts`): [`MyGeneExon`](../types.md#mygeneexon)[]

Defined in: [providers/mygene/visuals/transcript-selector.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L5)

#### Parameters

##### transcripts

[`MyGeneExon`](../types.md#mygeneexon)[] \| `undefined`

#### Returns

[`MyGeneExon`](../types.md#mygeneexon)[]

***

### initializeTranscriptPicker()

> **initializeTranscriptPicker**(`picker`, `onChange?`): `void`

Defined in: [providers/mygene/visuals/transcript-selector.ts:179](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L179)

#### Parameters

##### picker

[`HTMLDetailsElement`](https://developer.mozilla.org/docs/Web/API/HTMLDetailsElement)

##### onChange?

(`transcriptId`) => `void`

#### Returns

`void`

***

### renderGeneTextAlternative()

> **renderGeneTextAlternative**(`container`, `transcript`, `symbol`, `uniqueId?`): [`HTMLDivElement`](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)

Defined in: [providers/mygene/visuals/transcript-selector.ts:123](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L123)

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

### renderTranscriptPicker()

> **renderTranscriptPicker**(`uniqueId`, `transcripts`, `linkedTranscriptIds`): `string`

Defined in: [providers/mygene/visuals/transcript-selector.ts:36](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L36)

#### Parameters

##### uniqueId

`string`

##### transcripts

[`MyGeneExon`](../types.md#mygeneexon)[] \| `undefined`

##### linkedTranscriptIds

`string` \| `string`[] \| `undefined`

#### Returns

`string`

***

### setGeneTextAlternativeExpanded()

> **setGeneTextAlternativeExpanded**(`container`, `expanded`): `void`

Defined in: [providers/mygene/visuals/transcript-selector.ts:110](https://github.com/mattjmeier/bio-tooltips/blob/main/src/providers/mygene/visuals/transcript-selector.ts#L110)

#### Parameters

##### container

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

##### expanded

`boolean`

#### Returns

`void`
