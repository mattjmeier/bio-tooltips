<template>
  <span class="gene-demo-container">
    <span ref="tooltipElement" class="gene-tooltip" :data-species="species">
      {{ genes }}
    </span>
  </span>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import 'bio-tooltips/style.css';
import { GeneTooltip } from 'bio-tooltips/mygene';

const props = defineProps({
  genes: { type: String, required: true },
  species: { type: String, default: 'human' },
  config: { type: Object, default: () => ({}) },
});

// 1. Create a ref to hold the DOM element. It's initialized to null.
const tooltipElement = ref(null);
let cleanupTooltip = null;

// A simple utility to generate a unique enough ID without global state.
// This is called once per component instance, so collisions are virtually impossible.
const generateUniqueId = () => `gene-tooltip-${Math.random().toString(36).substring(2, 9)}`;

onMounted(() => {
  // 2. By the time onMounted runs, Vue has mounted the component,
  //    and `tooltipElement.value` will be the actual <span> DOM node.
  if (GeneTooltip && GeneTooltip.init && tooltipElement.value) {

    // 3. Generate a unique ID for this specific instance.
    const uniqueId = generateUniqueId();
    
    // 4. Assign the ID directly to the element.
    tooltipElement.value.id = uniqueId;

    // 5. Now, initialize the library using the guaranteed-to-be-unique selector.
    const selector = `#${uniqueId}`;
    
    const finalConfig = {
      selector: selector,
      ideogram: { enabled: true },
      ...props.config
    };

    cleanupTooltip = GeneTooltip.init(finalConfig);
  }
});

onUnmounted(() => {
  if (cleanupTooltip) {
    cleanupTooltip();
    cleanupTooltip = null; 
  }
});
</script>
