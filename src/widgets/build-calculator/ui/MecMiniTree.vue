<script setup lang="ts">
import type { MecBuild } from '../model/mec-builds';
import { useMecMiniTree } from '../model/mini-tree';
import MiniTree from './MiniTree.vue';

interface Props {
  /** MEC build to show. */
  build: Readonly<MecBuild>
}

const props = defineProps<Props>();

const rows = useMecMiniTree(() => props.build);
</script>

<template>
  <MiniTree :rows="rows" />
</template>
