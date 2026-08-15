import type { CoreTooltipConfig } from './config.js';
import type { TooltipController } from './tooltip-controller.js';
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

export interface RenderTooltipOptions {
  uniqueId: string;
}

export interface VisualRenderContext<TData, TConfig extends CoreTooltipConfig> {
  instance: TooltipController<TData>;
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
