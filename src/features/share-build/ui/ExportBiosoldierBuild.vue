<script setup lang="ts">
import { computed, ref } from 'vue';

import type { BiosoldierBuildData } from '@entities/biosoldier';

import { encodeBiosoldierBuild } from '../model/biosoldier-build-code';
import ShareCodeExport from './ShareCodeExport.vue';

interface Props {
  /** Biosoldier build to share. */
  build: BiosoldierBuildData
}

const props = defineProps<Props>();

const isOpen = ref(false);

const code = computed(() => isOpen.value ? encodeBiosoldierBuild(props.build) : '');
</script>

<template>
  <ShareCodeExport v-model:open="isOpen" :code="code">
    <template #trigger>
      <slot name="trigger" />
    </template>
  </ShareCodeExport>
</template>
