<script setup lang="ts">
import { SITE_NAME } from '@shared/config/site';
import { useTopLevelRoutes } from '@shared/lib/route-menu';
import { LinkMenu } from '@shared/ui/link-menu';

const { items } = useTopLevelRoutes();
</script>

<template>
  <LinkMenu :title="SITE_NAME" :items="items" />
</template>
