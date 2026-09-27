<script setup lang="ts">
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui';

export type ScrollAreaOrientation = 'vertical' | 'horizontal';

interface Props {
  /** Scroll direction. */
  orientation?: ScrollAreaOrientation
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'vertical',
});
</script>

<template>
  <ScrollAreaRoot
    :class="$style.root"
    type="auto"
  >
    <ScrollAreaViewport :class="$style.viewport">
      <slot />
    </ScrollAreaViewport>

    <ScrollAreaScrollbar :class="$style.scrollbar" :orientation="props.orientation">
      <ScrollAreaThumb :class="$style.thumb" />
    </ScrollAreaScrollbar>
  </ScrollAreaRoot>
</template>

<style lang="scss" module>
@use 'styles/colors';

$scrollbar-width: 6px;

.root {
  position: relative;
  overflow: hidden;
}

.viewport {
  width: 100%;
  height: 100%;
}

.scrollbar {
  display: flex;
  padding: 1px;
  touch-action: none;
  user-select: none;

  &[data-orientation='vertical'] {
    width: $scrollbar-width;
  }

  &[data-orientation='horizontal'] {
    flex-direction: column;
    height: $scrollbar-width;
  }
}

.thumb {
  position: relative;
  flex: 1;
  border-radius: $scrollbar-width;
  background: colors.$accent-dim;
}
</style>
