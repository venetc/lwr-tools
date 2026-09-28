<script setup lang="ts">
import { computed } from 'vue';

import type { TalentIcon, TalentRankState } from './model/types';

interface Props {
  /** Talent icon variants. */
  icon: TalentIcon
  /** Talent name. */
  name: string
  /** State of the rank the talent belongs to. */
  rankState: TalentRankState
  /** Whether the talent is selected in the build. */
  selected?: boolean
}

type Appearance = 'selected' | 'available' | 'disabled';

const props = withDefaults(defineProps<Props>(), {
  selected: false,
});

const ICON_VARIANT: Record<Appearance, keyof TalentIcon> = {
  selected: 'original',
  available: 'available',
  disabled: 'disabled',
};

const appearance = computed((): Appearance => {
  if (props.rankState === 'available') return 'available';
  if (props.rankState === 'completed' && props.selected) return 'selected';
  return 'disabled';
});

const iconSrc = computed(() => props.icon[ICON_VARIANT[appearance.value]]);
</script>

<template>
  <img
    :class="$style.image"
    :src="iconSrc"
    :alt="name"
    draggable="false"
  >
</template>

<style lang="scss" module>
.image {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
