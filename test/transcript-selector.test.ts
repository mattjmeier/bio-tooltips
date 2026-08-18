import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { defaultCoreConfig } from '../src/core/config';
import { createShownHandler } from '../src/core/lifecycle';
import { TooltipController } from '../src/core/tooltip-controller';
import { defaultConfig } from '../src/providers/mygene/config';
import { myGeneProfile } from '../src/providers/mygene/profile';
import { renderTooltipHTML } from '../src/providers/mygene/renderer';
import type { MyGeneExon, MyGeneInfoResult } from '../src/providers/mygene/types';
import { renderGeneTrack } from '../src/providers/mygene/visuals/gene-track';
import {
  getUsableTranscripts,
  initializeNativeTranscriptSelector,
} from '../src/providers/mygene/visuals/transcript-selector';

function transcript(transcriptId: string, exonCount: number): MyGeneExon {
  return {
    cdsend: 100,
    cdsstart: 0,
    chr: '17',
    strand: 1,
    txend: 100,
    txstart: 0,
    transcript: transcriptId,
    position: Array.from({ length: exonCount }, (_, index) => [index * 10, (index * 10) + 5]),
  };
}

function geneData(exons: MyGeneExon[] | undefined): MyGeneInfoResult {
  return {
    _id: '7157',
    query: 'TP53',
    symbol: 'TP53',
    name: 'tumor protein p53',
    taxid: 9606,
    exons,
  };
}

describe('native transcript selector', () => {
  it('sorts native options, shows exon counts, and selects the longest transcript', () => {
    const selector = document.createElement('select');
    const transcripts = [
      transcript('ENST000003', 2),
      transcript('ENST000001', 5),
      transcript('ENST000002', 3),
    ];

    const selected = initializeNativeTranscriptSelector(selector, transcripts, {
      selectedTranscriptId: 'not-a-transcript',
      onChange: vi.fn(),
    });

    expect(selected).toBe('ENST000001');
    expect(selector.hidden).toBe(false);
    expect([...selector.options].map(option => option.value)).toEqual([
      'ENST000001',
      'ENST000002',
      'ENST000003',
    ]);
    expect([...selector.options].map(option => option.text)).toEqual([
      'ENST000001 · 5 exons',
      'ENST000002 · 3 exons',
      'ENST000003 · 2 exons',
    ]);
    expect(selector.value).toBe('ENST000001');
  });

  it('requests an immediate redraw for the selected transcript without retaining old handlers', () => {
    const selector = document.createElement('select');
    const transcripts = [transcript('ENST000001', 5), transcript('ENST000002', 3)];
    const oldRedraw = vi.fn();
    const redraw = vi.fn();

    initializeNativeTranscriptSelector(selector, transcripts, {
      selectedTranscriptId: 'ENST000001',
      onChange: oldRedraw,
    });
    initializeNativeTranscriptSelector(selector, transcripts, {
      selectedTranscriptId: 'ENST000001',
      onChange: redraw,
    });
    selector.value = 'ENST000002';
    selector.dispatchEvent(new Event('change'));

    expect(selector.options).toHaveLength(2);
    expect(oldRedraw).not.toHaveBeenCalled();
    expect(redraw).toHaveBeenCalledTimes(1);
    expect(redraw).toHaveBeenCalledWith('ENST000002');
  });

  it('hides and clears the selector when only one transcript is usable', () => {
    const selector = document.createElement('select');
    selector.append(new Option('stale option', 'stale'));

    const selected = initializeNativeTranscriptSelector(selector, [transcript('ENST000001', 5)], {
      selectedTranscriptId: 'ENST000001',
      onChange: vi.fn(),
    });

    expect(selected).toBeNull();
    expect(selector.hidden).toBe(true);
    expect(selector.options).toHaveLength(0);
    expect(selector.onchange).toBeNull();
  });

  it('hides the selector and retains the transcript-data fallback when no transcript is usable', async () => {
    const uniqueId = 'missing-transcripts';
    const tooltipRoot = document.createElement('div');
    tooltipRoot.innerHTML = `
      <select id="transcript-selector-${uniqueId}"></select>
      <div id="gene-tooltip-track-${uniqueId}"></div>
    `;
    const instance = { root: tooltipRoot } as TooltipController;

    await renderGeneTrack(instance, geneData([]), uniqueId, defaultCoreConfig);

    expect(tooltipRoot.querySelector<HTMLSelectElement>('select')?.hidden).toBe(true);
    expect(tooltipRoot.querySelector('#gene-tooltip-track-missing-transcripts')?.textContent)
      .toContain('Transcript data not available.');
    expect(getUsableTranscripts([{
      ...transcript('', 2),
      position: undefined,
    }])).toEqual([]);
  });

  it('binds exon child tooltips on the initial gene-track render', async () => {
    const uniqueId = 'initial-exon-tooltips';
    const data = geneData([
      transcript('ENST000001', 3),
      transcript('ENST000002', 2),
    ]);
    const reference = document.createElement('button');
    document.body.append(reference);
    const parent = new TooltipController(reference, {
      content: renderTooltipHTML(data, { uniqueId }),
      tooltip: {
        ...defaultCoreConfig.tooltipOptions,
        showDuration: 0,
        hideDuration: 0,
        appendTo: () => document.body,
      },
      theme: 'light',
    });

    // Mount the parent without starting Floating UI; this test is concerned
    // with the visual lifecycle's initial child-controller attachment.
    document.body.append(parent.root);
    parent.state.isMounted = true;
    parent.state.isShown = true;
    parent.status = 'open';
    const container = parent.root.querySelector<HTMLElement>(`#gene-tooltip-track-${uniqueId}`)!;
    Object.defineProperty(container, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        width: 320,
        height: 45,
        top: 0,
        right: 320,
        bottom: 45,
        left: 0,
        x: 0,
        y: 0,
        toJSON() {},
      }),
    });

    await renderGeneTrack(parent, data, uniqueId, {
      ...defaultCoreConfig,
      nestedTooltipOptions: {
        ...defaultCoreConfig.nestedTooltipOptions,
        showDuration: 0,
        hideDuration: 0,
      },
    });
    await new Promise(resolve => setTimeout(resolve, 20));

    const firstExon = container.querySelector<SVGRectElement>('.exon-rect')!;
    expect(firstExon.hasAttribute('data-gt-tooltip-reference')).toBe(true);
    expect(parent._nestedTooltips).toHaveLength(3);
    parent.destroy();
  });

  it('uses accessible native markup and contains no Tom Select classes or integration', () => {
    const html = renderTooltipHTML(geneData([
      transcript('ENST000002', 2),
      transcript('ENST000001', 5),
    ]), { uniqueId: 'native-selector' });
    const runtimeSources = [
      'src/providers/mygene/visuals/gene-track.ts',
      'src/providers/mygene/visuals/transcript-selector.ts',
      'src/core/types.ts',
      'src/core/lifecycle.ts',
      'src/css/main.css',
    ].map(path => readFileSync(resolve(path), 'utf8'));

    expect(html).toContain('class="gene-tooltip-transcript-selector"');
    expect(html).toContain('aria-label="Select transcript"');
    const removedIntegrationPattern = new RegExp([
      'Tom', 'Select|tom', '-select|_tom', 'select|ts-',
      'wrapper|ts-', 'control|ts-', 'dropdown',
    ].join(''));

    expect(html).not.toMatch(removedIntegrationPattern);
    expect(runtimeSources.join('\n')).not.toMatch(removedIntegrationPattern);
  });

  it('does not collapse the gene-model section when the native selector is clicked', () => {
    const tooltipRoot = document.createElement('div');
    tooltipRoot.innerHTML = renderTooltipHTML(geneData([
      transcript('ENST000002', 2),
      transcript('ENST000001', 5),
    ]), {
      uniqueId: 'selector-interaction',
      display: { collapsible: true },
    });
    const instance = { root: tooltipRoot } as TooltipController<MyGeneInfoResult>;
    const onShown = createShownHandler(defaultConfig, myGeneProfile);
    onShown(instance);

    const section = tooltipRoot.querySelector<HTMLElement>('[data-section="gene-model"]')!;
    const selector = section.querySelector<HTMLSelectElement>('select')!;
    const trigger = section.querySelector<HTMLElement>('.gt-collapsible-header')!;

    expect(selector.closest('.gt-collapsible-header')).toBeNull();
    expect(section.dataset.collapsed).toBe('false');

    selector.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(section.dataset.collapsed).toBe('false');

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(section.dataset.collapsed).toBe('true');
  });

  it('animates collapsible content using its measured height', () => {
    const tooltipRoot = document.createElement('div');
    tooltipRoot.innerHTML = renderTooltipHTML(geneData([]), {
      uniqueId: 'measured-height',
      display: { collapsible: true },
    });
    const instance = { root: tooltipRoot } as TooltipController<MyGeneInfoResult>;
    createShownHandler(defaultConfig, myGeneProfile)(instance);

    const section = tooltipRoot.querySelector<HTMLElement>('[data-section="gene-model"]')!;
    const trigger = section.querySelector<HTMLElement>('.gt-collapsible-header')!;
    const content = section.querySelector<HTMLElement>('.gt-collapsible-content')!;
    Object.defineProperty(content, 'scrollHeight', { configurable: true, value: 187 });

    trigger.click();
    expect(content.style.getPropertyValue('--gt-collapsible-content-height')).toBe('187px');
    expect(section.dataset.collapsed).toBe('true');

    trigger.click();
    const opacityTransitionEnd = new Event('transitionend');
    Object.defineProperty(opacityTransitionEnd, 'propertyName', { value: 'opacity' });
    content.dispatchEvent(opacityTransitionEnd);
    expect(content.style.getPropertyValue('--gt-collapsible-content-height')).toBe('187px');

    const transitionEnd = new Event('transitionend');
    Object.defineProperty(transitionEnd, 'propertyName', { value: 'height' });
    content.dispatchEvent(transitionEnd);
    expect(content.style.getPropertyValue('--gt-collapsible-content-height')).toBe('');
  });

  it('releases a measured height when a transition is interrupted', async () => {
    const tooltipRoot = document.createElement('div');
    tooltipRoot.innerHTML = renderTooltipHTML(geneData([]), {
      uniqueId: 'interrupted-height',
      display: { collapsible: true },
    });
    const instance = { root: tooltipRoot } as TooltipController<MyGeneInfoResult>;
    createShownHandler(defaultConfig, myGeneProfile)(instance);

    const section = tooltipRoot.querySelector<HTMLElement>('[data-section="gene-model"]')!;
    const trigger = section.querySelector<HTMLElement>('.gt-collapsible-header')!;
    const content = section.querySelector<HTMLElement>('.gt-collapsible-content')!;
    Object.defineProperty(content, 'scrollHeight', { configurable: true, value: 187 });

    trigger.click();
    trigger.click();
    await new Promise(resolve => setTimeout(resolve, 320));

    expect(content.style.getPropertyValue('--gt-collapsible-content-height')).toBe('');
  });

  it('renders section visuals only once across repeated expansions', async () => {
    const uniqueId = 'cached-section-visual';
    const data = geneData([transcript('ENST000001', 2)]);
    const tooltipRoot = document.createElement('div');
    tooltipRoot.innerHTML = renderTooltipHTML(data, {
      uniqueId,
      display: { collapsible: true },
    });
    const renderVisuals = vi.fn().mockResolvedValue(undefined);
    const profile = { ...myGeneProfile, renderVisuals };
    const instance = {
      root: tooltipRoot,
      _entityData: data,
      _uniqueId: uniqueId,
      state: {
        isDestroyed: false,
        isMounted: false,
        isShown: false,
        isVisible: false,
      },
    } as TooltipController<MyGeneInfoResult>;
    const onShown = createShownHandler(defaultConfig, profile);
    onShown(instance);

    const trigger = tooltipRoot.querySelector<HTMLElement>(
      '[data-section="gene-model"] .gt-collapsible-header'
    )!;

    trigger.click(); // Collapse.
    trigger.click(); // First expansion renders the visual.
    await Promise.resolve();
    expect(renderVisuals).toHaveBeenCalledTimes(1);

    trigger.click();
    trigger.click(); // Later expansions reuse the existing visual.
    await Promise.resolve();
    expect(renderVisuals).toHaveBeenCalledTimes(1);
  });

  it('progressively themes the native picker while retaining selector override hooks', () => {
    const stylesheet = readFileSync(resolve('src/css/main.css'), 'utf8');

    expect(stylesheet).toContain('@supports (appearance: base-select)');
    expect(stylesheet).toContain('.gene-tooltip-transcript-selector::picker(select)');
    expect(stylesheet).toContain('--gt-transcript-selector-picker-background');
    expect(stylesheet).toContain('--gt-transcript-selector-option-selected');
  });
});
