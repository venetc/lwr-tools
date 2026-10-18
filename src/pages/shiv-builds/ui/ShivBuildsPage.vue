<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { storeToRefs } from 'pinia';

import { useShivBuildsStore } from '@features/manage-builds';
import { Button } from '@shared/ui/button';
import { BuildCalculator, ShivBuildTree } from '@widgets/build-calculator';

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
      <ShivBuildTree
        :build="build"
        removable
        @remove="shivBuildsStore.removeBuild"
      />
    </template>

    <template #add>
      <Button @click="shivBuildsStore.addBuild">
        <span :class="$style.addContent">
          <Plus :class="$style.plusIcon" aria-hidden="true" />
          Add
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
  padding: 3px 12px;
}

.plusIcon {
  flex: none;
  width: 14px;
  height: 14px;
}
</style>
