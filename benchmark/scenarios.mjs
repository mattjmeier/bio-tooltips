export const supportedPageSizes = [10, 100, 1000];
export const loadingModes = ['lazy', 'eager'];
export const loadingLabel = mode => ({ lazy: 'Lazy GeneRIFs', eager: 'Eager GeneRIFs', lightweight: 'Lightweight' })[mode] ?? mode;

export function loadingConfig(mode) {
  if (![...loadingModes, 'lightweight'].includes(mode)) throw new Error(`Unknown section loading mode: ${mode}`);
  return {
    sectionLoading: mode === 'eager' ? 'eager' : 'lazy',
    display: { ideogram: false, geneTrack: false, pathways: false, domains: false,
      transcripts: false, structures: false, linksSection: false,
      generifs: mode === 'lightweight' ? false : 'collapsed' },
  };
}

export function scenarioKey(row, version = 3) {
  return `${row.annotatedElements}:${row.strategy}:${row.loadingMode ?? (version === 2 ? 'lightweight' : 'missing')}`;
}
