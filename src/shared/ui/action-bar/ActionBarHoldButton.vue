<script setup lang="ts">
import { HoldButton } from '@shared/ui/hold-button';

interface Props {
  /** Visible label under the icon. */
  label: string
}

interface Emits {
  /** Fires once the button is held for the full duration or activated from the keyboard. */
  hold: []
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();
</script>

<template>
  <HoldButton :class="$style.action" @hold="emit('hold')">
    <slot />
    <span :class="$style.label">{{ props.label }}</span>
  </HoldButton>
</template>

<style lang="scss" module src="./ActionBarHoldButton.scss" />
