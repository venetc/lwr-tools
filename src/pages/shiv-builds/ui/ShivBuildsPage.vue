<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { storeToRefs } from 'pinia';

import { BuildRemovalDialog, useBuildRemoval } from '@features/manage-squads';
import { Button } from '@shared/ui/button';
import { BuildCalculator, ShivBuildTree, useShivBuildsStore } from '@widgets/build-calculator';

const shivBuildsStore = useShivBuildsStore();

const { builds } = storeToRefs(shivBuildsStore);

const { isDialogOpen, title, note, removeBuild, confirmRemoval } = useBuildRemoval('shiv', shivBuildsStore);
</script>

<template>
  <BuildCalculator
    :builds="builds"
    kind="shiv"
    @import="shivBuildsStore.importBuild"
    @remove="removeBuild"
  >
    <template #build="{ build }">
      <ShivBuildTree
        :build="build"
        removable
        @remove="removeBuild"
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

  <BuildRemovalDialog
    v-model:open="isDialogOpen"
    :title="title"
    :note="note"
    @delete="confirmRemoval"
  />
</template>

<style lang="scss" module src="./ShivBuildsPage.scss" />
