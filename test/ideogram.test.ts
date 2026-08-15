import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultConfig } from '../src/providers/mygene/config';
import { renderIdeogram } from '../src/providers/mygene/visuals/ideogram';
import type { TooltipController } from '../src/core/tooltip-controller';

describe('gene ideogram', () => {
  let onConstruct: (config: Record<string, any>) => void;

  class MockIdeogram {
    constructor(config: Record<string, any>) {
      onConstruct(config);
    }
  }

  beforeEach(() => {
    document.body.replaceChildren();
    onConstruct = config => queueMicrotask(config.onLoad);
    vi.stubGlobal('Ideogram', MockIdeogram);
  });

  it('renders its location marker without attaching another tooltip', async () => {
    let receivedConfig: Record<string, unknown> | undefined;
    onConstruct = config => {
      receivedConfig = config;
      queueMicrotask(config.onLoad);
    };

    const root = document.createElement('div');
    root.innerHTML = '<div class="gene-tooltip-ideo" id="gene-tooltip-ideo-test"></div>';
    document.body.append(root);
    const instance = {
      root,
      state: { isDestroyed: false, isMounted: true },
    } as TooltipController;

    await renderIdeogram(instance, {
      _id: '7157',
      query: 'TP53',
      symbol: 'TP53',
      taxid: 9606,
      genomic_pos: { chr: '17', start: 7661779, end: 7687538, strand: -1 },
    }, defaultConfig.ideogram, 'test', defaultConfig);

    expect(receivedConfig?.showAnnotTooltip).toBe(false);
    expect(receivedConfig?.onDrawAnnots).toBeUndefined();
    expect(receivedConfig?.onLoad).toBeTypeOf('function');
    expect(instance._nestedTooltips).toBeUndefined();
  });

  it('serializes initialization and skips a queued render after unmount', async () => {
    const completionCallbacks: Array<() => void> = [];
    onConstruct = config => completionCallbacks.push(config.onLoad);

    const makeInstance = (id: string) => {
      const root = document.createElement('div');
      root.innerHTML = `<div class="gene-tooltip-ideo" id="gene-tooltip-ideo-${id}"></div>`;
      document.body.append(root);
      return {
        root,
        state: { isDestroyed: false, isMounted: true },
      } as TooltipController;
    };
    const data = {
      _id: '7157',
      query: 'TP53',
      symbol: 'TP53',
      taxid: 9606,
      genomic_pos: { chr: '17', start: 7661779, end: 7687538, strand: -1 },
    };
    const first = makeInstance('first');
    const second = makeInstance('second');

    const firstRender = renderIdeogram(first, data, defaultConfig.ideogram, 'first', defaultConfig);
    const secondRender = renderIdeogram(second, data, defaultConfig.ideogram, 'second', defaultConfig);

    await vi.waitFor(() => expect(completionCallbacks).toHaveLength(1));
    expect(completionCallbacks).toHaveLength(1);

    second.state.isMounted = false;
    second.root.remove();
    completionCallbacks[0]();

    await Promise.all([firstRender, secondRender]);
    expect(completionCallbacks).toHaveLength(1);
  });

  it('does not initialize Ideogram without a chromosome', async () => {
    const construct = vi.fn();
    onConstruct = construct;
    const root = document.createElement('div');
    root.innerHTML = '<div class="gene-tooltip-ideo" id="gene-tooltip-ideo-missing"></div>';
    document.body.append(root);
    const instance = {
      root,
      state: { isDestroyed: false, isMounted: true },
    } as TooltipController;

    await renderIdeogram(instance, {
      _id: 'missing',
      query: 'missing',
      symbol: 'missing',
      taxid: 9606,
      genomic_pos: { chr: '', start: 0, end: 0, strand: 1 },
    }, defaultConfig.ideogram, 'missing', defaultConfig);

    expect(construct).not.toHaveBeenCalled();
    expect(root.textContent).toContain('No chromosome data');
  });
});
