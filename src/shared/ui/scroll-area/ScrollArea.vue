<script setup lang="ts">
import { useElementVisibility, useEventListener, useMutationObserver, usePreferredReducedMotion, useRafFn, useResizeObserver } from '@vueuse/core';
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui';
import { computed, shallowRef, useTemplateRef, watch } from 'vue';

import { MAX_FRAME_DELTA } from './config/constants';

interface Props {
  /** Whether overflowing content scrolls automatically back and forth. */
  autoScroll?: boolean
  /** Pause at the top before scrolling down, in milliseconds. */
  autoScrollDelay?: number
  /** Auto-scroll speed, in pixels per second. */
  autoScrollSpeed?: number
  /** Pause at the bottom before scrolling back up, in milliseconds. */
  autoScrollPause?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoScroll: false,
  autoScrollDelay: 2000,
  autoScrollSpeed: 12,
  autoScrollPause: 2000,
});

type Phase = 'top' | 'down' | 'bottom' | 'up';

const scrollAreaRoot = useTemplateRef<InstanceType<typeof ScrollAreaRoot>>('scrollAreaRoot');
const content = useTemplateRef<HTMLElement>('content');
const rootElement = computed(() => scrollAreaRoot.value?.$el ?? null);
const viewport = computed(() => scrollAreaRoot.value?.viewport ?? null);

const reducedMotion = usePreferredReducedMotion();
const isVisible = useElementVisibility(rootElement);
const isOverflowing = shallowRef(false);
const isStoppedByUser = shallowRef(false);

let phase: Phase = 'top';
let phaseElapsed = 0;
let scrollPosition = 0;

/**
 * Switches the auto-scroll phase and resets its timer.
 *
 * @param nextPhase new phase.
 */
function setPhase(nextPhase: Phase) {
  phase = nextPhase;
  phaseElapsed = 0;
}

/**
 * Shifts the scroll position within the content bounds.
 *
 * @param viewportElement scrollable element.
 * @param offset shift in pixels; negative scrolls up.
 * @param maxScrollTop maximum scroll position.
 */
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

/** Checks whether the content overflows the area height. */
function measureOverflow() {
  const viewportElement = viewport.value;
  if (!viewportElement) return;

  isOverflowing.value = viewportElement.scrollHeight > viewportElement.clientHeight;
}

useResizeObserver([viewport, content], measureOverflow);

const isAutoScrollAllowed = computed(() => props.autoScroll && reducedMotion.value !== 'reduce' && isOverflowing.value);
const isAutoScrollActive = computed(() => isAutoScrollAllowed.value && isVisible.value && !isStoppedByUser.value);

/** Resets auto-scroll and the area to the top. */
function reset() {
  setPhase('top');
  scrollPosition = 0;

  if (viewport.value) {
    viewport.value.scrollTop = 0;
  }
}

watch(isAutoScrollActive, (isActive) => {
  if (!isActive) {
    pause();
    return;
  }

  resume();
}, { immediate: true });

watch(isAutoScrollAllowed, (isAllowed) => {
  if (isAllowed) return;
  reset();
});

/** Stops auto-scroll as soon as the user interacts with the area. */
function stopByUser() {
  isStoppedByUser.value = true;
}

useEventListener(rootElement, ['wheel', 'touchstart', 'pointerdown'], stopByUser, { passive: true });

/** Restarts scrolling when the content changes, even if the user stopped auto-scroll. */
function restart() {
  isStoppedByUser.value = false;
  reset();
}

useMutationObserver(content, restart, { subtree: true, childList: true, characterData: true });
</script>

<template>
  <ScrollAreaRoot
    ref="scrollAreaRoot"
    :class="$style.root"
    type="auto"
  >
    <ScrollAreaViewport :class="$style.viewport">
      <div ref="content">
        <slot />
      </div>
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
