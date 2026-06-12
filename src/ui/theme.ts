import type { TippyInstanceWithCustoms } from '../core/types.js';

/**
 * Determines the effective theme to be used for tippy instances.
 */
export function getEffectiveTheme(configTheme: 'light' | 'dark' | 'auto' | 'material' | 'translucent'| 'light-border' | undefined): string {
    const isAutoTheme = configTheme === 'auto' || typeof configTheme === 'undefined';
    if (isAutoTheme) {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? 'dark' : 'light';
    }
    return configTheme;
}


type ThemeObserverCleanup = () => void;

/**
 * Sets up a MutationObserver to watch for theme changes on the `<html>` element
 * and updates the tippy instances accordingly.
 * @returns A cleanup function to disconnect the observer.
 */
export function initializeThemeObserver(
    instances: TippyInstanceWithCustoms[], 
    isAutoTheme: boolean
): ThemeObserverCleanup {
    if (!isAutoTheme) {
        // If not auto, there's nothing to observe. Return a no-op cleanup.
        return () => {};
    }

    const setTippyTheme = (theme: string): void => {
        instances.forEach(instance => {
            if (instance._themeIntent === 'auto' && instance.props.theme !== theme) {
                instance.setProps({ theme });
            }
        });
    };

    const observer = new MutationObserver(() => {
        const isNowDark = document.documentElement.classList.contains('dark');
        const newTheme = isNowDark ? 'dark' : 'light';
        setTippyTheme(newTheme);
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    });

    // Return the function that will be called on destroy
    return () => observer.disconnect();
}
