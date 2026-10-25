<script setup lang="ts">
interface Props {
  /** Visible label under the icon. */
  label: string
}

const props = defineProps<Props>();
</script>

<template>
  <button :class="$style.action" type="button">
    <slot />
    <span :class="$style.label">{{ props.label }}</span>
  </button>
</template>

<style lang="scss" module src="./ActionBarButton.scss" />
