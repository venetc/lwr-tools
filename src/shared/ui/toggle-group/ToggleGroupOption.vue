<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui';
import { ToggleGroupItem } from 'reka-ui';

interface Props {
  /** Option value set to the group when selected. */
  value: AcceptableValue
}

defineProps<Props>();
</script>

<template>
  <ToggleGroupItem :value="value">
    <slot />
  </ToggleGroupItem>
</template>
