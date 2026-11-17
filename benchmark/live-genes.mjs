// Fixed human gene symbol set. The first five identifiers are measured
// individually; subsequent entries supply the larger prefetch workload.
export const liveGeneSymbols = Object.freeze([
  'TP53', 'BRCA1', 'EGFR', 'MYC', 'MAPK1', 'BRCA2', 'APOE', 'APC',
  'KRAS', 'NRAS', 'HRAS', 'BRAF', 'PTEN', 'AKT1', 'MTOR', 'PIK3CA',
  'RB1', 'CDKN2A', 'CDK2', 'CDK4', 'CDK6', 'CCND1', 'CCNE1', 'ERBB2',
  'ERBB3', 'ERBB4', 'ESR1', 'AR', 'VDR', 'STAT3', 'STAT1', 'JAK1',
  'JAK2', 'IL6', 'TNF', 'IL1B', 'IL10', 'IFNG', 'VEGFA', 'HIF1A',
  'NFKB1', 'RELA', 'FOS', 'JUN', 'MAPK3', 'MAPK8', 'MAPK14', 'RAF1',
  'MAP2K1', 'MAP2K2', 'SRC', 'ABL1', 'KIT', 'PDGFRA', 'PDGFRB', 'FGFR1',
  'FGFR2', 'FGFR3', 'MET', 'RET', 'ALK', 'ROS1', 'NTRK1', 'NTRK2',
  'NTRK3', 'BCL2', 'BAX', 'CASP3', 'CASP8', 'CASP9', 'MDM2', 'ATM',
  'ATR', 'CHEK1', 'CHEK2', 'PALB2', 'RAD51', 'MLH1', 'MSH2', 'MSH6',
]);

export function identifiersForPage(elements, live = false) {
  const count = Math.ceil(elements * 0.8);
  if (live && count > liveGeneSymbols.length) {
    throw new Error(`Live benchmark supports at most ${liveGeneSymbols.length} distinct identifiers (10/100-element scenarios).`);
  }
  const identifiers = live ? liveGeneSymbols.slice(0, count)
    : Array.from({ length: count }, (_, index) => `BTG${String(index).padStart(4, '0')}`);
  return Array.from({ length: elements }, (_, index) => {
    const identifierIndex = index < 5 ? index : index === 5 ? 0 : index < count + 1 ? index - 1 : index - count;
    return identifiers[identifierIndex];
  });
}
