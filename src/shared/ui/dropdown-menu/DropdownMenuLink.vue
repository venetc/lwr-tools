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

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';

@mixin -item {
  @include typography.caps-3;
  display: block;
  padding: 11px 10px;
  text-box: trim-both cap alphabetic;
  text-decoration: none;
  user-select: none;
}

.link {
  @include -item;
  cursor: pointer;
  outline: none;

  &:not([data-highlighted]) {
    color: colors.$text-secondary;
  }

  &[data-highlighted] {
    background: colors.$surface-3;
    color: colors.$accent-hover;
  }
}

.current {
  @include -item;
  background: colors.$accent-subtle;
  color: colors.$text-accent;
}
</style>
