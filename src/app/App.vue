<script setup lang="ts">
import { ConfigProvider } from 'reka-ui';

import { ToastHost } from '@shared/ui/toast';

import SiteFooter from './layout/SiteFooter.vue';
import SiteHeader from './layout/SiteHeader.vue';
</script>

<template>
  <ConfigProvider :scroll-body="false">
    <div :class="$style.layout">
      <SiteHeader />
      <div :class="$style.content">
        <RouterView />
      </div>
      <SiteFooter />
      <ToastHost />
    </div>
  </ConfigProvider>
</template>

<style lang="scss" module>
.layout {
  display: flex;
  flex-direction: column;
  min-block-size: 100vh;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
