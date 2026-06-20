[**bio-tooltips**](../README.md)

***

## Functions

### getEffectiveTheme()

> **getEffectiveTheme**(`configTheme`): `string`

Defined in: [ui/theme.ts:6](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/ui/theme.ts#L6)

Determines the effective theme to be used for tippy instances.

#### Parameters

##### configTheme

`"light"` | `"dark"` | `"auto"` | `"material"` | `"translucent"` | `"light-border"` | `undefined`

#### Returns

`string`

***

### initializeThemeObserver()

> **initializeThemeObserver**(`instances`, `isAutoTheme`): `ThemeObserverCleanup`

Defined in: [ui/theme.ts:23](https://github.com/mattjmeier/bio-tooltips/blob/4dee91626011e1d0d5ac80e107dbf48b9bfb4e42/src/ui/theme.ts#L23)

Sets up a MutationObserver to watch for theme changes on the `<html>` element
and updates the tippy instances accordingly.

#### Parameters

##### instances

[`TippyInstanceWithCustoms`](../core/types.md#tippyinstancewithcustoms)\<`unknown`\>[]

##### isAutoTheme

`boolean`

#### Returns

`ThemeObserverCleanup`

A cleanup function to disconnect the observer.
