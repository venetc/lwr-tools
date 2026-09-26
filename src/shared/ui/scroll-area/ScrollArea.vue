<script setup lang="ts">
import { useEventListener, usePreferredReducedMotion, useRafFn } from '@vueuse/core';
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui';
import { computed, useTemplateRef, watch } from 'vue';

interface Props {
  autoScroll?: boolean
  autoScrollDelay?: number
  autoScrollSpeed?: number
  autoScrollPause?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoScroll: false,
  autoScrollDelay: 2000,
  autoScrollSpeed: 12,
  autoScrollPause: 2000,
});

type Phase = 'top' | 'down' | 'bottom' | 'up';

const MAX_FRAME_DELTA = 100;

const scrollAreaRoot = useTemplateRef<InstanceType<typeof ScrollAreaRoot>>('scrollAreaRoot');
const viewport = computed(() => scrollAreaRoot.value?.viewport ?? null);
const reducedMotion = usePreferredReducedMotion();

let phase: Phase = 'top';
let phaseElapsed = 0;
let scrollPosition = 0;

function setPhase(nextPhase: Phase) {
  phase = nextPhase;
  phaseElapsed = 0;
}

function scrollBy(viewportElement: HTMLElement, offset: number, maxScrollTop: number) {
  scrollPosition = Math.min(maxScrollTop, Math.max(0, scrollPosition + offset));
  viewportElement.scrollTop = scrollPosition;
}

const { pause, resume } = useRafFn(({ delta }) => {
  const viewportElement = viewport.value;
  if (!viewportElement) return;

  const maxScrollTop = viewportElement.scrollHeight - viewportElement.clientHeight;
  if (maxScrollTop <= 0) return;

  const frameDelta = Math.min(delta, MAX_FRAME_DELTA);
  phaseElapsed += frameDelta;

  switch (phase) {
    case 'top': {
      if (phaseElapsed >= props.autoScrollDelay) setPhase('down');
      break;
    }
    case 'down': {
      scrollBy(viewportElement, props.autoScrollSpeed * frameDelta / 1000, maxScrollTop);
      if (scrollPosition >= maxScrollTop) setPhase('bottom');
      break;
    }
    case 'bottom': {
      if (phaseElapsed >= props.autoScrollPause) setPhase('up');
      break;
    }
    case 'up': {
      scrollBy(viewportElement, -props.autoScrollSpeed * frameDelta / 1000, maxScrollTop);
      if (scrollPosition <= 0) setPhase('top');
      break;
    }
  }
}, { immediate: false });

const isAutoScrollEnabled = computed(() => props.autoScroll && reducedMotion.value !== 'reduce');

function reset() {
  pause();
  setPhase('top');
  scrollPosition = 0;

  if (viewport.value) {
    viewport.value.scrollTop = 0;
  }
}

watch(isAutoScrollEnabled, (isEnabled) => {
  if (isEnabled) return resume();
  reset();
}, { immediate: true });

const rootElement = computed(() => scrollAreaRoot.value?.$el ?? null);

useEventListener(rootElement, ['wheel', 'touchstart', 'pointerdown'], pause, { passive: true });
</script>

<template>
  <ScrollAreaRoot
    ref="scrollAreaRoot"
    :class="$style.root"
    type="auto"
  >
    <ScrollAreaViewport :class="$style.viewport">
      <slot />
    </ScrollAreaViewport>

    <ScrollAreaScrollbar :class="$style.scrollbar" orientation="vertical">
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
  width: $scrollbar-width;
  padding: 1px;
  touch-action: none;
  user-select: none;
}

.thumb {
  position: relative;
  flex: 1;
  border-radius: $scrollbar-width;
  background: colors.$accent-dim;
}
</style>
