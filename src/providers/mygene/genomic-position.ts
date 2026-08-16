import type { GenomicPosition } from './types.js';

const PRIMARY_CHROMOSOME_PATTERN = /^(?:[1-9]\d*|X|Y|W|Z|MT|[IVX]+|[2-4][LR]|CP|AP)$/i;

export function normalizeChromosomeName(chromosome: unknown): string | undefined {
  if (chromosome == null) return undefined;

  let normalized = String(chromosome).trim();
  if (normalized.toLowerCase().startsWith('chr')) {
    normalized = normalized.substring(3);
  }

  return normalized || undefined;
}

export function isPrimaryChromosome(chromosome: unknown): boolean {
  const normalized = normalizeChromosomeName(chromosome);
  return normalized != null && PRIMARY_CHROMOSOME_PATTERN.test(normalized);
}

export function selectPrimaryGenomicPosition(
  genomicPosition: GenomicPosition | GenomicPosition[] | undefined
): GenomicPosition | undefined {
  if (!genomicPosition) return undefined;

  const positions = Array.isArray(genomicPosition) ? genomicPosition : [genomicPosition];
  return positions.find(position => isPrimaryChromosome(position.chr));
}
