<template>
  <span class="chemical-demo-container">
    <span ref="tooltipElement" class="chemical-tooltip" :data-query="query" :data-scope="scope">
      {{ label || query }}
    </span>
  </span>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import 'bio-tooltips/style.css';
import { ChemicalTooltip } from 'bio-tooltips/mychem';

const props = defineProps({
  query: { type: String, required: true },
  label: { type: String, default: '' },
  scope: { type: String, default: 'name' },
  config: { type: Object, default: () => ({}) },
});

const tooltipElement = ref(null);
let cleanupTooltip = null;

const generateUniqueId = () => `chemical-tooltip-${Math.random().toString(36).substring(2, 9)}`;

onMounted(() => {
  if (ChemicalTooltip && ChemicalTooltip.init && tooltipElement.value) {
    const uniqueId = generateUniqueId();
    tooltipElement.value.id = uniqueId;

    cleanupTooltip = ChemicalTooltip.init({
      selector: `#${uniqueId}`,
      ...props.config,
    });
  }
});

onUnmounted(() => {
  if (cleanupTooltip) {
    cleanupTooltip();
    cleanupTooltip = null;
  }
});
</script>
