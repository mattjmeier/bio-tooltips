import type { MyGeneExon, MyGeneInfoResult } from '../types.js';
import { createStaticTooltip, type TooltipController } from '../../../core/tooltip-controller.js';
import type { CoreTooltipConfig, TooltipOptions } from '../../../core/config.js';
import { logTooltipTiming } from '../../../core/timing.js';
import {
    getLongestTranscript,
    getUsableTranscripts,
    initializeNativeTranscriptSelector,
    renderGeneTextAlternative,
    setGeneTextAlternativeExpanded,
} from './transcript-selector.js';
// 1. Import the D3 type definitions
import type * as D3 from 'd3';

let d3ModulePromise: Promise<typeof D3 | null> | null = null;

// 2. Update the function signature to use the imported type
export async function getD3(): Promise<typeof D3 | null> {
    if (d3ModulePromise) {
        return d3ModulePromise;
    }

    // Check for D3 as a global variable first
    if ((window as any).d3) {
        // We cast here to tell TS that the global d3 matches the D3 module type
        d3ModulePromise = Promise.resolve((window as any).d3 as typeof D3);
        return d3ModulePromise;
    }

    // For ESM/CJS builds, use dynamic import
    d3ModulePromise = import('d3')
        .catch(error => {
            const errorMsg = `[GeneTooltip] Failed to load d3.js. 
Please ensure 'd3' is installed (it's a peer dependency) or the script is loaded on the page.`;
            console.error(errorMsg, error);
            return Promise.reject(new Error(errorMsg));
        });

    return d3ModulePromise;
}

/**
 * The core D3 drawing logic, now simplified to accept a SINGLE transcript object.
 * @param svg - The D3 selection for the SVG group element.
 * @param transcript - A single transcript object from the API's "exons" array.
 * @param xScale - The D3 scale for the x-axis.
 * @param instance - The parent tooltip instance for theme propagation.
 */
function drawTranscript(
    svg: D3.Selection<SVGGElement, unknown, null, undefined>,
    transcript: MyGeneExon,
    xScale: D3.ScaleLinear<number, number>,
    instance: TooltipController<any>,
    config: CoreTooltipConfig
): TooltipController[] {
    // Clear any previous drawing
    svg.selectAll('*').remove();

    if (!transcript?.position) return [];

    // Define constants for drawing from the transcript object
    const height = 20;
    const exonHeight = 10;
    const yCenter = height / 2;
    const exonY = yCenter - (exonHeight / 2);
    const { strand, txstart: geneStart, txend: geneEnd, position: exonSegments } = transcript;

    // Draw the main intron line for this transcript
    svg.append("line")
        .attr("x1", xScale(geneStart)).attr("y1", yCenter)
        .attr("x2", xScale(geneEnd)).attr("y2", yCenter)
        .attr("stroke", "#555").attr("stroke-width", 2);
    
    // Define the shape for our drawing data
    type ExonDrawingData = {
        coords: [number, number];
        exonNumber: number;
    };
    
    const totalExons = exonSegments.length;

    // Create a flat array for D3, assigning the correct exon number
    const drawingData: ExonDrawingData[] = exonSegments.map((pos, index) => {
        const exonNumber = (strand === -1) ? totalExons - index : index + 1;
        return { coords: pos, exonNumber };
    });

    // Draw the exon rectangles
    const tooltips: TooltipController[] = [];

    svg.selectAll<SVGRectElement, ExonDrawingData>(".exon-rect")
        .data(drawingData)
        .enter()
        .append("rect")
        .attr("class", "exon-rect")
        .attr("x", d => xScale(d.coords[0]))
        .attr("y", exonY)
        .attr("width", d => Math.max(1, xScale(d.coords[1]) - xScale(d.coords[0])))
        .attr("height", exonHeight)
        .each(function(this: SVGRectElement, d) {
            const child = createStaticTooltip(
                this,
                `<strong>Exon ${d.exonNumber}:</strong> ${d.coords[0].toLocaleString()} - ${d.coords[1].toLocaleString()}`,
                {
                    tooltip: {
                        ...config.nestedTooltipOptions,
                        placement: 'top',
                        fallbackPlacements: ['bottom', 'right', 'left'],
                        appendTo: instance.root,
                        zIndex: (config.tooltipOptions.zIndex ?? 9999) + 1,
                        allowedPlacements: undefined,
                    } as TooltipOptions,
                    theme: instance.theme,
                    constrainToViewport: config.constrainToViewport,
                    interactiveDebounce: 75,
                    parent: instance,
                }
            );

            instance.addNestedTooltip(child);
            tooltips.push(child);
        });

    return tooltips;
}

function setGeneTrackAccessibleLabel(
    svgRoot: D3.Selection<SVGSVGElement, unknown, null, undefined>,
    symbol: string,
    transcript: MyGeneExon,
    uniqueId: string,
): void {
    const labelId = `gene-track-label-${uniqueId}-${transcript.transcript.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
    svgRoot.attr('role', 'img').attr('aria-labelledby', labelId);
    svgRoot.select('title').remove();
    svgRoot.append('title').attr('id', labelId)
        .text(`${symbol} gene model, transcript ${transcript.transcript}, ${transcript.position?.length ?? 0} exons`);
}

/**
 * Main rendering function
 */
export async function renderGeneTrack(
  instance: TooltipController<any>,
  data: MyGeneInfoResult, 
  uniqueId: string,
  config: CoreTooltipConfig,
) {
    logTooltipTiming(instance, config, 'gene track render start');
    const container = instance.root.querySelector<HTMLElement>(`#gene-tooltip-track-${uniqueId}`);
    const selectorEl = instance.root.querySelector<HTMLSelectElement>(`#transcript-selector-${uniqueId}`);

    if (!container) return;

    const transcripts = getUsableTranscripts(data.exons);

    if (transcripts.length === 0) {
        container.innerHTML = `<small>Transcript data not available.</small>`;
        if (selectorEl) {
            selectorEl.replaceChildren();
            selectorEl.onchange = null;
            selectorEl.hidden = true;
        }
        logTooltipTiming(instance, config, 'gene track skipped', { reason: 'no-transcripts' });
        return;
    }

    const longestTranscript = getLongestTranscript(transcripts);

    let selectedTranscriptId = selectorEl?.value || longestTranscript.transcript;
    if (!transcripts.some(tx => tx.transcript === selectedTranscriptId)) {
        selectedTranscriptId = longestTranscript.transcript;
    }
    let drawSelectedTranscript: ((transcriptId: string) => void) | null = null;

    let exonTooltips: TooltipController[] = [];
    renderGeneTextAlternative(container, transcripts.find(tx => tx.transcript === selectedTranscriptId) ?? longestTranscript, data.symbol, uniqueId);

    try {
        if (transcripts.length > 1 && selectorEl) {
            logTooltipTiming(instance, config, 'transcript selector init start', {
                transcripts: transcripts.length,
                selected: selectedTranscriptId,
            });
            // Initialize the header control before D3 loads so it does not appear after the SVG.
            selectedTranscriptId = initializeNativeTranscriptSelector(selectorEl, transcripts, {
                selectedTranscriptId,
                onChange: selectedValue => {
                    selectedTranscriptId = selectedValue;
                    const selected = transcripts.find(tx => tx.transcript === selectedValue) ?? longestTranscript;
                    renderGeneTextAlternative(container, selected, data.symbol, uniqueId);
                    logTooltipTiming(instance, config, 'transcript selector change', { selected: selectedTranscriptId });
                    drawSelectedTranscript?.(selectedTranscriptId);
                },
            }) ?? longestTranscript.transcript;
            logTooltipTiming(instance, config, 'transcript selector init complete');

        } else if (selectorEl) {
            // A single transcript does not need a selection control.
            initializeNativeTranscriptSelector(selectorEl, transcripts, {
                selectedTranscriptId,
                onChange: () => undefined,
            });
            logTooltipTiming(instance, config, 'transcript selector skipped', { reason: 'single-transcript' });
        }

        logTooltipTiming(instance, config, 'd3 load start');
        const d3 = await getD3();
        if (!d3) throw new Error("D3 library not loaded.");
        logTooltipTiming(instance, config, 'd3 load complete');

        // --- D3 Setup ---
        // The visible label now lives in the HTML meta row, so the SVG only
        // needs a small inset above the exon line.
        const margin = { top: 4, right: 10, bottom: 5, left: 10 };
        const availableWidth = container.getBoundingClientRect().width;
        const width = availableWidth - margin.left - margin.right;
        const height = 20;
        logTooltipTiming(instance, config, 'gene track measured', { availableWidth, width });

        // Remove only the loading/previous SVG output; retain the native text
        // alternative so it remains available throughout async rendering.
        container.querySelector('svg')?.remove();
        container.querySelector('.gt-gene-track-status')?.remove();
        container.querySelector('small:not(.gt-gene-track-status)')?.remove();
        container.querySelectorAll('.gt-loader-container').forEach(loader => loader.remove());
        const svgRoot = d3.select(container).append("svg")
            .attr("width", availableWidth)
            .attr("height", height + margin.top + margin.bottom);
        
        const g = svgRoot.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
        
        const allTxStarts = transcripts.map(tx => tx.txstart);
        const allTxEnds = transcripts.map(tx => tx.txend);
        const geneStart = Math.min(...allTxStarts);
        const geneEnd = Math.max(...allTxEnds);
        const xScale = d3.scaleLinear().domain([geneStart, geneEnd]).range([0, width]);
        
        drawSelectedTranscript = (transcriptId: string) => {
            exonTooltips.forEach(tooltip => tooltip.destroy());
            const selectedTranscript = transcripts.find(tx => tx.transcript === transcriptId) ?? longestTranscript;
            renderGeneTextAlternative(container, selectedTranscript, data.symbol, uniqueId);
            exonTooltips = drawTranscript(g, selectedTranscript, xScale, instance, config);
            setGeneTrackAccessibleLabel(svgRoot, data.symbol, selectedTranscript, uniqueId);
        };

        // --- Initial Draw (common to all cases) ---
        drawSelectedTranscript(selectedTranscriptId);
        logTooltipTiming(instance, config, 'gene track draw complete', { selected: selectedTranscriptId });

    } catch (error) {
        console.error("Error during gene track rendering:", error);
        container.querySelectorAll('.gt-loader-container').forEach(loader => loader.remove());
        const status = container.querySelector<HTMLElement>('.gt-gene-track-status')
            ?? document.createElement('small');
        status.className = 'gt-gene-track-status';
        status.setAttribute('role', 'status');
        setGeneTextAlternativeExpanded(container, true);
        status.textContent = 'Interactive gene track unavailable; exon data shown below.';
        if (!status.parentElement) {
            const alternative = container.querySelector('.gt-gene-text-alternative');
            if (alternative) alternative.before(status);
            else container.append(status);
        }
        logTooltipTiming(instance, config, 'gene track render failed');
    }
}
