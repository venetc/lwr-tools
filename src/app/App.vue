<script setup lang="ts">
import { ConfigProvider } from 'reka-ui';

import { ToastHost } from '@shared/ui/toast';

import SiteFooter from './layout/SiteFooter.vue';
import SiteHeader from './layout/SiteHeader.vue';
import { usePageLead } from './lib/page-lead';

const { lead } = usePageLead();
</script>

<template>
  <ConfigProvider :scroll-body="false">
    <div :class="$style.layout">
      <SiteHeader />
      <p v-if="lead" :class="$style.lead">
        {{ lead }}
      </p>
      <div :class="$style.content">
        <RouterView />
      </div>
      <SiteFooter />
      <ToastHost />
    </div>
  </ConfigProvider>
</template>

<style lang="scss" module src="./App.scss" />
