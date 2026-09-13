<script setup lang="ts">
</script>

<template>
  <div :class="$style.test_class">
    <div>about</div>
  </div>
</template>

<style lang="scss" module>
@use 'sass:color';

.test_class {
  background-color: color.scale(rgba(red, 0.3), $alpha: -30%);
}
</style>
