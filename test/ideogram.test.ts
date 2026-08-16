import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultConfig } from '../src/providers/mygene/config';
import { renderIdeogram } from '../src/providers/mygene/visuals/ideogram';
import { TooltipController } from '../src/core/tooltip-controller';
import type { TooltipOptions } from '../src/core/config';

const immediateTooltipOptions: TooltipOptions = {
  placement: 'bottom',
  offset: 10,
  viewportPadding: 8,
  showDelay: 0,
  hideDelay: 0,
  showDuration: 0,
  hideDuration: 0,
  zIndex: 9999,
  appendTo: () => document.body,
};

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

  it('keeps an active Ideogram target connected until initialization completes', async () => {
    const completionCallbacks: Array<() => void> = [];
    onConstruct = config => {
      completionCallbacks.push(() => {
        const container = document.querySelector(config.container);
        if (container?.isConnected) config.onLoad();
      });
    };

    const makeController = (id: string) => {
      const reference = document.createElement('button');
      document.body.append(reference);
      const controller = new TooltipController(reference, {
        content: `<div class="gene-tooltip-ideo" id="gene-tooltip-ideo-${id}"></div>`,
        tooltip: immediateTooltipOptions,
        theme: 'light',
      });
      controller.show();
      return controller;
    };
    const data = {
      _id: '7157',
      query: 'TP53',
      symbol: 'TP53',
      taxid: 9606,
      genomic_pos: { chr: '17', start: 7661779, end: 7687538, strand: -1 },
    };
    const first = makeController('active-first');
    const second = makeController('active-second');

    await new Promise(resolve => setTimeout(resolve, 0));
    const firstRender = renderIdeogram(
      first,
      data,
      defaultConfig.ideogram,
      'active-first',
      defaultConfig
    );
    first._visualRenderPromise = firstRender;
    const secondRender = renderIdeogram(
      second,
      data,
      defaultConfig.ideogram,
      'active-second',
      defaultConfig
    );

    await vi.waitFor(() => expect(completionCallbacks).toHaveLength(1));
    first.hide();
    await vi.waitFor(() => expect(first.state.isMounted).toBe(false));

    expect(first.root.isConnected).toBe(true);
    completionCallbacks[0]();

    await vi.waitFor(() => expect(completionCallbacks).toHaveLength(2));
    expect(first.root.isConnected).toBe(false);
    completionCallbacks[1]();

    await Promise.all([firstRender, secondRender]);
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

  it('uses the primary mouse chromosome instead of an alternate scaffold', async () => {
    let receivedConfig: Record<string, any> | undefined;
    onConstruct = config => {
      receivedConfig = config;
      queueMicrotask(config.onLoad);
    };
    const root = document.createElement('div');
    root.innerHTML = '<div class="gene-tooltip-ideo" id="gene-tooltip-ideo-mouse"></div>';
    document.body.append(root);
    const instance = {
      root,
      state: { isDestroyed: false, isMounted: true },
    } as TooltipController;

    await renderIdeogram(instance, {
      _id: '22059',
      query: 'Trp53',
      symbol: 'Trp53',
      taxid: 10090,
      genomic_pos: [
        { chr: 'QGOO01036689.1', start: 343420, end: 347943, strand: -1 },
        { chr: '11', start: 69469669, end: 69482701, strand: 1 },
      ],
    }, defaultConfig.ideogram, 'mouse', defaultConfig);

    expect(receivedConfig?.chromosome).toBe('11');
    expect(receivedConfig?.annotations).toEqual([{
      name: 'Trp53',
      chr: '11',
      start: 69469669,
      stop: 69482701,
    }]);
  });

  it('does not initialize Ideogram when only an alternate scaffold is available', async () => {
    const construct = vi.fn();
    onConstruct = construct;
    const root = document.createElement('div');
    root.innerHTML = '<div class="gene-tooltip-ideo" id="gene-tooltip-ideo-scaffold"></div>';
    document.body.append(root);
    const instance = {
      root,
      state: { isDestroyed: false, isMounted: true },
    } as TooltipController;

    await renderIdeogram(instance, {
      _id: 'scaffold',
      query: 'scaffold',
      symbol: 'scaffold',
      taxid: 10090,
      genomic_pos: { chr: 'QGOO01036689.1', start: 343420, end: 347943, strand: -1 },
    }, defaultConfig.ideogram, 'scaffold', defaultConfig);

    expect(construct).not.toHaveBeenCalled();
    expect(root.textContent).toContain('Ideogram not available for this chromosome.');
  });
});
