<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { useHold } from './lib/hold';

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
  duration: 450,
  disabled: false,
});

const emit = defineEmits<Emits>();

const button = useTemplateRef<HTMLButtonElement>('button');

const { state, progressStyle, startHold, activateFromKeyboard } = useHold(button, {
  duration: () => props.duration,
  disabled: () => props.disabled,
  onHold: () => emit('hold'),
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

<style lang="scss" module src="./HoldButton.scss" />
