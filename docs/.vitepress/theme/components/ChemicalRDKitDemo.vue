<template>
  <span class="chemical-demo-container chemical-rdkit-demo-container">
    <span ref="tooltipElement" class="chemical-tooltip" :data-scope="scope">
      {{ query }}
    </span>
    <span v-if="status === 'loading'" class="chemical-rdkit-demo-status">loading RDKit</span>
    <span v-else-if="status === 'error'" class="chemical-rdkit-demo-status">RDKit unavailable</span>
  </span>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import 'gene-tooltips/style.css';
import { ChemicalTooltip } from 'gene-tooltips/mychem';
import { createRDKitStructureRenderer } from 'gene-tooltips/mychem/rdkit';
import rdkitWasmURL from '@rdkit/rdkit/dist/RDKit_minimal.wasm?url';

const props = defineProps({
  query: { type: String, required: true },
  scope: { type: String, default: 'name' },
  config: { type: Object, default: () => ({}) },
});

const tooltipElement = ref(null);
const status = ref('loading');
let cleanupTooltip = null;
let rendererPromise = null;

const generateUniqueId = () => `chemical-rdkit-tooltip-${Math.random().toString(36).substring(2, 9)}`;

function getStructureRenderer() {
  rendererPromise ??= createRDKitStructureRenderer({
    moduleOptions: {
      locateFile: () => rdkitWasmURL,
    },
  });

  return rendererPromise;
}

onMounted(async () => {
  if (!ChemicalTooltip?.init || !tooltipElement.value) return;

  const uniqueId = generateUniqueId();
  tooltipElement.value.id = uniqueId;

  try {
    const structureRenderer = await getStructureRenderer();
    cleanupTooltip = ChemicalTooltip.init({
      selector: `#${uniqueId}`,
      ...props.config,
      structureRenderer,
    });
    status.value = 'ready';
  } catch {
    cleanupTooltip = ChemicalTooltip.init({
      selector: `#${uniqueId}`,
      ...props.config,
    });
    status.value = 'error';
  }
});

onUnmounted(() => {
  if (cleanupTooltip) {
    cleanupTooltip();
    cleanupTooltip = null;
  }
});
</script>

<style scoped>
.chemical-rdkit-demo-container {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35em;
}

.chemical-rdkit-demo-status {
  color: var(--vp-c-text-2);
  font-size: 0.82em;
}
</style>
