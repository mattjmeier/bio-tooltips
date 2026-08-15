import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultConfig } from '../src/providers/mygene/config';
import { renderIdeogram } from '../src/providers/mygene/visuals/ideogram';
import type { TooltipController } from '../src/core/tooltip-controller';

describe('gene ideogram', () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it('renders its location marker without attaching another tooltip', async () => {
    let receivedConfig: Record<string, unknown> | undefined;
    class MockIdeogram {
      constructor(config: Record<string, unknown>) {
        receivedConfig = config;
      }
    }
    vi.stubGlobal('Ideogram', MockIdeogram);

    const root = document.createElement('div');
    root.innerHTML = '<div class="gene-tooltip-ideo" id="gene-tooltip-ideo-test"></div>';
    document.body.append(root);
    const instance = { root } as TooltipController;

    await renderIdeogram(instance, {
      _id: '7157',
      query: 'TP53',
      symbol: 'TP53',
      taxid: 9606,
      genomic_pos: { chr: '17', start: 7661779, end: 7687538, strand: -1 },
    }, defaultConfig.ideogram, 'test', defaultConfig);

    expect(receivedConfig?.showAnnotTooltip).toBe(false);
    expect(receivedConfig?.onDrawAnnots).toBeUndefined();
    expect(instance._nestedTooltips).toBeUndefined();
  });
});
