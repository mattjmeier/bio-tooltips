import type { Instance } from 'tippy.js';
import type TomSelect from 'tom-select';
import type { CoreTooltipConfig } from './config.js';
export type { CoreTooltipConfig } from './config.js';

export interface EntityRef {
  query: string;
  context?: Record<string, string | number | boolean | undefined>;
}

export type EntityDataMap<TData> = Map<string, TData>;

export interface DataProvider<TData> {
  id: string;
  parseElement: (el: HTMLElement) => EntityRef | null;
  getCacheKey: (ref: EntityRef) => string;
  fetchBatch: (refs: EntityRef[]) => Promise<EntityDataMap<TData>>;
}

export type FormattedItem = { name: string; url?: string };

export interface NestedTooltipDefinition {
  selector: string;
  items: FormattedItem[];
}

export interface TippyInstanceWithCustoms<TData = unknown> extends Instance {
  _nestedTippys?: Instance[];
  _entityData?: TData | null;
  _geneData?: TData | null;
  _isFetching?: boolean;
  _uniqueId?: string;
  _themeIntent?: 'auto' | string;
  _isChildTippyVisible?: boolean;
  _isFullyShown?: boolean;
  _tomselect?: TomSelect | null;
  _sectionToggleHandler?: (event: Event) => void;
  _sectionKeydownHandler?: (event: KeyboardEvent) => void;
  _visualsRendered?: boolean;
  _isPinned?: boolean;
  _originalTrigger?: string;
  _pinButton?: HTMLElement | null;
}

export interface RenderTooltipOptions {
  uniqueId: string;
}

export interface VisualRenderContext<TData, TConfig extends CoreTooltipConfig> {
  instance: TippyInstanceWithCustoms<TData>;
  data: TData;
  config: TConfig;
  uniqueId: string;
  sectionKey?: string;
}

export interface TooltipProfile<TData, TConfig extends CoreTooltipConfig = CoreTooltipConfig> {
  id: string;
  provider: DataProvider<TData>;
  invalidElementMessage?: string;
  notFoundHTML?: string;
  renderTooltipHTML: (data: TData | null | undefined, options: RenderTooltipOptions, config: TConfig) => string;
  renderVisuals?: (ctx: VisualRenderContext<TData, TConfig>) => Promise<void> | void;
  getNestedTooltipDefinitions?: (
    data: TData,
    config: TConfig,
    uniqueId: string
  ) => NestedTooltipDefinition[];
  preload?: () => Promise<unknown>;
}
