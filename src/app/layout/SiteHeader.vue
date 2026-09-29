<script setup lang="ts">
import { Breadcrumbs } from '@shared/ui/breadcrumbs';

import { useBreadcrumbs } from '../lib/useBreadcrumbs';

const { breadcrumbs } = useBreadcrumbs();
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
