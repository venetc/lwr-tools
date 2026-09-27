<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { BreadcrumbItem, BreadcrumbMenuItem } from '@shared/ui/breadcrumbs';
import { Breadcrumbs } from '@shared/ui/breadcrumbs';

import { ROOT_BREADCRUMB } from '../config/constants';

const route = useRoute();
const router = useRouter();

const navigationMenu = computed(() => router.options.routes.reduce<BreadcrumbMenuItem[]>((items, record) => {
  if (!record.meta?.breadcrumb) {
    return items;
  }

  items.push({
    label: record.meta.breadcrumb,
    to: record.path,
    isCurrent: route.name === record.name,
  });

  return items;
}, []));

const breadcrumbs = computed(() => route.matched.reduce<BreadcrumbItem[]>((items, record) => {
  if (!record.meta.breadcrumb) {
    return items;
  }

  items.push({ label: record.meta.breadcrumb, to: record.path });

  return items;
}, [{ ...ROOT_BREADCRUMB, menu: navigationMenu.value }]));
</script>

<template>
  <header :class="$style.header">
    <Breadcrumbs :items="breadcrumbs" />
  </header>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/layout';

.header {
  position: sticky;
  inset-block-start: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  block-size: layout.$site-header-height;
  padding: 8px 16px;
  background: colors.$surface-translucent;
  backdrop-filter: blur(8px);
  border-block-end: 1px solid colors.$border-subtle;
}
</style>
