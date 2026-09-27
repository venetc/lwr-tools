<script setup lang="ts">
import { Label } from 'reka-ui';

interface Props {
  for: string
}

const props = defineProps<Props>();
</script>

<template>
  <Label :for="props.for">
    <slot />
  </Label>
</template>
