[**bio-tooltips**](../README.md)

***

## Interfaces

### CoreTooltipConfig

Defined in: [core/config.ts:55](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L55)

#### Extended by

- [`MyChemTooltipConfig`](../providers/mychem/config.md#mychemtooltipconfig)
- [`GeneTooltipConfig`](../providers/mygene/config.md#genetooltipconfig)

#### Properties

##### constrainToViewport

> **constrainToViewport**: `boolean`

Defined in: [core/config.ts:70](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L70)

##### debugTimings

> **debugTimings**: `boolean`

Defined in: [core/config.ts:62](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L62)

##### display?

> `optional` **display?**: `unknown`

Defined in: [core/config.ts:71](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L71)

##### nestedTooltipOptions

> **nestedTooltipOptions**: [`TooltipOptions`](#tooltipoptions-1)

Defined in: [core/config.ts:67](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L67)

##### onTiming?

> `optional` **onTiming?**: [`TooltipTimingObserver`](#tooltiptimingobserver)

Defined in: [core/config.ts:63](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L63)

##### prefetch

> **prefetch**: [`PrefetchMode`](#prefetchmode)

Defined in: [core/config.ts:59](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L59)

##### prefetchThreshold

> **prefetchThreshold**: `number`

Defined in: [core/config.ts:60](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L60)

##### presentation?

> `optional` **presentation?**: [`TooltipPresentation`](#tooltippresentation)

Defined in: [core/config.ts:58](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L58)

How top-level tooltip dialogs are presented. Nested tooltips remain popovers.

##### sectionVariant

> **sectionVariant**: [`SectionVariant`](#sectionvariant-1)

Defined in: [core/config.ts:65](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L65)

##### selector

> **selector**: `string`

Defined in: [core/config.ts:56](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L56)

##### theme

> **theme**: [`TooltipTheme`](#tooltiptheme)

Defined in: [core/config.ts:64](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L64)

##### tooltipHeight?

> `optional` **tooltipHeight?**: `number`

Defined in: [core/config.ts:69](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L69)

##### tooltipOptions

> **tooltipOptions**: [`TooltipOptions`](#tooltipoptions-1)

Defined in: [core/config.ts:66](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L66)

##### tooltipWidth?

> `optional` **tooltipWidth?**: `number`

Defined in: [core/config.ts:68](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L68)

##### visualPreload

> **visualPreload**: [`VisualPreloadMode`](#visualpreloadmode)

Defined in: [core/config.ts:61](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L61)

***

### TooltipTimingEvent

Defined in: [core/config.ts:45](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L45)

#### Properties

##### details?

> `optional` **details?**: [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `unknown`\>

Defined in: [core/config.ts:50](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L50)

##### elapsedMs

> **elapsedMs**: `number`

Defined in: [core/config.ts:47](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L47)

##### label

> **label**: `string`

Defined in: [core/config.ts:46](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L46)

##### timestampMs

> **timestampMs**: `number`

Defined in: [core/config.ts:48](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L48)

##### tooltipId?

> `optional` **tooltipId?**: `string`

Defined in: [core/config.ts:49](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L49)

## Type Aliases

### FixedPlacement

> **FixedPlacement** = `"top"` \| `"top-start"` \| `"top-end"` \| `"right"` \| `"right-start"` \| `"right-end"` \| `"bottom"` \| `"bottom-start"` \| `"bottom-end"` \| `"left"` \| `"left-start"` \| `"left-end"`

Defined in: [core/config.ts:7](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L7)

***

### PrefetchMode

> **PrefetchMode** = `"smart"` \| `"all"` \| `"none"`

Defined in: [core/config.ts:1](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L1)

***

### SectionVariant

> **SectionVariant** = `"cards"` \| `"dividers"`

Defined in: [core/config.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L4)

***

### TooltipOptions

> **TooltipOptions** = [`TooltipPlacementOptions`](#tooltipplacementoptions) & `object`

Defined in: [core/config.ts:33](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L33)

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

Defined in: [core/config.ts:21](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L21)

***

### TooltipPresentation

> **TooltipPresentation** = `"auto"` \| `"popover"` \| `"drawer"`

Defined in: [core/config.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L5)

***

### TooltipTheme

> **TooltipTheme** = `"light"` \| `"dark"` \| `"auto"` \| `"material"` \| `"translucent"` \| `"light-border"` \| `undefined`

Defined in: [core/config.ts:2](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L2)

***

### TooltipTimingObserver

> **TooltipTimingObserver** = (`event`) => `void`

Defined in: [core/config.ts:53](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L53)

#### Parameters

##### event

[`TooltipTimingEvent`](#tooltiptimingevent)

#### Returns

`void`

***

### VisualPreloadMode

> **VisualPreloadMode** = `"none"` \| `"hover"` \| `"init"`

Defined in: [core/config.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L3)

## Variables

### defaultCoreConfig

> `const` **defaultCoreConfig**: [`CoreTooltipConfig`](#coretooltipconfig)

Defined in: [core/config.ts:74](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L74)
