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

<style lang="scss" module src="./App.scss" />
