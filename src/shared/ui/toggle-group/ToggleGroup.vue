<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui';
import { ToggleGroupRoot } from 'reka-ui';
import { computed } from 'vue';

interface Props {
  /** Whether arrow keys move focus between options. */
  rovingFocus?: boolean
}

withDefaults(defineProps<Props>(), {
  rovingFocus: true,
});

/** Selected option value, or null when nothing is selected. */
const model = defineModel<AcceptableValue | null>({ default: null });

const rootModel = computed({
  get: () => model.value,
  set: (toggledValue: AcceptableValue | undefined) => {
    model.value = toggledValue ?? null;
  },
});
</script>

<template>
  <ToggleGroupRoot
    v-model="rootModel"
    type="single"
    :roving-focus="rovingFocus"
  >
    <slot />
  </ToggleGroupRoot>
</template>
