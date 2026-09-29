<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import { useHold } from './lib/useHold';

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

const { isHolding, startHold, activateFromKeyboard } = useHold(button, {
  duration: () => props.duration,
  disabled: () => props.disabled,
  onHold: () => emit('hold'),
});

/** Hold state, exposed as `data-state` for styling. */
const state = computed<HoldButtonState>(() => isHolding.value ? 'holding' : 'idle');

const progressStyle = computed(() => ({ '--hold-duration': `${props.duration}ms` }));
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
