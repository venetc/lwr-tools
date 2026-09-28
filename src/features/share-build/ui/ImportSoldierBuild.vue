<script setup lang="ts">
import type { SoldierBuildData } from '@entities/soldier';

import { decodeSoldierBuild } from '../model/soldier-build-code';
import ShareCodeImport from './ShareCodeImport.vue';

interface Emits {
  /** Build decoded from a valid code. */
  import: [build: SoldierBuildData]
}

const emit = defineEmits<Emits>();

/**
 * Passes the imported build on.
 *
 * @param build imported build data.
 */
const requestImport = (build: SoldierBuildData) => emit('import', build);
</script>

<template>
  <ShareCodeImport :decode="decodeSoldierBuild" @import="requestImport">
    <template #trigger>
      <slot name="trigger" />
    </template>
  </ShareCodeImport>
</template>
