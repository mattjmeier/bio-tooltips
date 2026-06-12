[**gene-tooltips**](../../README.md)

***

## Interfaces

### GeneInfo

Defined in: [providers/mygene/parser.ts:4](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mygene/parser.ts#L4)

#### Properties

##### symbol

> **symbol**: `string`

Defined in: [providers/mygene/parser.ts:5](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mygene/parser.ts#L5)

##### taxid

> **taxid**: `number`

Defined in: [providers/mygene/parser.ts:6](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mygene/parser.ts#L6)

## Functions

### findGeneElements()

> **findGeneElements**(`selector`): [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)[]

Defined in: [providers/mygene/parser.ts:9](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mygene/parser.ts#L9)

#### Parameters

##### selector

`string`

#### Returns

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)[]

***

### getGeneInfoFromElement()

> **getGeneInfoFromElement**(`el`): [`GeneInfo`](#geneinfo) \| `null`

Defined in: [providers/mygene/parser.ts:51](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mygene/parser.ts#L51)

#### Parameters

##### el

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

#### Returns

[`GeneInfo`](#geneinfo) \| `null`

***

### parseGeneElement()

> **parseGeneElement**(`el`): [`EntityRef`](../../core/types.md#entityref) \| `null`

Defined in: [providers/mygene/parser.ts:68](https://github.com/mattjmeier/gene-tooltips/blob/869fb86d6c8f0ebd3fd4001b2549752203f62eaf/src/providers/mygene/parser.ts#L68)

#### Parameters

##### el

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

#### Returns

[`EntityRef`](../../core/types.md#entityref) \| `null`
