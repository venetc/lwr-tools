<script setup lang="ts">
import { useCssModule } from 'vue';

import { ICON_VARIANTS } from './config/constants';
import type { TieredPickerAppearance, TieredPickerIcon } from './model/tiered-picker';

interface Props {
  /** Item icon variants. */
  icon: TieredPickerIcon
  /** Item name. */
  name: string
  /** Look of the cell. */
  appearance: TieredPickerAppearance
}

const props = defineProps<Props>();

const style = useCssModule();

/**
 * Checks whether the variant matches the cell look.
 *
 * @param variant - Icon variant.
 */
function isActive(variant: TieredPickerAppearance) {
  return variant === props.appearance;
}

/**
 * Class list for the variant image: only the active one is visible.
 *
 * @param variant - Icon variant.
 */
function getImageClass(variant: TieredPickerAppearance) {
  return [style.image, isActive(variant) ? style.shown : style.concealed];
}

/**
 * Alt text only for the visible variant, hidden ones are decorative.
 *
 * @param variant - Icon variant.
 */
function getImageAlt(variant: TieredPickerAppearance) {
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
