[**bio-tooltips**](../README.md)

***

## Interfaces

### SectionFields

Defined in: [core/fields.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/fields.ts#L4)

#### Properties

##### fields

> **fields**: `string`[]

Defined in: [core/fields.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/fields.ts#L4)

##### key

> **key**: `string`

Defined in: [core/fields.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/fields.ts#L4)

##### title

> **title**: `string`

Defined in: [core/fields.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/fields.ts#L4)

## Functions

### createFieldPlan()

> **createFieldPlan**(`base`, `sections`, `display`, `sectionLoading?`): `object`

Defined in: [core/fields.ts:6](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/fields.ts#L6)

#### Parameters

##### base

`string`[]

##### sections

[`SectionFields`](#sectionfields)[]

##### display

###### collapsedByDefault?

`boolean`

###### collapsible?

`boolean`

##### sectionLoading?

[`SectionLoadingMode`](config.md#sectionloadingmode) = `'lazy'`

#### Returns

`object`

##### deferred

> **deferred**: [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`[]\>

##### initial

> **initial**: `string`[]
