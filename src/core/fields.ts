import type { SectionLoadingMode } from './config.js';
import { getSectionKey, getSectionState, type CoreSectionVisibility } from './sections.js';

export interface SectionFields { key: string; title: string; fields: string[] }

export function createFieldPlan(
  base: string[], sections: SectionFields[],
  display: { collapsible?: boolean; collapsedByDefault?: boolean; [key: string]: unknown },
  sectionLoading: SectionLoadingMode = 'lazy'
): { initial: string[]; deferred: Record<string, string[]> } {
  const initial = new Set(base);
  const deferred: Record<string, string[]> = {};
  for (const section of sections) {
    const state = getSectionState(display[section.key] as CoreSectionVisibility, display.collapsedByDefault ?? false);
    if (!state.isVisible) continue;
    if (sectionLoading !== 'eager' && display.collapsible && state.startCollapsed) deferred[getSectionKey(section.title)] = section.fields;
    else section.fields.forEach(field => initial.add(field));
  }
  return { initial: [...initial], deferred };
}
