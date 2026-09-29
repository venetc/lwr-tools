<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import { ICON_VARIANT, ICON_VARIANTS } from './config/constants';
import type { TieredPickerAppearance, TieredPickerIcon, TieredPickerIconVariant, TieredPickerTierState } from './model/tiered-picker';

interface Props {
  /** Item icon variants. */
  icon: TieredPickerIcon
  /** Item name. */
  name: string
  /** State of the tier the item belongs to. */
  tierState: TieredPickerTierState
  /** Whether the item is selected. */
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
});

const style = useCssModule();

const appearance = computed((): TieredPickerAppearance => {
  if (props.tierState === 'available') return 'available';
  if (props.tierState === 'completed' && props.selected) return 'selected';
  return 'disabled';
});

const activeVariant = computed(() => ICON_VARIANT[appearance.value]);

/**
 * Checks whether the variant matches the current appearance.
 *
 * @param variant - Icon variant.
 */
function isActive(variant: TieredPickerIconVariant) {
  return variant === activeVariant.value;
}

/**
 * Class list for the variant image: only the active one is visible.
 *
 * @param variant - Icon variant.
 */
function getImageClass(variant: TieredPickerIconVariant) {
  return [style.image, isActive(variant) ? style.shown : style.concealed];
}

/**
 * Alt text only for the visible variant, hidden ones are decorative.
 *
 * @param variant - Icon variant.
 */
function getImageAlt(variant: TieredPickerIconVariant) {
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
