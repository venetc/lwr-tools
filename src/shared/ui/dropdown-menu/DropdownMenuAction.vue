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

<style lang="scss" module src="./DropdownMenuAction.scss" />
