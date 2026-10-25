<script setup lang="ts">
import { useCssModule } from 'vue';

import { LoadingImage } from '@shared/ui/loading-image';
import type { SvgIcon } from '@shared/ui/svg-icon';

import { useTierLabelClasses } from './model/tier-label';
import type { TieredPickerTierImage } from './model/tiered-picker';

interface Props {
  /** Tier icon; null for a label without one. */
  icon?: SvgIcon | null
  /** Tier image shown in place of an icon, such as a medal; null for a label without one. */
  image?: TieredPickerTierImage | null
  /** Whether the image is faded, such as on a locked tier. */
  faded?: boolean
  /** Tier name. */
  name: string
  /** Whether the icon takes the label color instead of the accent. */
  highlighted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: null,
  image: null,
  faded: false,
  highlighted: false,
});

const { iconClass, imageClass } = useTierLabelClasses({
  highlighted: () => props.highlighted,
  faded: () => props.faded,
  style: useCssModule(),
});
</script>

<template>
  <span :class="$style.label">
    <component
      :is="props.icon"
      v-if="props.icon"
      :class="iconClass"
      aria-hidden="true"
    />
    <LoadingImage
      v-if="props.image"
      :src="props.image.src"
      :placeholder="props.image.placeholder"
      :class="imageClass"
      alt=""
    />
    <span :class="$style.text">
      <span :class="$style.name">{{ props.name }}</span>
    </span>
  </span>
</template>

<style lang="scss" module src="./TieredPickerTierLabel.scss" />
