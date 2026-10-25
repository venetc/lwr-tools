<script setup lang="ts">
import { useCssModule } from 'vue';

import { ICON_VARIANTS } from './config/constants';
import { useCellVariants } from './model/cell-variants';
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

const { getImageClass, getImageAlt } = useCellVariants({
  appearance: () => props.appearance,
  name: () => props.name,
  style: useCssModule(),
});
</script>

<template>
  <span :class="$style.cell">
    <img
      v-for="variant in ICON_VARIANTS"
      :key="variant"
      :class="getImageClass(variant)"
      :src="icon[variant]"
      :alt="getImageAlt(variant)"
      loading="lazy"
      draggable="false"
    >
  </span>
</template>

<style lang="scss" module src="./TieredPickerCell.scss" />
