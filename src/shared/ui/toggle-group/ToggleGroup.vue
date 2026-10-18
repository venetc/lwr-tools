<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui';
import { ToggleGroupRoot } from 'reka-ui';

interface Props {
  /** Whether arrow keys move focus between options. */
  rovingFocus?: boolean
}

withDefaults(defineProps<Props>(), {
  rovingFocus: true,
});

/** Selected option value; empty when nothing is selected. */
const model = defineModel<AcceptableValue>();
</script>

<template>
  <ToggleGroupRoot
    v-model="model"
    type="single"
    :roving-focus="rovingFocus"
  >
    <slot />
  </ToggleGroupRoot>
</template>
