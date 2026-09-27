<script setup lang="ts">
import type { SoldierRank } from '../model/types';

interface Props {
  /** Soldier rank to display. */
  rank: SoldierRank
}

defineProps<Props>();
</script>

<template>
  <span :class="$style.label">
    <component
      :is="rank.icon"
      :class="$style.icon"
      aria-hidden="true"
    />
    <span :class="$style.name">{{ rank.name }}</span>
  </span>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';

.label {
  @include typography.caps-2;
  display: flex;
  align-items: center;
  gap: 8px;
}

.name {
  text-box: trim-both cap alphabetic;
}

.icon {
  flex: none;
  width: 26px;
  height: 26px;
  color: colors.$accent;
}
</style>
