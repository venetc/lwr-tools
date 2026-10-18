<script setup lang="ts">
/** Input value. */
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

<style lang="scss" module src="./Input.scss" />
