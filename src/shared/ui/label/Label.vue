<script setup lang="ts">
import { Label } from 'reka-ui';

interface Props {
  /** Id of the labelled control. */
  for: string
}

const props = defineProps<Props>();
</script>

<template>
  <Label :for="props.for">
    <slot />
  </Label>
</template>
