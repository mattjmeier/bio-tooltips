import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { defaultCoreConfig } from '../src/core/config';
import { createOnShownHandler } from '../src/core/lifecycle';
import type { TippyInstanceWithCustoms } from '../src/core/types';
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
      'ENST000001 (5 exons)',
      'ENST000002 (3 exons)',
      'ENST000003 (2 exons)',
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
    const popper = document.createElement('div');
    popper.innerHTML = `
      <select id="transcript-selector-${uniqueId}"></select>
      <div id="gene-tooltip-track-${uniqueId}"></div>
    `;
    const instance = { popper } as TippyInstanceWithCustoms;

    await renderGeneTrack(instance, geneData([]), uniqueId, defaultCoreConfig);

    expect(popper.querySelector<HTMLSelectElement>('select')?.hidden).toBe(true);
    expect(popper.querySelector('#gene-tooltip-track-missing-transcripts')?.textContent)
      .toContain('Transcript data not available.');
    expect(getUsableTranscripts([{
      ...transcript('', 2),
      position: undefined,
    }])).toEqual([]);
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
    const popper = document.createElement('div');
    popper.innerHTML = renderTooltipHTML(geneData([
      transcript('ENST000002', 2),
      transcript('ENST000001', 5),
    ]), {
      uniqueId: 'selector-interaction',
      display: { collapsible: true },
    });
    const instance = { popper } as TippyInstanceWithCustoms<MyGeneInfoResult>;
    const onShown = createOnShownHandler(defaultConfig, myGeneProfile);
    onShown(instance);

    const section = popper.querySelector<HTMLElement>('[data-section="gene-model"]')!;
    const selector = section.querySelector<HTMLSelectElement>('select')!;
    const trigger = section.querySelector<HTMLElement>('.gt-collapsible-header')!;

    expect(selector.closest('.gt-collapsible-header')).toBeNull();
    expect(section.dataset.collapsed).toBe('false');

    selector.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(section.dataset.collapsed).toBe('false');

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(section.dataset.collapsed).toBe('true');
  });

  it('progressively themes the native picker while retaining selector override hooks', () => {
    const stylesheet = readFileSync(resolve('src/css/main.css'), 'utf8');

    expect(stylesheet).toContain('@supports (appearance: base-select)');
    expect(stylesheet).toContain('.gene-tooltip-transcript-selector::picker(select)');
    expect(stylesheet).toContain('--gt-transcript-selector-picker-background');
    expect(stylesheet).toContain('--gt-transcript-selector-option-selected');
  });
});
