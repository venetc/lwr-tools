<script setup lang="ts">
import { TriangleAlert } from '@lucide/vue';
</script>

<template>
  <span :class="$style.note">
    <TriangleAlert :class="$style.icon" aria-hidden="true" />
    <slot />
  </span>
</template>

<style lang="scss" module src="./OutdatedNote.scss" />
