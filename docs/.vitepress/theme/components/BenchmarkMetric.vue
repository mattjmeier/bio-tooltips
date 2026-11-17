<script setup>
import { computed } from 'vue';
import { formatMetric } from '../../../../benchmark/presentation.mjs';
const props = defineProps({ value: Object, unit: { type: String, default: 'ms' } });
const metric = computed(() => formatMetric(props.value, props.unit));
</script>

<template>
  <span v-if="metric" class="benchmark-metric">
    <strong>{{ metric.median }}</strong>
    <span class="range"><span class="visually-hidden">IQR: </span>{{ metric.range }}</span>
  </span>
  <span v-else aria-label="Not applicable">—</span>
</template>

<style scoped>
.benchmark-metric { display: inline-flex; flex-direction: column; gap: 2px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.benchmark-metric strong { font-weight: 600; }
.range { font-size: 0.8rem; color: var(--vp-c-text-2); }
.visually-hidden { position: absolute; top: 0; left: 0; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
