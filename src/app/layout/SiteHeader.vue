<script setup lang="ts">
import { Breadcrumbs } from '@shared/ui/breadcrumbs';

import { useBreadcrumbs } from '../lib/breadcrumbs';

const { breadcrumbs } = useBreadcrumbs();
</script>

<template>
  <header :class="$style.header">
    <Breadcrumbs :items="breadcrumbs" />
  </header>
</template>

<style lang="scss" module src="./SiteHeader.scss" />
