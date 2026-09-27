<script setup lang="ts">
const model = defineModel<string>({ required: true });
</script>

<template>
  <input
    v-model="model"
    :class="$style.input"
    type="text"
    spellcheck="false"
    autocomplete="off"
  >
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';

.input {
  @include typography.body-1;
  inline-size: 100%;
  padding: 8px 10px;
  background: colors.$surface-1;
  border-width: 1px;
  border-radius: 3px;
  color: colors.$text-primary;
  field-sizing: fixed;

  &::placeholder {
    color: colors.$text-disabled;
  }

  &:not([aria-invalid='true']) {
    border-color: colors.$border;
  }

  &[aria-invalid='true'] {
    border-color: colors.$danger;
  }

  &:focus-visible {
    outline-offset: 0;
  }
}
</style>
