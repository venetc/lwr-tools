<script setup lang="ts">
import type { BiosoldierBuild } from '../model/biosoldier-builds';
import { useBiosoldierMiniTree } from '../model/mini-tree';
import MiniTree from './MiniTree.vue';

interface Props {
  /** Biosoldier build to show. */
  build: Readonly<BiosoldierBuild>
}

const props = defineProps<Props>();

const rows = useBiosoldierMiniTree(() => props.build);
</script>

<template>
  <MiniTree :rows="rows" />
</template>
