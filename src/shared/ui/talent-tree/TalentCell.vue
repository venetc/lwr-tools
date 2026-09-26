<script setup lang="ts">
import type { TalentRankState } from './model/types';

import { computed, useCssModule } from 'vue';

interface Props {
  icon: string
  name: string
  rankState: TalentRankState
  selected?: boolean
}

type Appearance = 'selected' | 'available' | 'inactive';

const props = withDefaults(defineProps<Props>(), {
  selected: false,
});

const style = useCssModule();

const appearance = computed((): Appearance => {
  if (props.rankState === 'available') return 'available';
  if (props.rankState === 'completed' && props.selected) return 'selected';
  return 'inactive';
});

const cellClass = computed(() => [style.cell, style[appearance.value]]);

const tintStyle = computed(() => ({ maskImage: `url('${props.icon}')` }));
</script>

<template>
  <span :class="cellClass">
    <img
      :class="$style.image"
      :src="icon"
      :alt="name"
      draggable="false"
    >
    <span
      :class="$style.tint"
      :style="tintStyle"
      aria-hidden="true"
    />
  </span>
</template>

<style lang="scss" module>
@use 'styles/colors';

.cell {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}

.image {
  display: block;
  width: 100%;
  height: 100%;
}

.tint {
  position: absolute;
  inset: 0;
  mask-mode: luminance;
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
}

.selected .tint {
  display: none;
}

.available {
  .image {
    opacity: 0;
  }

  .tint {
    display: block;
    background: colors.$highlight;
  }
}

.inactive {
  .image {
    opacity: 0;
  }

  .tint {
    display: block;
    background: colors.$accent-dim;
  }
}
</style>
