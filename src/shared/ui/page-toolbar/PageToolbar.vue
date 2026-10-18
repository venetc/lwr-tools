<script setup lang="ts">
import type { VNode } from 'vue';

defineSlots<{
  actions?: () => VNode[]
  default?: () => VNode[]
}>();
</script>

<template>
  <div :class="$style.toolbar">
    <div :class="$style.actions">
      <slot name="actions" />
    </div>

    <div :class="$style.content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" module src="./PageToolbar.scss" />
