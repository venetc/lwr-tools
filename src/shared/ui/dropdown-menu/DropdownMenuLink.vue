<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui';
import type { RouteLocationRaw } from 'vue-router';

interface Props {
  /** Link target. */
  to: RouteLocationRaw
  /** Whether the link leads to the current page; such an item is marked and not selectable. */
  current?: boolean
}

withDefaults(defineProps<Props>(), {
  current: false,
});
</script>

<template>
  <DropdownMenuItem
    v-if="current"
    :class="$style.current"
    disabled
    aria-current="page"
  >
    <slot />
  </DropdownMenuItem>
  <DropdownMenuItem
    v-else
    as-child
    :class="$style.link"
  >
    <RouterLink :to="to">
      <slot />
    </RouterLink>
  </DropdownMenuItem>
</template>

<style lang="scss" module src="./DropdownMenuLink.scss" />
