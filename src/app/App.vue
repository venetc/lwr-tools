<script setup lang="ts">
import { ToastHost } from '@shared/ui/toast';
import { SiteFooter } from '@widgets/site-footer';
</script>

<template>
  <div :class="$style.layout">
    <div :class="$style.content">
      <RouterView />
    </div>
    <SiteFooter />
    <ToastHost />
  </div>
</template>

<style lang="scss" module>
.layout {
  display: flex;
  flex-direction: column;
  min-block-size: 100vh;
}

.content {
  flex: 1;
}
</style>
