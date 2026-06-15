<template>
  <span class="gene-demo-container">
    <span :class="`gene-tooltip ${uniqueClass}`" :data-species="species">
      {{ genes }}
    </span>
  </span>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import 'bio-tooltips/style.css';
import { GeneTooltip } from 'bio-tooltips/mygene';

const props = defineProps({
  genes: { type: String, required: true },
  species: { type: String, default: 'human' },
  config: { type: Object, default: () => ({}) },
  uniqueClass: { type: String, default: () => `gt-rand-${Math.random().toString(36).substring(2, 9)}` }
});

let cleanupTooltip = null;

onMounted(() => {
  if (GeneTooltip && GeneTooltip.init) {
    const selector = `.gene-tooltip.${props.uniqueClass}`;
    
    const finalConfig = {
      selector: selector,
      // Default config for the demo
      ideogram: { enabled: true },
      ...props.config // Allow user overrides
    };

    // Initialize and store the cleanup function
    cleanupTooltip = GeneTooltip.init(finalConfig);
  }
});

onUnmounted(() => {
  // Use the cleanup function when the component is removed
  if (cleanupTooltip) {
    cleanupTooltip();
    cleanupTooltip = null; 
  }
});
</script>
