[**bio-tooltips**](../README.md)

***

## Interfaces

### SectionState

Defined in: [core/sections.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/sections.ts#L3)

#### Properties

##### isVisible

> **isVisible**: `boolean`

Defined in: [core/sections.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/sections.ts#L4)

##### startCollapsed

> **startCollapsed**: `boolean`

Defined in: [core/sections.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/sections.ts#L5)

## Type Aliases

### CoreSectionVisibility

> **CoreSectionVisibility** = `boolean` \| `"expanded"` \| `"collapsed"`

Defined in: [core/sections.ts:1](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/sections.ts#L1)

## Functions

### getSectionKey()

> **getSectionKey**(`title`): `string`

Defined in: [core/sections.ts:30](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/sections.ts#L30)

#### Parameters

##### title

`string`

#### Returns

`string`

***

### getSectionState()

> **getSectionState**(`setting`, `globalCollapsedByDefault`): [`SectionState`](#sectionstate)

Defined in: [core/sections.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/sections.ts#L8)

#### Parameters

##### setting

[`CoreSectionVisibility`](#coresectionvisibility) | `undefined`

##### globalCollapsedByDefault

`boolean`

#### Returns

[`SectionState`](#sectionstate)

***

### renderCollapsibleSection()

> **renderCollapsibleSection**(`title`, `innerHTML`, `uniqueId`, `collapsible`, `isCollapsed`, `headerRightHTML`): `string`

Defined in: [core/sections.ts:34](https://github.com/mattjmeier/bio-tooltips/blob/b109d7b2fdb3595b386eb35a7d00474c1c31e07d/src/core/sections.ts#L34)

#### Parameters

##### title

`string`

##### innerHTML

`string`

##### uniqueId

`string`

##### collapsible

`boolean`

##### isCollapsed

`boolean`

##### headerRightHTML

`string` = `''`

#### Returns

`string`
