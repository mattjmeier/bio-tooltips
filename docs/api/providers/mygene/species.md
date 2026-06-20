[**bio-tooltips**](../../README.md)

***

## Variables

### speciesMap

> `const` **speciesMap**: [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`number`, `SpeciesInfo`\>

Defined in: [providers/mygene/species.ts:9](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/species.ts#L9)

## Functions

### findSpecies()

> **findSpecies**(`identifier`): \{ `info`: `SpeciesInfo`; `taxid`: `number`; \} \| `null`

Defined in: [providers/mygene/species.ts:27](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/providers/mygene/species.ts#L27)

Finds species data by either taxid or common name (case-insensitive).

#### Parameters

##### identifier

The taxid (number) or common name (string).

`string` | `number` | `undefined`

#### Returns

\{ `info`: `SpeciesInfo`; `taxid`: `number`; \} \| `null`

An object with the taxid and the SpeciesInfo, or null if not found.
