import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import ratExonFixtures from './fixtures/rat-exons.json';
import brca2ExonFixture from './fixtures/brca2-exons.json';
import { defaultCoreConfig } from '../src/core/config';
import { createShownHandler } from '../src/core/lifecycle';
import { TooltipController } from '../src/core/tooltip-controller';
import { defaultConfig } from '../src/providers/mygene/config';
import { myGeneProfile } from '../src/providers/mygene/profile';
import { renderTooltipHTML } from '../src/providers/mygene/renderer';
import type { MyGeneExon, MyGeneInfoResult } from '../src/providers/mygene/types';
import { enableSummaryExpand } from '../src/ui/summaryExpand';
import { renderGeneTrack } from '../src/providers/mygene/visuals/gene-track';
import {
  getUsableTranscripts,
  initializeTranscriptPicker,
  renderTranscriptPicker,
  renderGeneTextAlternative,
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

describe('transcript picker', () => {
  it('renders a compact accessible exon-data disclosure with strand and transcript identity', () => {
    const container = document.createElement('div');
    const selected = { ...transcript('ENST000009', 3), strand: -1 };

    const alternative = renderGeneTextAlternative(container, selected, 'TP53');

    expect(alternative.className).toBe('gt-gene-text-alternative');
    const toggle = container.querySelector<HTMLButtonElement>('.gt-gene-text-alternative-toggle')!;
    expect(toggle.textContent).toBe('Show exon data');
    expect(toggle.querySelector('.gt-section-arrow')).toBeNull();
    expect(toggle.getAttribute('aria-label')).toBe('Show exon data for TP53 gene model');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-controls')).toBe(alternative.id);
    expect(alternative.hidden).toBe(true);
    expect(container.querySelector('.gt-gene-track-label')?.textContent).toContain('TP53');
    expect(alternative.textContent).toContain('ENST000009');
    expect(alternative.textContent).toContain('strand: reverse (−)');
    expect(alternative.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(alternative.querySelector('tbody tr th')?.textContent).toBe('3');
    expect(alternative.querySelector('table caption')?.textContent).toContain('ENST000009');
  });

  it('updates the existing alternative without creating duplicate panels', () => {
    const container = document.createElement('div');
    renderGeneTextAlternative(container, transcript('ENST000001', 2), 'TP53');
    renderGeneTextAlternative(container, transcript('ENST000002', 1), 'TP53');

    expect(container.querySelectorAll('.gt-gene-text-alternative')).toHaveLength(1);
    expect(container.textContent).toContain('ENST000002');
    expect(container.textContent).not.toContain('ENST000001');
  });

  it('preserves a focused, open text disclosure during asynchronous visual updates', () => {
    const container = document.createElement('div');
    document.body.append(container);
    const alternative = renderGeneTextAlternative(container, transcript('ENST000001', 2), 'TP53');
    const toggle = container.querySelector<HTMLButtonElement>('.gt-gene-text-alternative-toggle')!;
    toggle.click();
    toggle.focus();

    renderGeneTextAlternative(container, transcript('ENST000001', 2), 'TP53');
    renderGeneTextAlternative(container, transcript('ENST000002', 3), 'TP53');

    expect(container.querySelector('.gt-gene-text-alternative-toggle')).toBe(toggle);
    expect(document.activeElement).toBe(toggle);
    expect(toggle.textContent).toBe('Hide exon data');
    expect(toggle.getAttribute('aria-label')).toBe('Hide exon data for TP53 gene model');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(alternative.hidden).toBe(false);
    expect(alternative.querySelectorAll('tbody tr')).toHaveLength(3);
    container.remove();
  });

  it('sorts model rows, shows exon counts, and selects the longest transcript', () => {
    const root = document.createElement('div');
    root.innerHTML = renderTranscriptPicker('sorting', [
      transcript('ENST000003', 2),
      transcript('ENST000001', 5),
      transcript('ENST000002', 1),
    ], undefined);
    const models = [...root.querySelectorAll<HTMLButtonElement>('[data-transcript-model]')];
    expect(models.map(model => model.textContent)).toEqual([
      'ENST000001 · 5 exons',
      'ENST000002 · 1 exon',
      'ENST000003 · 2 exons',
    ]);
    expect(models.map(model => model.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false']);
  });

  it('shows BRCA2 linked transcripts without implying their exon models are available', async () => {
    const data = brca2ExonFixture as MyGeneInfoResult;
    const uniqueId = 'brca2-availability';
    const instance = new TooltipController(document.createElement('button'), {
      content: renderTooltipHTML(data, { uniqueId }),
      tooltip: defaultCoreConfig.tooltipOptions,
      theme: 'light',
    });
    try {
      const container = instance.root.querySelector<HTMLElement>(`#gene-tooltip-track-${uniqueId}`)!;
      vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({ width: 320 } as DOMRect);
      await renderGeneTrack(instance, data, uniqueId, defaultCoreConfig);

      const disclosure = instance.root.querySelector<HTMLDetailsElement>('.gene-tooltip-transcript-selector')!;
      expect(disclosure.open).toBe(false);
      expect(disclosure.querySelector('summary')?.textContent).toContain('NM_000059');
      expect(disclosure.querySelectorAll('[data-transcript-model]')).toHaveLength(1);
      const linked = disclosure.querySelector('ul[aria-labelledby^="transcript-linked"]')!;
      expect(linked.querySelectorAll('button[data-copy]')).toHaveLength(19);
      expect(linked.querySelector('[data-transcript-model]')).toBeNull();
      expect(container.querySelectorAll('.exon-rect')).toHaveLength(27);
      expect(container.querySelectorAll('tbody tr')).toHaveLength(27);
      expect(instance.root.querySelector('[data-section="transcripts"] a')?.getAttribute('href'))
        .toContain('ensembl.org');
    } finally {
      instance.destroy();
    }
  });

  it('copies individual RefSeq and linked Ensembl IDs without changing the selected model', async () => {
    const uniqueId = 'copy-ensembl-id';
    const data = {
      ...geneData([transcript('NM_000001', 3), transcript('ENST000002.4', 1)]),
      ensembl: { transcript: ['ENSRNOT00000046490', ' ENSRNOT00000046490 '] },
    };
    const root = document.createElement('div');
    root.innerHTML = renderTooltipHTML(data, { uniqueId });
    document.body.append(root);
    const release = enableSummaryExpand();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    try {
      const picker = root.querySelector<HTMLDetailsElement>('.gene-tooltip-transcript-selector')!;
      const onChange = vi.fn();
      initializeTranscriptPicker(picker, onChange);
      picker.open = true;
      const buttons = [...picker.querySelectorAll<HTMLButtonElement>('button[data-copy]')];
      expect(buttons.map(button => button.getAttribute('aria-label'))).toEqual([
        'Copy ENST000002.4', 'Copy NM_000001', 'Copy ENSRNOT00000046490',
      ]);
      buttons[1].click();
      await vi.waitFor(() => expect(picker.querySelector('[role="status"]')?.textContent).toBe('Copied'));
      expect(buttons[1].classList.contains('gt-summary-copy-btn--success')).toBe(true);
      buttons[2].click();
      expect(writeText.mock.calls).toEqual([['NM_000001'], ['ENSRNOT00000046490']]);
      expect(picker.open).toBe(true);
      expect(picker.querySelector('summary')?.textContent).toContain('NM_000001');
      expect(onChange).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
      release();
      root.remove();
    }
  });

  it('requests an immediate redraw for the selected transcript without retaining old handlers', () => {
    const root = document.createElement('div');
    root.innerHTML = renderTranscriptPicker('redraw', [transcript('ENST000001', 5), transcript('ENST000002', 3)], undefined);
    const picker = root.querySelector('details')!;
    const oldRedraw = vi.fn();
    const redraw = vi.fn();
    initializeTranscriptPicker(picker, oldRedraw);
    initializeTranscriptPicker(picker, redraw);
    picker.open = true;
    const second = picker.querySelector<HTMLButtonElement>('[data-transcript-model="ENST000002"]')!;
    second.click();

    expect(picker.open).toBe(false);
    expect(picker.querySelector('summary')?.textContent).toContain('ENST000002');
    expect(second.getAttribute('aria-pressed')).toBe('true');
    expect(oldRedraw).not.toHaveBeenCalled();
    expect(redraw).toHaveBeenCalledExactlyOnceWith('ENST000002');
  });

  it('hides the selector and retains the transcript-data fallback when no transcript is usable', async () => {
    const uniqueId = 'missing-transcripts';
    const tooltipRoot = document.createElement('div');
    tooltipRoot.innerHTML = `
      <details id="transcript-selector-${uniqueId}"></details>
      <div id="gene-tooltip-track-${uniqueId}"></div>
    `;
    const instance = { root: tooltipRoot } as TooltipController;

    await renderGeneTrack(instance, geneData([]), uniqueId, defaultCoreConfig);

    expect(tooltipRoot.querySelector<HTMLDetailsElement>('details')?.hidden).toBe(true);
    expect(tooltipRoot.querySelector('#gene-tooltip-track-missing-transcripts')?.textContent)
      .toContain('Transcript data not available.');
    expect(getUsableTranscripts([{
      ...transcript('', 2),
      position: undefined,
    }])).toEqual([]);
  });

  // MyGene.info /v3/gene records 24842, 24186, and 24498: each rat
  // demo gene has one RefSeq transcript, with valid exon coordinates.
  it.each(ratExonFixtures)('renders a static transcript summary and exon track for rat $symbol', async fixture => {
    const data = fixture as MyGeneInfoResult;
    const uniqueId = `rat-${data.symbol}`;
    const instance = new TooltipController(document.createElement('button'), {
      content: renderTooltipHTML(data, { uniqueId }),
      tooltip: defaultCoreConfig.tooltipOptions,
      theme: 'light',
    });
    const root = instance.root;
    const container = root.querySelector<HTMLElement>(`#gene-tooltip-track-${uniqueId}`)!;
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({ width: 320 } as DOMRect);

    await renderGeneTrack(instance, data, uniqueId, defaultCoreConfig);

    const selected = data.exons![0];
    expect(root.querySelector('.gene-tooltip-transcript-selector')).toBeNull();
    const summary = root.querySelector('.gene-tooltip-transcript-summary')!;
    expect(summary.textContent).toBe(`${selected.transcript} · ${selected.position!.length} exons`);
    expect(summary.closest('.gt-collapsible-header')).toBeNull();
    expect(root.querySelector('.gene-tooltip-track-controls--single')).not.toBeNull();
    expect(container.querySelectorAll('.exon-rect')).toHaveLength(selected.position!.length);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(selected.position!.length);
    instance.destroy();
  });

  it('escapes a single transcript summary and uses the singular exon label', () => {
    const root = document.createElement('div');
    root.innerHTML = renderTooltipHTML(geneData([transcript('<b>NM_123</b>', 1)]));

    const summary = root.querySelector('.gene-tooltip-transcript-summary')!;
    expect(summary.textContent).toBe('<b>NM_123</b> · 1 exon');
    expect(summary.querySelector('b')).toBeNull();
    expect(root.querySelector('.gene-tooltip-transcript-selector')).toBeNull();
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
  }, 15_000);

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

    expect(html).toContain('<details class="gene-tooltip-track-controls gene-tooltip-transcript-selector"');
    expect(html).toContain('aria-label="Select transcript, current:');
    const removedIntegrationPattern = new RegExp([
      'Tom', 'Select|tom', '-select|_tom', 'select|ts-',
      'wrapper|ts-', 'control|ts-', 'dropdown',
    ].join(''));

    expect(html).not.toMatch(removedIntegrationPattern);
    expect(runtimeSources.join('\n')).not.toMatch(removedIntegrationPattern);
  });

  it('does not collapse the gene-model section when the picker is clicked', () => {
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
    const selector = section.querySelector<HTMLElement>('.gene-tooltip-transcript-selector summary')!;
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

  it('retains selector theme overrides', () => {
    const stylesheet = readFileSync(resolve('src/css/main.css'), 'utf8');

    expect(stylesheet).toContain('.gt-transcript-picker');
    expect(stylesheet).toContain('--gt-transcript-selector-picker-background');
    expect(stylesheet).toContain('--gt-transcript-selector-option-selected');
  });
});

// Keep the optional-dependency failure case last because the mocked dynamic
// import is intentionally process-local to this test file.
describe('gene track fallback', () => {
  it('keeps the text alternative and removes the loader when D3 fails', async () => {
    vi.resetModules();
    vi.doMock('d3', () => { throw new Error('D3 unavailable'); });
    const { renderGeneTrack: renderWithFailedD3 } = await import('../src/providers/mygene/visuals/gene-track');
    const uniqueId = 'failed-d3-alternative';
    const root = document.createElement('div');
    root.innerHTML = `<details id="transcript-selector-${uniqueId}"></details><div id="gene-tooltip-track-${uniqueId}"><div class="gt-loader-container"><span>Loading...</span></div></div>`;

    await renderWithFailedD3({ root } as TooltipController, geneData([transcript('ENST000001', 2)]), uniqueId, defaultCoreConfig);

    expect(root.querySelector('.gt-gene-text-alternative')).not.toBeNull();
    expect(root.querySelector('.gt-gene-text-alternative')?.textContent).toContain('ENST000001');
    expect(root.querySelector('.gt-loader-container')).toBeNull();
    expect(root.querySelector('[role="status"]')?.textContent).toContain('exon data shown below');
    expect(root.querySelector('.gt-gene-text-alternative')?.hidden).toBe(false);
    expect(root.querySelector('.gt-gene-text-alternative-toggle')?.getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelector('[role="status"]')?.nextElementSibling)
      .toBe(root.querySelector('.gt-gene-text-alternative'));
    vi.doUnmock('d3');
  });
});
