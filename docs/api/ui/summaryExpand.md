[**bio-tooltips**](../README.md)

***

## Functions

### copyTextToClipboard()

> **copyTextToClipboard**(`value`, `status?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`boolean`\>

Defined in: [ui/summaryExpand.ts:25](https://github.com/mattjmeier/bio-tooltips/blob/main/src/ui/summaryExpand.ts#L25)

Copies the full text of the summary paragraph that owns the given copy button.
Truncation is CSS-only, so `textContent` always holds the complete value. On
success the copy icon briefly swaps to a checkmark for visible confirmation.

#### Parameters

##### value

`string`

##### status?

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`boolean`\>

***

### enableSummaryExpand()

> **enableSummaryExpand**(): () => `void`

Defined in: [ui/summaryExpand.ts:112](https://github.com/mattjmeier/bio-tooltips/blob/main/src/ui/summaryExpand.ts#L112)

Enables click/keyboard expand/collapse for summary sections in Bio Tooltips.
It listens for events on the document and targets the specific 'Show more' button.

#### Returns

() => `void`
