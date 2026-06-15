import type { Instance } from 'tippy.js';
import type { IdeogramConfig } from '../config.js';
import type { MyGeneInfoResult } from '../types.js';
import { speciesMap } from '../species.js';
import tippy from 'tippy.js';
import type { CoreTooltipConfig } from '../../../core/config.js';
import { logTooltipTiming } from '../../../core/timing.js';

let ideogramModulePromise: Promise<any> | null = null;

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
  instance: Instance, 
  data: MyGeneInfoResult, 
  ideogramConfig: Partial<IdeogramConfig>,
  uniqueId: string,
  timingConfig: CoreTooltipConfig
) {
  logTooltipTiming(instance, timingConfig, 'ideogram render start');
  const ideogramContainerSelector = `#gene-tooltip-ideo-${uniqueId}`;
  const ideoDiv = instance.popper.querySelector(ideogramContainerSelector) as HTMLElement;

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
    
    if (!Ideogram) {
      const ideoDivInPopper = instance.popper.querySelector(`.gene-tooltip-ideo`) as HTMLElement;
      if (ideoDivInPopper) ideoDivInPopper.innerHTML = '<small>Ideogram unavailable</small>';
      logTooltipTiming(instance, timingConfig, 'ideogram unavailable');
      return;
    }

    const genomicPos = Array.isArray(data.genomic_pos) ? data.genomic_pos[0] : data.genomic_pos!;
    if (!genomicPos) {
      ideoDiv.innerHTML = '<small>No genomic position</small>';
      logTooltipTiming(instance, timingConfig, 'ideogram skipped', { reason: 'no-genomic-position' });
      return;
    }

    let chromosome = String(genomicPos.chr);
    if (chromosome.toLowerCase().startsWith('chr')) {
      chromosome = chromosome.substring(3);
    }

    const organism = speciesMap[data.taxid]?.ideogramName;
    if (!organism) {
        ideoDiv.innerHTML = '<small>Ideogram not available for this species.</small>';
        logTooltipTiming(instance, timingConfig, 'ideogram skipped', { reason: 'unsupported-organism' });
        return;
    }

    // Get the theme from the main instance
    const parentInstance = instance;
    let hasAttachedTippy = false;

    // Also get the current text color
    const computedStyle = window.getComputedStyle(instance.popper);
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
      onDrawAnnots: function() {
        logTooltipTiming(parentInstance, timingConfig, 'ideogram onDrawAnnots');
        // If we've already run successfully, don't do anything on subsequent calls.
        if (hasAttachedTippy) {
          return;
        }

        setTimeout(() => {
          if (hasAttachedTippy) return;

          const containerElement = instance.popper.querySelector(ideogramContainerSelector);
          if (!containerElement) return;

          const annotElements = containerElement.querySelectorAll('.annot');

          // We only proceed and set the flag if we actually find the elements.
          if (annotElements.length > 0) {
            // This is our "one-shot" trigger.
            hasAttachedTippy = true;

            tippy(annotElements, {
              content: `<b>${data.symbol}</b><br>chr${chromosome}:${genomicPos.start.toLocaleString()}-${genomicPos.end.toLocaleString()}`,
              allowHTML: true,
              placement: 'top',
              appendTo: instance.popper,
              animation: 'scale-subtle',
              zIndex: 99999,
              onShow(nestedInstance){
                const currentParentTheme = (parentInstance.props as any).theme || 'auto';
                nestedInstance.setProps({ theme: currentParentTheme });
              }
            });
            logTooltipTiming(parentInstance, timingConfig, 'ideogram annot tippy attached', {
              count: annotElements.length,
            });
          }
        }, 0);
      },
    };
    // Before drawing, clear the container of the spinner.
    // This gives the Ideogram library a clean slate.
    ideoDiv.innerHTML = '';
    logTooltipTiming(instance, timingConfig, 'ideogram container cleared');

    new Ideogram(configForIdeogram);
    logTooltipTiming(instance, timingConfig, 'ideogram constructor called');

  } catch (error) {
    console.error('[GeneTooltip] Ideogram failed to render:', error);
    const ideoDivInPopper = instance.popper.querySelector(`.gene-tooltip-ideo`) as HTMLElement;
    if (ideoDivInPopper) {
      ideoDivInPopper.innerHTML = '<small>Ideogram not installed or failed to load.</small>';
    }
    logTooltipTiming(instance, timingConfig, 'ideogram render failed');
  }
}
