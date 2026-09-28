<script setup lang="ts">
import { computed, ref } from 'vue';

import type { SoldierBuildData } from '@entities/soldier';

import { encodeSoldierBuild } from '../model/soldier-build-code';
import ShareCodeExport from './ShareCodeExport.vue';

interface Props {
  /** Soldier build to share. */
  build: SoldierBuildData
}

const props = defineProps<Props>();

const isOpen = ref(false);

const code = computed(() => isOpen.value ? encodeSoldierBuild(props.build) : '');
</script>

<template>
  <ShareCodeExport v-model:open="isOpen" :code="code">
    <template #trigger>
      <slot name="trigger" />
    </template>
  </ShareCodeExport>
</template>
