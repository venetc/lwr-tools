<script setup lang="ts">
import { useCssVar, useElementSize } from '@vueuse/core';
import { computed, useTemplateRef, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

import { SITE_HEADER_HEIGHT_PROPERTY } from '@shared/config/layout';
import type { BreadcrumbItem } from '@shared/ui/breadcrumbs';
import { Breadcrumbs } from '@shared/ui/breadcrumbs';

import { ROOT_BREADCRUMB } from '../config/constants';

const route = useRoute();

const header = useTemplateRef('header');
const { height } = useElementSize(header, undefined, { box: 'border-box' });
const headerHeight = useCssVar(SITE_HEADER_HEIGHT_PROPERTY);

watchEffect(() => {
  headerHeight.value = `${height.value}px`;
});

const breadcrumbs = computed(() => route.matched.reduce<BreadcrumbItem[]>((items, record) => {
  if (!record.meta.breadcrumb) {
    return items;
  }

  items.push({ label: record.meta.breadcrumb, to: record.path });

  return items;
}, [ROOT_BREADCRUMB]));
</script>

<template>
  <header ref="header" :class="$style.header">
    <Breadcrumbs :items="breadcrumbs" />
  </header>
</template>

<style lang="scss" module>
@use 'styles/colors';

.header {
  position: sticky;
  inset-block-start: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  min-block-size: 40px;
  padding: 8px 16px;
  background: colors.$surface-translucent;
  backdrop-filter: blur(8px);
  border-block-end: 1px solid colors.$border-subtle;
}
</style>
