<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import type { SoldierRank } from '@entities/soldier';

interface Props {
  /** Soldier rank to display. */
  rank: SoldierRank
  /** Whether the rank icon takes the label color instead of the accent. */
  highlighted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  highlighted: false,
});

const style = useCssModule();

const iconClass = computed(() => [style.icon, props.highlighted ? style.iconHighlighted : style.iconRegular]);
</script>

<template>
  <span :class="$style.label">
    <component
      :is="rank.icon"
      :class="iconClass"
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
}

.iconRegular {
  color: colors.$accent;
}

.iconHighlighted {
  color: currentColor;
}
</style>
