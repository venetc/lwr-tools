<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui';

interface Emits {
  /** Reports the choice of the item. */
  select: []
}

const emit = defineEmits<Emits>();
</script>

<template>
  <DropdownMenuItem :class="$style.action" @select="emit('select')">
    <slot />
  </DropdownMenuItem>
</template>

<style lang="scss" module src="./DropdownMenuAction.scss" />
