<script setup lang="ts">
import { onLongPress } from '@vueuse/core';
import { computed, ref, useTemplateRef } from 'vue';

export type HoldButtonState = 'idle' | 'holding';

interface Props {
  /** Time in milliseconds the button has to be held to fire. */
  duration?: number
  /** Whether the button is disabled. */
  disabled?: boolean
}

interface Emits {
  /** Fires once the button is held for the full duration or activated from the keyboard. */
  hold: []
}

const props = withDefaults(defineProps<Props>(), {
  duration: 800,
  disabled: false,
});

const emit = defineEmits<Emits>();

const button = useTemplateRef<HTMLButtonElement>('button');

const isHolding = ref(false);

/** Hold state, exposed as `data-state` for styling. */
const state = computed<HoldButtonState>(() => isHolding.value ? 'holding' : 'idle');

const progressStyle = computed(() => ({ '--hold-duration': `${props.duration}ms` }));

/**
 * Starts the progress animation when the pointer presses the button.
 */
const startHold = () => {
  if (props.disabled) return;

  isHolding.value = true;
};

/**
 * Resets the progress when the pointer is released or leaves the button.
 */
const stopHold = () => {
  isHolding.value = false;
};

/**
 * Fires the action once the hold lasted the full duration.
 */
const completeHold = () => {
  isHolding.value = false;

  if (props.disabled) return;

  emit('hold');
};

/**
 * Fires the action on keyboard activation, which has no pointer to hold.
 *
 * @param event click event; `detail` is 0 for keyboard activation.
 */
const activateFromKeyboard = (event: MouseEvent) => {
  if (event.detail !== 0) return;

  emit('hold');
};

onLongPress(button, completeHold, {
  delay: () => props.duration,
  distanceThreshold: false,
  onMouseUp: stopHold,
});
</script>

<template>
  <button
    ref="button"
    :class="$style.button"
    type="button"
    :disabled="props.disabled"
    :data-state="state"
    :style="progressStyle"
    @pointerdown="startHold"
    @click="activateFromKeyboard"
    @contextmenu.prevent
  >
    <slot />
    <svg
      :class="$style.progress"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="11"
        pathLength="1"
      />
    </svg>
  </button>
</template>

<style lang="scss" module>
.button {
  position: relative;
  -webkit-touch-callout: none;
  user-select: none;
}

.progress {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  rotate: -90deg;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-dasharray: 1;
  pointer-events: none;

  .button[data-state='idle'] & {
    stroke-dashoffset: 1;
  }

  .button[data-state='holding'] & {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset var(--hold-duration) linear;
  }
}
</style>
