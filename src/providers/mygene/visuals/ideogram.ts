import type { IdeogramConfig } from '../config.js';
import type { MyGeneInfoResult } from '../types.js';
import { speciesMap } from '../species.js';
import type { CoreTooltipConfig } from '../../../core/config.js';
import type { TooltipController } from '../../../core/tooltip-controller.js';
import { logTooltipTiming } from '../../../core/timing.js';
import {
  normalizeChromosomeName,
  selectPrimaryGenomicPosition,
} from '../genomic-position.js';

let ideogramModulePromise: Promise<any> | null = null;
let ideogramRenderQueue: Promise<void> = Promise.resolve();

function isActiveIdeogramTarget(
  instance: TooltipController<any>,
  container: HTMLElement
): boolean {
  return !instance.state.isDestroyed
    && instance.state.isMounted
    && container.isConnected
    && instance.root.contains(container);
}

function enqueueIdeogramRender(task: () => Promise<void>): Promise<void> {
  const render = ideogramRenderQueue.then(task);
  // A failed render must not prevent later tooltips from initializing.
  ideogramRenderQueue = render.catch(() => undefined);
  return render;
}

//  Checking for module or global mode
export async function getIdeogram() {
  // 1. Check for the cached promise first.
  if (ideogramModulePromise) {
    return ideogramModulePromise;
  }

  // 2. Check for the global variable.
  // If found, cache the resolved promise and return it.
  if ((window as any).Ideogram) {
    ideogramModulePromise = Promise.resolve((window as any).Ideogram);
    return ideogramModulePromise;
  }
  
  // 3. If no global and no cache, fall back to dynamic import.
  // The import will either work (in module environments)
  // or fail gracefully.
  ideogramModulePromise = import('ideogram')
    .then(module => {
      // Ideogram often exports as a default property
      return module.default || module;
    })
    .catch(error => {
      const errorMsg = `[GeneTooltip] Failed to load Ideogram. Please ensure 'ideogram' is installed or the script is loaded on the page.`;
      console.error(errorMsg, error);
      // Set promise to null so a retry is possible
      ideogramModulePromise = null; 
      return Promise.reject(new Error(errorMsg));
    });
  return ideogramModulePromise;
}

// The render function with unique ID parameter
export async function renderIdeogram(
  instance: TooltipController<any>,
  data: MyGeneInfoResult, 
  ideogramConfig: Partial<IdeogramConfig>,
  uniqueId: string,
  timingConfig: CoreTooltipConfig
) {
  logTooltipTiming(instance, timingConfig, 'ideogram render start');
  const ideogramContainerSelector = `#gene-tooltip-ideo-${uniqueId}`;
  const ideoDiv = instance.root.querySelector(ideogramContainerSelector) as HTMLElement;

  if (!ideoDiv) {
    console.error(`[GeneTooltip] CRITICAL: Ideogram container '${ideogramContainerSelector}' not found.`);
    return;
  }
  
  // Loading message should already be set by the renderTooltipHTML function by this point.

  try {
    // Wait for the library to load.
    logTooltipTiming(instance, timingConfig, 'ideogram library load start');
    const Ideogram = await getIdeogram();
    logTooltipTiming(instance, timingConfig, 'ideogram library load complete');

    if (!isActiveIdeogramTarget(instance, ideoDiv)) return;
    
    if (!Ideogram) {
      const ideoDivInTooltip = instance.root.querySelector(`.gene-tooltip-ideo`) as HTMLElement;
      if (ideoDivInTooltip) ideoDivInTooltip.innerHTML = '<small>Ideogram unavailable</small>';
      logTooltipTiming(instance, timingConfig, 'ideogram unavailable');
      return;
    }

    const genomicPos = selectPrimaryGenomicPosition(data.genomic_pos);
    if (!genomicPos) {
      const positions = Array.isArray(data.genomic_pos) ? data.genomic_pos : [data.genomic_pos];
      const hasChromosome = positions.some(position => normalizeChromosomeName(position?.chr));
      ideoDiv.innerHTML = hasChromosome
        ? '<small>Ideogram not available for this chromosome.</small>'
        : '<small>No chromosome data</small>';
      logTooltipTiming(instance, timingConfig, 'ideogram skipped', {
        reason: hasChromosome ? 'no-primary-chromosome' : 'no-chromosome',
      });
      return;
    }

    const chromosome = normalizeChromosomeName(genomicPos.chr)!;

    const organism = speciesMap[data.taxid]?.ideogramName;
    if (!organism) {
        ideoDiv.innerHTML = '<small>Ideogram not available for this species.</small>';
        logTooltipTiming(instance, timingConfig, 'ideogram skipped', { reason: 'unsupported-organism' });
        return;
    }

    // Also get the current text color
    const computedStyle = window.getComputedStyle(instance.root);
    const labelColor = computedStyle.getPropertyValue('--gt-text-color').trim();

    const configForIdeogram = {
      container: ideogramContainerSelector,
      organism,
      chrLabelColor: labelColor,
      annotationsColor: labelColor,
      chromosome: chromosome,
      chrHeight: ideogramConfig.height ?? 100,
      orientation: 'horizontal',
      showChromosomeLabels: false,
      chrMargin: 1,
      showBandLabels: ideogramConfig.showLabels ?? true,
      annotations: [{
        name: data.symbol,
        chr: chromosome,
        start: genomicPos.start,
        stop: genomicPos.end
      }],
      showAnnotTooltip: false,
      onClickAnnot: function() {},
    };
    await enqueueIdeogramRender(() => new Promise<void>((resolve, reject) => {
      // The tooltip may have disappeared while another Ideogram was initializing.
      if (!isActiveIdeogramTarget(instance, ideoDiv)) {
        resolve();
        return;
      }

      // Before drawing, clear the container of the spinner.
      // This gives the Ideogram library a clean slate.
      ideoDiv.innerHTML = '';
      logTooltipTiming(instance, timingConfig, 'ideogram container cleared');

      try {
        new Ideogram({
          ...configForIdeogram,
          // Ideogram performs chromosome and band initialization asynchronously.
          // Keep this render in flight until that work has completed.
          onLoad: resolve,
        });
        logTooltipTiming(instance, timingConfig, 'ideogram constructor called');
      } catch (error) {
        reject(error);
      }
    }));

    if (!isActiveIdeogramTarget(instance, ideoDiv)) return;
    logTooltipTiming(instance, timingConfig, 'ideogram render complete');

  } catch (error) {
    console.error('[GeneTooltip] Ideogram failed to render:', error);
    const ideoDivInTooltip = instance.root.querySelector(`.gene-tooltip-ideo`) as HTMLElement | null;
    if (ideoDivInTooltip && isActiveIdeogramTarget(instance, ideoDivInTooltip)) {
      ideoDivInTooltip.innerHTML = '<small>Ideogram not installed or failed to load.</small>';
    }
    logTooltipTiming(instance, timingConfig, 'ideogram render failed');
  }
}
