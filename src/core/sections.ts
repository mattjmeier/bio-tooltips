export type CoreSectionVisibility = boolean | 'expanded' | 'collapsed';

export interface SectionState {
  isVisible: boolean;
  startCollapsed: boolean;
}

export function getSectionState(
  setting: CoreSectionVisibility | undefined,
  globalCollapsedByDefault: boolean
): SectionState {
  if (setting === false) {
    return { isVisible: false, startCollapsed: true };
  }

  if (setting === 'expanded') {
    return { isVisible: true, startCollapsed: false };
  }

  if (setting === 'collapsed') {
    return { isVisible: true, startCollapsed: true };
  }

  return {
    isVisible: true,
    startCollapsed: globalCollapsedByDefault,
  };
}

export function getSectionKey(title: string): string {
  return title.replace(/\s+/g, '-').toLowerCase();
}

export function renderCollapsibleSection(
  title: string,
  innerHTML: string,
  uniqueId: string,
  collapsible: boolean,
  isCollapsed: boolean,
  headerRightHTML: string = ''
): string {
  const collapsedState = collapsible ? isCollapsed : false;
  const sectionKey = getSectionKey(title);

  const arrow = collapsible
    ? `<span class="gt-section-arrow ${collapsedState ? 'collapsed' : ''}" aria-hidden="true"></span>`
    : '';

  const contentId = `gt-content-${uniqueId}-${sectionKey}`;
  let triggerClasses = 'gt-section-left gt-collapsible-header';
  if (collapsible) {
    triggerClasses += ' gt-is-collapsible';
  }

  const triggerAttributes = collapsible
    ? `role="button" tabindex="0" aria-expanded="${!collapsedState}" aria-controls="${contentId}"`
    : 'role="heading" aria-level="3"';

  return `
    <div class="gene-tooltip-section-container ${collapsible ? 'gt-collapsible' : ''}" 
        data-collapsed="${collapsedState ? 'true' : 'false'}"
        data-section="${sectionKey}">

      <div class="gene-tooltip-section-header">
        <div class="${triggerClasses}" ${triggerAttributes}>
          ${arrow}
          <span class="gt-section-title">${title}</span>
        </div>
        ${headerRightHTML}
      </div>

      <div class="gt-collapsible-content" id="${contentId}">
        ${innerHTML}
      </div>
    </div>
  `;
}
