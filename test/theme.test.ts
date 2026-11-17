import { afterEach, describe, expect, it } from 'vitest';
import { getEffectiveTheme, initializeThemeObserver } from '../src/ui/theme';
import type { TooltipController } from '../src/core/tooltip-controller';

const cleanups: Array<() => void> = [];
afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup());
  document.documentElement.classList.remove('dark', 'unrelated');
});

function instance(intent: string, theme = 'light') {
  const changes: string[] = [];
  const controller = {
    _themeIntent: intent, theme,
    setTheme(next: string) { changes.push(next); controller.theme = next; },
  };
  return { controller: controller as unknown as TooltipController, changes };
}

describe('theme intent and observation', () => {
  it('resolves automatic themes from the document while preserving explicit themes', () => {
    for (const dark of [false, true]) {
      document.documentElement.classList.toggle('dark', dark);
      expect(getEffectiveTheme('auto')).toBe(dark ? 'dark' : 'light');
      expect(getEffectiveTheme(undefined)).toBe(dark ? 'dark' : 'light');
      expect(getEffectiveTheme('material')).toBe('material');
      expect(getEffectiveTheme('light')).toBe('light');
    }
  });

  it('updates only automatic instances when the theme changes and avoids redundant updates', async () => {
    const auto = instance('auto');
    const explicit = instance('material', 'material');
    const alreadyDark = instance('auto', 'dark');
    cleanups.push(initializeThemeObserver([auto.controller, explicit.controller, alreadyDark.controller], true));
    document.documentElement.classList.add('dark');
    await Promise.resolve();
    expect(auto.changes).toEqual(['dark']);
    expect(explicit.changes).toEqual([]);
    expect(alreadyDark.changes).toEqual([]);
    document.documentElement.classList.add('unrelated');
    await Promise.resolve();
    expect(auto.changes).toEqual(['dark']);
    document.documentElement.classList.remove('dark');
    await Promise.resolve();
    expect(auto.changes).toEqual(['dark', 'light']);
    expect(alreadyDark.changes).toEqual(['light']);
    expect(explicit.changes).toEqual([]);
  });

  it('stops delivering mutations after cleanup, including already queued changes', async () => {
    const auto = instance('auto');
    const disconnect = initializeThemeObserver([auto.controller], true);
    cleanups.push(disconnect);
    document.documentElement.classList.add('dark');
    disconnect();
    disconnect();
    await Promise.resolve();
    document.documentElement.classList.remove('dark');
    await Promise.resolve();
    expect(auto.changes).toEqual([]);
  });

  it('does not follow document mutations for explicitly themed groups', async () => {
    const auto = instance('auto');
    cleanups.push(initializeThemeObserver([auto.controller], false));
    document.documentElement.classList.add('dark');
    await Promise.resolve();
    expect(auto.changes).toEqual([]);
  });
});
