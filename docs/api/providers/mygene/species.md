[**bio-tooltips**](../../README.md)

***

## Variables

### speciesMap

> `const` **speciesMap**: [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`number`, `SpeciesInfo`\>

Defined in: [providers/mygene/species.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/c21e23be25099f386b5f5ccdea5d734fc7369996/src/providers/mygene/species.ts#L9)

## Functions

### findSpecies()

> **findSpecies**(`identifier`): \{ `info`: `SpeciesInfo`; `taxid`: `number`; \} \| `null`

Defined in: [providers/mygene/species.ts:27](https://github.com/mattjmeier/bio-tooltips/blob/c21e23be25099f386b5f5ccdea5d734fc7369996/src/providers/mygene/species.ts#L27)

Finds species data by either taxid or common name (case-insensitive).

#### Parameters

##### identifier

`string` \| `number` \| `undefined`

The taxid (number) or common name (string).

#### Returns

\{ `info`: `SpeciesInfo`; `taxid`: `number`; \} \| `null`

An object with the taxid and the SpeciesInfo, or null if not found.
