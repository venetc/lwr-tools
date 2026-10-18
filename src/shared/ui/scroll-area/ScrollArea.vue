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

<style lang="scss" module src="./ScrollArea.scss" />
