<script setup lang="ts">
import { computed, useCssModule } from 'vue';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

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

const style = useCssModule();

const buttonClass = computed(() => [style.button, style[props.variant]]);
</script>

<template>
  <button :class="buttonClass" :type="type">
    <slot />
  </button>
</template>

<style lang="scss" module src="./Button.scss" />
