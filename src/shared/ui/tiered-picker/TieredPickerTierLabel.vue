<script setup lang="ts">
import { useCssModule } from 'vue';

import type { SvgIcon } from '@shared/ui/svg-icon';

import { useTierLabelIconClass } from './model/tier-label';

interface Props {
  /** Tier icon; null for a label of text only. */
  icon?: SvgIcon | null
  /** Tier name. */
  name: string
  /** Whether the icon takes the label color instead of the accent. */
  highlighted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: null,
  highlighted: false,
});

const iconClass = useTierLabelIconClass(() => props.highlighted, useCssModule());
</script>

<template>
  <span :class="$style.label">
    <component
      :is="props.icon"
      v-if="props.icon"
      :class="iconClass"
      aria-hidden="true"
    />
    <span :class="$style.name">{{ props.name }}</span>
  </span>
</template>

<style lang="scss" module src="./TieredPickerTierLabel.scss" />
