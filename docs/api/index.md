[**gene-tooltips**](README.md)

***

## Variables

### default

> **default**: `object`

Defined in: [index.ts:51](https://github.com/mattjmeier/gene-tooltips/blob/595b70cd58b858cebe77452ff128b703e14eb32a/src/index.ts#L51)

#### Type Declaration

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
