<script setup lang="ts">
import { computed, useCssModule } from 'vue';

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
type IconVariant = keyof TalentIcon;

const props = withDefaults(defineProps<Props>(), {
  selected: false,
});

const style = useCssModule();

const ICON_VARIANT: Record<Appearance, IconVariant> = {
  selected: 'original',
  available: 'available',
  disabled: 'disabled',
};

/**
 * All variants are rendered at once so switching the state never waits for a network request.
 */
const ICON_VARIANTS: IconVariant[] = ['original', 'available', 'disabled'];

const appearance = computed((): Appearance => {
  if (props.rankState === 'available') return 'available';
  if (props.rankState === 'completed' && props.selected) return 'selected';
  return 'disabled';
});

const activeVariant = computed(() => ICON_VARIANT[appearance.value]);

/**
 * Checks whether the variant matches the current appearance.
 *
 * @param variant - Icon variant.
 */
function isActive(variant: IconVariant) {
  return variant === activeVariant.value;
}

/**
 * Class list for the variant image: only the active one is visible.
 *
 * @param variant - Icon variant.
 */
function getImageClass(variant: IconVariant) {
  return [style.image, isActive(variant) ? style.shown : style.concealed];
}

/**
 * Alt text only for the visible variant, hidden ones are decorative.
 *
 * @param variant - Icon variant.
 */
function getImageAlt(variant: IconVariant) {
  return isActive(variant) ? props.name : '';
}
</script>

<template>
  <span :class="$style.cell">
    <img
      v-for="variant in ICON_VARIANTS"
      :key="variant"
      :class="getImageClass(variant)"
      :src="icon[variant]"
      :alt="getImageAlt(variant)"
      draggable="false"
    >
  </span>
</template>

<style lang="scss" module>
.cell {
  display: grid;
  width: 100%;
  height: 100%;
}

.image {
  display: block;
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
}

.shown {
  visibility: visible;
}

.concealed {
  visibility: hidden;
}
</style>
