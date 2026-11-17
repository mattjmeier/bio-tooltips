// Fixed reference field set: "reference" means these fields, not fields=all.
export const referenceGeneFields = Object.freeze([
  '_id', 'query', 'symbol', 'name', 'summary', 'taxid', 'genomic_pos',
  'pathway', 'interpro', 'exons', 'ensembl.gene', 'ensembl.protein',
  'ensembl.transcript', 'pdb', 'generif', 'wikipedia.url_stub',
]);
export const fieldVariants = Object.freeze(['reference', 'without-generif']);

export function fieldsForVariant(variant) {
  if (!fieldVariants.includes(variant)) throw new Error(`Unknown field selection variant: ${variant}`);
  return referenceGeneFields.filter(field => variant !== 'without-generif' || field !== 'generif');
}

// Keep queries, species, scopes and every other parameter identical. This is a
// benchmark-only request override, independent of the library's field planner.
export function applyFieldSelection(postData, variant) {
  const params = new URLSearchParams(postData ?? '');
  params.set('fields', fieldsForVariant(variant).join(','));
  return params.toString();
}

export function fieldVariantOrder(trial) {
  return trial % 2 === 0 ? [...fieldVariants] : [...fieldVariants].reverse();
}
