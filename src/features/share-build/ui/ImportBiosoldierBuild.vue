<script setup lang="ts">
import type { BiosoldierBuildData } from '@entities/biosoldier';

import { decodeBiosoldierBuild } from '../model/biosoldier-build-code';
import ShareCodeImport from './ShareCodeImport.vue';

interface Emits {
  /** Build decoded from a valid code. */
  import: [build: BiosoldierBuildData]
}

const emit = defineEmits<Emits>();

/**
 * Passes the imported build on.
 *
 * @param build imported build data.
 */
const requestImport = (build: BiosoldierBuildData) => emit('import', build);
</script>

<template>
  <ShareCodeImport :decode="decodeBiosoldierBuild" @import="requestImport">
    <template #trigger>
      <slot name="trigger" />
    </template>
  </ShareCodeImport>
</template>
