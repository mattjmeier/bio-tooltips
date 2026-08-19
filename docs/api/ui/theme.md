[**bio-tooltips**](../README.md)

***

## Functions

### getEffectiveTheme()

> **getEffectiveTheme**(`configTheme`): `string`

Defined in: [ui/theme.ts:6](https://github.com/mattjmeier/bio-tooltips/blob/acb01f2607b7371dc44a07b2a62fc3e79bec4f82/src/ui/theme.ts#L6)

Determines the effective theme to be used for tooltip instances.

#### Parameters

##### configTheme

`"light"` \| `"dark"` \| `"auto"` \| `"material"` \| `"translucent"` \| `"light-border"` \| `undefined`

#### Returns

`string`

***

### initializeThemeObserver()

> **initializeThemeObserver**(`instances`, `isAutoTheme`): `ThemeObserverCleanup`

Defined in: [ui/theme.ts:23](https://github.com/mattjmeier/bio-tooltips/blob/acb01f2607b7371dc44a07b2a62fc3e79bec4f82/src/ui/theme.ts#L23)

Sets up a MutationObserver to watch for theme changes on the `<html>` element
and updates the tooltip instances accordingly.

#### Parameters

##### instances

[`TooltipController`](../core/tooltip-controller.md#tooltipcontroller)\<`any`\>[]

##### isAutoTheme

`boolean`

#### Returns

`ThemeObserverCleanup`

A cleanup function to disconnect the observer.
