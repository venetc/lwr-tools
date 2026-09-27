<script setup lang="ts">
import { ConfigProvider } from 'reka-ui';

import { ToastHost } from '@shared/ui/toast';
import { SiteFooter } from '@widgets/site-footer';
import { SiteHeader } from '@widgets/site-header';
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
