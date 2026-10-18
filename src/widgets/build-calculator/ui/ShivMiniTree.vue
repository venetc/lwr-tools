<script setup lang="ts">
import { useShivMiniTree } from '../model/mini-tree';
import type { ShivBuild } from '../model/shiv-builds';
import MiniTree from './MiniTree.vue';

interface Props {
  /** SHIV build to show. */
  build: Readonly<ShivBuild>
}

const props = defineProps<Props>();

const rows = useShivMiniTree(() => props.build);
</script>

<template>
  <MiniTree :rows="rows" />
</template>
