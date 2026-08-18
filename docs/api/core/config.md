[**bio-tooltips**](../README.md)

***

## Interfaces

### CoreTooltipConfig

Defined in: [core/config.ts:54](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L54)

#### Extended by

- [`MyChemTooltipConfig`](../providers/mychem/config.md#mychemtooltipconfig)
- [`GeneTooltipConfig`](../providers/mygene/config.md#genetooltipconfig)

#### Properties

##### constrainToViewport

> **constrainToViewport**: `boolean`

Defined in: [core/config.ts:67](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L67)

##### debugTimings

> **debugTimings**: `boolean`

Defined in: [core/config.ts:59](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L59)

##### display?

> `optional` **display?**: `unknown`

Defined in: [core/config.ts:68](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L68)

##### nestedTooltipOptions

> **nestedTooltipOptions**: [`TooltipOptions`](#tooltipoptions-1)

Defined in: [core/config.ts:64](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L64)

##### onTiming?

> `optional` **onTiming?**: [`TooltipTimingObserver`](#tooltiptimingobserver)

Defined in: [core/config.ts:60](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L60)

##### prefetch

> **prefetch**: [`PrefetchMode`](#prefetchmode)

Defined in: [core/config.ts:56](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L56)

##### prefetchThreshold

> **prefetchThreshold**: `number`

Defined in: [core/config.ts:57](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L57)

##### sectionVariant

> **sectionVariant**: [`SectionVariant`](#sectionvariant-1)

Defined in: [core/config.ts:62](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L62)

##### selector

> **selector**: `string`

Defined in: [core/config.ts:55](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L55)

##### theme

> **theme**: [`TooltipTheme`](#tooltiptheme)

Defined in: [core/config.ts:61](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L61)

##### tooltipHeight?

> `optional` **tooltipHeight?**: `number`

Defined in: [core/config.ts:66](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L66)

##### tooltipOptions

> **tooltipOptions**: [`TooltipOptions`](#tooltipoptions-1)

Defined in: [core/config.ts:63](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L63)

##### tooltipWidth?

> `optional` **tooltipWidth?**: `number`

Defined in: [core/config.ts:65](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L65)

##### visualPreload

> **visualPreload**: [`VisualPreloadMode`](#visualpreloadmode)

Defined in: [core/config.ts:58](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L58)

***

### TooltipTimingEvent

Defined in: [core/config.ts:44](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L44)

#### Properties

##### details?

> `optional` **details?**: [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `unknown`\>

Defined in: [core/config.ts:49](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L49)

##### elapsedMs

> **elapsedMs**: `number`

Defined in: [core/config.ts:46](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L46)

##### label

> **label**: `string`

Defined in: [core/config.ts:45](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L45)

##### timestampMs

> **timestampMs**: `number`

Defined in: [core/config.ts:47](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L47)

##### tooltipId?

> `optional` **tooltipId?**: `string`

Defined in: [core/config.ts:48](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L48)

## Type Aliases

### FixedPlacement

> **FixedPlacement** = `"top"` \| `"top-start"` \| `"top-end"` \| `"right"` \| `"right-start"` \| `"right-end"` \| `"bottom"` \| `"bottom-start"` \| `"bottom-end"` \| `"left"` \| `"left-start"` \| `"left-end"`

Defined in: [core/config.ts:6](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L6)

***

### PrefetchMode

> **PrefetchMode** = `"smart"` \| `"all"` \| `"none"`

Defined in: [core/config.ts:1](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L1)

***

### SectionVariant

> **SectionVariant** = `"cards"` \| `"dividers"`

Defined in: [core/config.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L4)

***

### TooltipOptions

> **TooltipOptions** = [`TooltipPlacementOptions`](#tooltipplacementoptions) & `object`

Defined in: [core/config.ts:32](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L32)

#### Type Declaration

##### appendTo?

> `optional` **appendTo?**: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) \| (() => [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement))

##### hideDelay?

> `optional` **hideDelay?**: `number`

##### hideDuration?

> `optional` **hideDuration?**: `number`

##### offset?

> `optional` **offset?**: `number`

##### showDelay?

> `optional` **showDelay?**: `number`

##### showDuration?

> `optional` **showDuration?**: `number`

##### strategy?

> `optional` **strategy?**: `"absolute"` \| `"fixed"`

##### viewportPadding?

> `optional` **viewportPadding?**: `number`

##### zIndex?

> `optional` **zIndex?**: `number`

***

### TooltipPlacementOptions

> **TooltipPlacementOptions** = \{ `allowedPlacements?`: `never`; `fallbackPlacements?`: [`FixedPlacement`](#fixedplacement)[]; `placement?`: [`FixedPlacement`](#fixedplacement); \} \| \{ `allowedPlacements?`: [`FixedPlacement`](#fixedplacement)[]; `fallbackPlacements?`: `never`; `placement`: `"auto"`; \}

Defined in: [core/config.ts:20](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L20)

***

### TooltipTheme

> **TooltipTheme** = `"light"` \| `"dark"` \| `"auto"` \| `"material"` \| `"translucent"` \| `"light-border"` \| `undefined`

Defined in: [core/config.ts:2](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L2)

***

### TooltipTimingObserver

> **TooltipTimingObserver** = (`event`) => `void`

Defined in: [core/config.ts:52](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L52)

#### Parameters

##### event

[`TooltipTimingEvent`](#tooltiptimingevent)

#### Returns

`void`

***

### VisualPreloadMode

> **VisualPreloadMode** = `"none"` \| `"hover"` \| `"init"`

Defined in: [core/config.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L3)

## Variables

### defaultCoreConfig

> `const` **defaultCoreConfig**: [`CoreTooltipConfig`](#coretooltipconfig)

Defined in: [core/config.ts:71](https://github.com/mattjmeier/bio-tooltips/blob/a9805325837ef15264ba5a8f41c356aa83345d67/src/core/config.ts#L71)
