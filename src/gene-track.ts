import type { Instance } from 'tippy.js';
import type { MyGeneInfoResult, MyGeneExon } from './config';
// import { getSectionBackgroundColor } from './utils'; 
import TomSelect from 'tom-select';
import tippy from 'tippy.js';
import { TippyInstanceWithCustoms } from './lifecycle';
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
 * @param instance - The parent tippy instance for theme propagation.
 */
function drawTranscript(
    svg: D3.Selection<SVGGElement, unknown, null, undefined>,
    transcript: MyGeneExon,
    xScale: D3.ScaleLinear<number, number>,
    instance: Instance
) {
    // Clear any previous drawing
    svg.selectAll('*').remove();

    if (!transcript?.position) return;

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
    svg.selectAll<SVGRectElement, ExonDrawingData>(".exon-rect")
        .data(drawingData)
        .enter().append("rect")
        .attr("class", "exon-rect")
        .attr("x", d => xScale(d.coords[0]))
        .attr("y", exonY)
        .attr("width", d => Math.max(1, xScale(d.coords[1]) - xScale(d.coords[0])))
        .attr("height", exonHeight)
        .each(function(this: SVGRectElement, d) {
            tippy(this, {
                content: `<strong>Exon ${d.exonNumber}:</strong> ${d.coords[0].toLocaleString()} - ${d.coords[1].toLocaleString()}`,
                placement: 'top', allowHTML: true, arrow: true, animation: 'scale-subtle',
                onShow(nestedInstance) {
                    const currentParentTheme = (instance.props as any).theme || 'auto';
                    nestedInstance.setProps({ theme: currentParentTheme });
                }
            });
        });
}

/**
 * Main rendering function
 */
export async function renderGeneTrack(
  instance: TippyInstanceWithCustoms, 
  data: MyGeneInfoResult, 
  uniqueId: string,
) {
    const container = instance.popper.querySelector<HTMLElement>(`#gene-tooltip-track-${uniqueId}`);
    const selectorEl = instance.popper.querySelector<HTMLSelectElement>(`#transcript-selector-${uniqueId}`);

    if (!container || !selectorEl ) return;

    if (instance._tomselect) {
        instance._tomselect.destroy();
        instance._tomselect = null;
    }

    const existingSvg = container.querySelector('svg');
    if (existingSvg) {
        const exonRects = existingSvg.querySelectorAll('.exon-rect');
        exonRects.forEach(rect => {
            const tippyInstance = (rect as any)._tippy;
            if (tippyInstance) {
                tippyInstance.destroy();
            }
        });
    }

    try {
        const d3 = await getD3();
        if (!d3) throw new Error("D3 library not loaded.");

        const transcripts = data.exons;

        if (!transcripts || transcripts.length === 0) {
            container.innerHTML = `<small>Transcript data not available.</small>`;
            return;
        }

        const longestTranscript = transcripts.reduce((longest, current) => {
            return (current.position?.length || 0) > (longest.position?.length || 0) ? current : longest;
        }, transcripts[0]);

        // --- D3 Setup ---
        const margin = { top: 20, right: 10, bottom: 5, left: 10 };
        const availableWidth = container.getBoundingClientRect().width;
        const width = availableWidth - margin.left - margin.right;
        const height = 20;

        container.innerHTML = ''; // Clear the loader
        const svgRoot = d3.select(container).append("svg")
            .attr("width", availableWidth)
            .attr("height", height + margin.top + margin.bottom);
        
        const g = svgRoot.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
        
        const allTxStarts = transcripts.map(tx => tx.txstart);
        const allTxEnds = transcripts.map(tx => tx.txend);
        const geneStart = Math.min(...allTxStarts);
        const geneEnd = Math.max(...allTxEnds);
        const xScale = d3.scaleLinear().domain([geneStart, geneEnd]).range([0, width]);
        
        const directionArrow = longestTranscript.strand === -1 ? '←' : '→';
        svgRoot.append("text")
            .attr("x", margin.left).attr("y", 12)
            .attr("font-family", "sans-serif").attr("font-size", "12px")
            .html(`<tspan font-weight="bold">${data.symbol}</tspan> <tspan>${directionArrow}</tspan>`);

        // --- Initial Draw (common to all cases) ---
        drawTranscript(g, longestTranscript, xScale, instance);
        
        // --- Conditionally Initialize Dropdown ---
        if (transcripts.length > 1) {
            const sortedTranscripts = [...transcripts].sort((a, b) => a.transcript.localeCompare(b.transcript));
            const tomSelectOptions = sortedTranscripts.map(tx => {
                const exonCount = tx.position?.length || 0;
                return {
                    value: tx.transcript,
                    text: `${tx.transcript} (${exonCount} exons)`
                };
            });

            // Initialize TomSelect
            const tomselect = new TomSelect(`#${selectorEl.id}`, {
                options: tomSelectOptions,
                items: [longestTranscript.transcript], // Pre-select the longest
                create: false,
                controlInput: null as any, // This is what the docs say to do, but the TomSettings types don't have `null` here.
                plugins: [], 
                onChange: (selectedValue: string) => {
                    const selectedTranscript = transcripts.find(tx => tx.transcript === selectedValue);
                    if (selectedTranscript) {
                        drawTranscript(g, selectedTranscript, xScale, instance);
                    }
                }
            });
            
            instance._tomselect = tomselect;

        } else {

            // If there's only one transcript, just hide the selector dropdown
            selectorEl.style.display = 'none';
        }

    } catch (error) {
        console.error("Error during gene track rendering:", error);
        if (container) container.innerHTML = `<small>Error rendering gene track.</small>`;
    }
}
