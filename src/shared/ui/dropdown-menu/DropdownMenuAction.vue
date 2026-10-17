<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui';

interface Emits {
  /** Reports the choice of the item. */
  select: []
}

const emit = defineEmits<Emits>();

/**
 * Reports the choice of the item.
 */
const select = () => emit('select');
</script>

<template>
  <DropdownMenuItem :class="$style.action" @select="select">
    <slot />
  </DropdownMenuItem>
</template>

<style lang="scss" module>
@use './item';

.action {
  @include item.base;
  @include item.selectable;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
}
</style>
