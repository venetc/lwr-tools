<script setup lang="ts">
import type { SoldierClass } from '../model/types';

interface Props {
  soldierClass: SoldierClass
}

defineProps<Props>();
</script>

<template>
  <div :class="$style.heading">
    <component
      :is="soldierClass.icon"
      :class="$style.icon"
      aria-hidden="true"
    />
    <h2 :class="$style.title">
      {{ soldierClass.name }}
    </h2>
  </div>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';

$badge: 38px;

.heading {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: $badge;
}

.icon {
  flex: none;
  width: $badge;
  height: $badge;
  color: colors.$accent;
}

.title {
  @include typography.caps-1;
  color: colors.$text-primary;
  text-box: trim-both cap alphabetic;
}
</style>
