<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import type { SvgIcon } from '@shared/ui/svg-icon';

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

const style = useCssModule();

const iconClass = computed(() => [style.icon, props.highlighted ? style.iconHighlighted : style.iconRegular]);
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

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';

// Tier list width below which the names get a smaller font to fit beside the items: about a 450px screen.
$compact-max-width: 390px;

.label {
  display: flex;
  align-items: center;
  gap: 8px;

  @container tiers (width >= #{$compact-max-width}) {
    @include typography.caps-2;
  }

  @container tiers (width < #{$compact-max-width}) {
    @include typography.caps-3;
  }
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
