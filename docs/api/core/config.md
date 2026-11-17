[**bio-tooltips**](../README.md)

***

## Interfaces

### CoreTooltipConfig

Defined in: [core/config.ts:61](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L61)

#### Extended by

- [`MyChemTooltipConfig`](../providers/mychem/config.md#mychemtooltipconfig)
- [`GeneTooltipConfig`](../providers/mygene/config.md#genetooltipconfig)

#### Properties

##### constrainToViewport

> **constrainToViewport**: `boolean`

Defined in: [core/config.ts:83](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L83)

##### debugTimings

> **debugTimings**: `boolean`

Defined in: [core/config.ts:75](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L75)

##### display?

> `optional` **display?**: `unknown`

Defined in: [core/config.ts:84](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L84)

##### nestedTooltipOptions

> **nestedTooltipOptions**: [`TooltipOptions`](#tooltipoptions-1)

Defined in: [core/config.ts:80](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L80)

##### onTiming?

> `optional` **onTiming?**: [`TooltipTimingObserver`](#tooltiptimingobserver)

Defined in: [core/config.ts:76](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L76)

##### prefetch

> **prefetch**: [`PrefetchMode`](#prefetchmode)

Defined in: [core/config.ts:67](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L67)

##### prefetchThreshold

> **prefetchThreshold**: `number`

Defined in: [core/config.ts:73](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L73)

##### presentation?

> `optional` **presentation?**: [`TooltipPresentation`](#tooltippresentation)

Defined in: [core/config.ts:66](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L66)

How top-level tooltip dialogs are presented. Nested tooltips remain popovers.

##### sectionLoading?

> `optional` **sectionLoading?**: [`SectionLoadingMode`](#sectionloadingmode)

Defined in: [core/config.ts:72](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L72)

Load collapsed sections on expansion (lazy, default) or with initial data (eager).
Does not change display state or disable the shared cache.

##### sectionVariant

> **sectionVariant**: [`SectionVariant`](#sectionvariant-1)

Defined in: [core/config.ts:78](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L78)

##### selector

> **selector**: `string`

Defined in: [core/config.ts:62](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L62)

##### theme

> **theme**: [`TooltipTheme`](#tooltiptheme)

Defined in: [core/config.ts:77](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L77)

##### tooltipHeight?

> `optional` **tooltipHeight?**: `number`

Defined in: [core/config.ts:82](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L82)

##### tooltipOptions

> **tooltipOptions**: [`TooltipOptions`](#tooltipoptions-1)

Defined in: [core/config.ts:79](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L79)

##### tooltipWidth?

> `optional` **tooltipWidth?**: `number`

Defined in: [core/config.ts:81](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L81)

##### triggerStyle

> **triggerStyle**: [`TooltipTriggerStyle`](#tooltiptriggerstyle)

Defined in: [core/config.ts:64](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L64)

Visual cue applied to initialized tooltip triggers. Defaults to none.

##### visualPreload

> **visualPreload**: [`VisualPreloadMode`](#visualpreloadmode)

Defined in: [core/config.ts:74](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L74)

***

### TooltipTimingEvent

Defined in: [core/config.ts:51](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L51)

#### Properties

##### details?

> `optional` **details?**: [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `unknown`\>

Defined in: [core/config.ts:56](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L56)

##### elapsedMs

> **elapsedMs**: `number`

Defined in: [core/config.ts:53](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L53)

##### label

> **label**: `string`

Defined in: [core/config.ts:52](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L52)

##### timestampMs

> **timestampMs**: `number`

Defined in: [core/config.ts:54](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L54)

##### tooltipId?

> `optional` **tooltipId?**: `string`

Defined in: [core/config.ts:55](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L55)

## Type Aliases

### FixedPlacement

> **FixedPlacement** = `"top"` \| `"top-start"` \| `"top-end"` \| `"right"` \| `"right-start"` \| `"right-end"` \| `"bottom"` \| `"bottom-start"` \| `"bottom-end"` \| `"left"` \| `"left-start"` \| `"left-end"`

Defined in: [core/config.ts:13](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L13)

***

### PrefetchMode

> **PrefetchMode** = `"smart"` \| `"all"` \| `"none"`

Defined in: [core/config.ts:1](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L1)

***

### SectionLoadingMode

> **SectionLoadingMode** = `"lazy"` \| `"eager"`

Defined in: [core/config.ts:2](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L2)

***

### SectionVariant

> **SectionVariant** = `"cards"` \| `"dividers"`

Defined in: [core/config.ts:5](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L5)

***

### TooltipOptions

> **TooltipOptions** = [`TooltipPlacementOptions`](#tooltipplacementoptions) & `object`

Defined in: [core/config.ts:39](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L39)

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

Defined in: [core/config.ts:27](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L27)

***

### TooltipPresentation

> **TooltipPresentation** = `"auto"` \| `"popover"` \| `"drawer"`

Defined in: [core/config.ts:6](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L6)

***

### TooltipTheme

> **TooltipTheme** = `"light"` \| `"dark"` \| `"auto"` \| `"material"` \| `"translucent"` \| `"light-border"` \| `undefined`

Defined in: [core/config.ts:3](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L3)

***

### TooltipTimingObserver

> **TooltipTimingObserver** = (`event`) => `void`

Defined in: [core/config.ts:59](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L59)

#### Parameters

##### event

[`TooltipTimingEvent`](#tooltiptimingevent)

#### Returns

`void`

***

### TooltipTriggerStyle

> **TooltipTriggerStyle** = `"none"` \| [`TooltipTriggerStylePreset`](#tooltiptriggerstylepreset) \| readonly [`TooltipTriggerStylePreset`](#tooltiptriggerstylepreset)[]

Defined in: [core/config.ts:8](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L8)

***

### TooltipTriggerStylePreset

> **TooltipTriggerStylePreset** = `"dotted"` \| `"solid"` \| `"bold"`

Defined in: [core/config.ts:7](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L7)

***

### VisualPreloadMode

> **VisualPreloadMode** = `"none"` \| `"hover"` \| `"init"`

Defined in: [core/config.ts:4](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L4)

## Variables

### defaultCoreConfig

> `const` **defaultCoreConfig**: [`CoreTooltipConfig`](#coretooltipconfig)

Defined in: [core/config.ts:87](https://github.com/mattjmeier/bio-tooltips/blob/main/src/core/config.ts#L87)
