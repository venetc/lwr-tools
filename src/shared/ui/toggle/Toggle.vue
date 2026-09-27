<script setup lang="ts">
import { Toggle } from 'reka-ui';

/** Whether the toggle is pressed. */
const pressed = defineModel<boolean>({ default: false });
</script>

<template>
  <Toggle v-model="pressed">
    <slot />
  </Toggle>
</template>
