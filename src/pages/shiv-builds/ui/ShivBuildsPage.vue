<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { storeToRefs } from 'pinia';

import { Button } from '@shared/ui/button';
import { BuildCalculator } from '@widgets/build-calculator';

import { useShivBuildsStore } from '../model/shiv-builds';
import ShivBuildTree from './ShivBuildTree.vue';

const shivBuildsStore = useShivBuildsStore();

const { builds } = storeToRefs(shivBuildsStore);
</script>

<template>
  <BuildCalculator
    :builds="builds"
    kind="shiv"
    @import="shivBuildsStore.importBuild"
    @remove="shivBuildsStore.removeBuild"
  >
    <template #build="{ build }">
      <ShivBuildTree :build="build" />
    </template>

    <template #add>
      <Button @click="shivBuildsStore.addBuild">
        <span :class="$style.addContent">
          <Plus :class="$style.plusIcon" aria-hidden="true" />
          Add SHIV
        </span>
      </Button>
    </template>
  </BuildCalculator>
</template>

<style lang="scss" module>
.addContent {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
}

.plusIcon {
  flex: none;
  width: 14px;
  height: 14px;
}
</style>
