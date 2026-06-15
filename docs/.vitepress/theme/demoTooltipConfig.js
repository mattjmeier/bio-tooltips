const DEBUG_STORAGE_KEY = 'bio-tooltips:docs-debug-timings';
const VISUAL_PRELOAD_STORAGE_KEY = 'bio-tooltips:docs-visual-preload';
const VISUAL_PRELOAD_VALUES = new Set(['none', 'hover', 'init']);

function readSearchParam(name) {
  if (typeof window === 'undefined') return null;

  return new URLSearchParams(window.location.search).get(name);
}

function readStoredValue(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStoredValue(key, value) {
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Ignore storage failures in private browsing or locked-down docs contexts.
  }
}

function resolveDocsDebugTimings() {
  const param = readSearchParam('btDebug');
  if (param === '1' || param === 'true') {
    writeStoredValue(DEBUG_STORAGE_KEY, 'true');
    return true;
  }

  if (param === '0' || param === 'false') {
    writeStoredValue(DEBUG_STORAGE_KEY, null);
    return false;
  }

  return readStoredValue(DEBUG_STORAGE_KEY) === 'true';
}

function resolveDocsVisualPreload() {
  const param = readSearchParam('btVisualPreload');
  if (VISUAL_PRELOAD_VALUES.has(param)) {
    writeStoredValue(VISUAL_PRELOAD_STORAGE_KEY, param);
    return param;
  }

  if (param === 'reset' || param === 'default') {
    writeStoredValue(VISUAL_PRELOAD_STORAGE_KEY, null);
    return undefined;
  }

  const stored = readStoredValue(VISUAL_PRELOAD_STORAGE_KEY);
  return VISUAL_PRELOAD_VALUES.has(stored) ? stored : undefined;
}

export function withDocsTooltipConfig(config = {}) {
  const debugTimings = resolveDocsDebugTimings();
  const visualPreload = resolveDocsVisualPreload();
  const docsConfig = {};

  if (debugTimings) {
    docsConfig.debugTimings = true;
  }

  if (visualPreload) {
    docsConfig.visualPreload = visualPreload;
  }

  if (debugTimings && typeof window !== 'undefined' && !window.__bioTooltipsDocsDebugNotice) {
    window.__bioTooltipsDocsDebugNotice = true;
    console.info(
      '[BioTooltips docs] Timing debug is enabled. Use ?btDebug=0 to disable. ' +
      'Use ?btVisualPreload=init|hover|none to test visual warmup modes.'
    );
  }

  const finalConfig = {
    ...config,
    ...docsConfig,
  };

  if (debugTimings) {
    console.info('[BioTooltips docs] Tooltip config', {
      selector: finalConfig.selector,
      debugTimings: finalConfig.debugTimings,
      visualPreload: finalConfig.visualPreload,
    });
  }

  return finalConfig;
}
