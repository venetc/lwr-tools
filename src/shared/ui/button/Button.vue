<script setup lang="ts">
import { useCssModule } from 'vue';

import type { ButtonVariant } from './model/button';
import { useButtonClass } from './model/button';

interface Props {
  /** Visual variant. */
  variant?: ButtonVariant
  /** Native button type. */
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  type: 'button',
});

const buttonClass = useButtonClass(() => props.variant, useCssModule());
</script>

<template>
  <button :class="buttonClass" :type="type">
    <slot />
  </button>
</template>

<style lang="scss" module src="./Button.scss" />
