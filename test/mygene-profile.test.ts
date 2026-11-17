import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { myGeneProfile } from '../src/providers/mygene/profile';
import { mergeConfig } from '../src/providers/mygene/config';
import type { TooltipController } from '../src/core/tooltip-controller';
import type { MyGeneInfoResult } from '../src/providers/mygene/types';

const visuals = vi.hoisted(() => ({
  track: vi.fn(), ideogram: vi.fn(), getD3: vi.fn(), getIdeogram: vi.fn(),
}));
vi.mock('../src/providers/mygene/visuals/gene-track', () => ({ renderGeneTrack: visuals.track, getD3: visuals.getD3 }));
vi.mock('../src/providers/mygene/visuals/ideogram', () => ({ renderIdeogram: visuals.ideogram, getIdeogram: visuals.getIdeogram }));

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}
const gene: MyGeneInfoResult = {
  _id: '7157', query: 'TP53', taxid: 9606,
  genomic_pos: { chr: '17', start: 10, end: 20, strand: 1 },
  exons: [{ chr: '17', cdsstart: 10, cdsend: 20, txstart: 10, txend: 20, strand: 1, transcript: 'ENST1' }],
};
function instance(collapsed = false) {
  const root = document.createElement('div');
  root.innerHTML = `<div data-section="location" data-collapsed="${collapsed}"></div><div data-section="gene-model" data-collapsed="${collapsed}"></div>`;
  return { root } as TooltipController<MyGeneInfoResult>;
}
beforeEach(() => {
  vi.resetAllMocks();
  visuals.track.mockResolvedValue(undefined);
  visuals.ideogram.mockResolvedValue(undefined);
});
afterEach(() => vi.restoreAllMocks());

describe('MyGene visual coordination', () => {
  it('defers collapsed visuals and renders each requested section once on expansion', async () => {
    const controller = instance(true);
    const config = mergeConfig();
    const context = { instance: controller, data: gene, config, uniqueId: 'gene' };
    await myGeneProfile.renderVisuals!(context);
    expect(visuals.track).not.toHaveBeenCalled();
    expect(visuals.ideogram).not.toHaveBeenCalled();
    await myGeneProfile.renderVisuals!({ ...context, sectionKey: 'location' });
    expect(visuals.ideogram).toHaveBeenCalledExactlyOnceWith(controller, gene, config.ideogram, 'gene', config);
    expect(visuals.track).not.toHaveBeenCalled();
    await myGeneProfile.renderVisuals!({ ...context, sectionKey: 'location' });
    await myGeneProfile.renderVisuals!({ ...context, sectionKey: 'gene-model' });
    await myGeneProfile.renderVisuals!({ ...context, sectionKey: 'gene-model' });
    expect(visuals.ideogram).toHaveBeenCalledTimes(1);
    expect(visuals.track).toHaveBeenCalledExactlyOnceWith(controller, gene, 'gene', config);
    expect([...controller._renderedVisualSections!]).toEqual(['location', 'gene-model']);
  });

  it('waits for both concurrently started visuals before reporting completion', async () => {
    const track = deferred<void>();
    const ideogram = deferred<void>();
    visuals.track.mockReturnValue(track.promise);
    visuals.ideogram.mockReturnValue(ideogram.promise);
    const onTiming = vi.fn();
    const controller = instance();
    const pending = myGeneProfile.renderVisuals!({ instance: controller, data: gene, config: mergeConfig({ onTiming }), uniqueId: 'gene' });
    expect(visuals.track).toHaveBeenCalledTimes(1);
    expect(visuals.ideogram).toHaveBeenCalledTimes(1);
    track.resolve();
    await Promise.resolve();
    expect(onTiming).not.toHaveBeenCalled();
    ideogram.resolve();
    await pending;
    expect(onTiming).toHaveBeenCalledWith(expect.objectContaining({
      label: 'mygene visual promises settled', details: { count: 2 },
    }));
    expect(controller._renderedVisualSections).toEqual(new Set(['gene-model', 'location']));
  });

  it('isolates visual failures and retries the failed section without rerendering a successful section', async () => {
    visuals.track.mockRejectedValueOnce(new Error('D3 unavailable'));
    const controller = instance();
    const context = { instance: controller, data: gene, config: mergeConfig(), uniqueId: 'gene' };
    await expect(Promise.resolve(myGeneProfile.renderVisuals!(context))).resolves.toBeUndefined();
    expect(controller._renderedVisualSections).toEqual(new Set(['location']));
    await myGeneProfile.renderVisuals!({ ...context, sectionKey: 'location' });
    expect(visuals.ideogram).toHaveBeenCalledTimes(1);
    await myGeneProfile.renderVisuals!({ ...context, sectionKey: 'gene-model' });
    expect(visuals.track).toHaveBeenCalledTimes(2);
    expect(controller._renderedVisualSections).toEqual(new Set(['location', 'gene-model']));
  });

  it('skips disabled visuals, absent annotations, and expansion of unrelated sections', async () => {
    const controller = instance();
    const context = { instance: controller, data: gene, config: mergeConfig(), uniqueId: 'gene' };
    await myGeneProfile.renderVisuals!({ ...context, config: mergeConfig({ display: { geneTrack: false }, ideogram: { enabled: false } }) });
    await myGeneProfile.renderVisuals!({ ...context, data: { _id: '7157', query: 'TP53' } });
    await myGeneProfile.renderVisuals!({ ...context, sectionKey: 'summary' });
    expect(visuals.track).not.toHaveBeenCalled();
    expect(visuals.ideogram).not.toHaveBeenCalled();
    expect(controller._renderedVisualSections?.size).toBe(0);
  });

  it('preloads both optional dependencies and returns individual outcomes when one fails', async () => {
    const error = new Error('D3 import failed');
    const ideogram = deferred<string>();
    visuals.getD3.mockRejectedValue(error);
    visuals.getIdeogram.mockReturnValue(ideogram.promise);
    const pending = myGeneProfile.preload!();
    expect(visuals.getD3).toHaveBeenCalledTimes(1);
    expect(visuals.getIdeogram).toHaveBeenCalledTimes(1);
    ideogram.resolve('ready');
    await expect(pending).resolves.toEqual([
      { status: 'rejected', reason: error }, { status: 'fulfilled', value: 'ready' },
    ]);
  });
});
