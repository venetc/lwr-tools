<script setup lang="ts">
import { useSiblingRoutes } from '@shared/lib/route-menu';
import { LinkMenu } from '@shared/ui/link-menu';

const { parentTitle, items } = useSiblingRoutes();
</script>

<template>
  <LinkMenu :title="parentTitle" :items="items" />
</template>
