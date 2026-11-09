<script setup lang="ts">
import { X } from '@lucide/vue';
import { DialogClose } from 'reka-ui';
</script>

<template>
  <DialogClose :class="$style.close" aria-label="Close">
    <X :class="$style.icon" aria-hidden="true" />
  </DialogClose>
</template>

<style lang="scss" module src="./DialogCloseButton.scss" />
