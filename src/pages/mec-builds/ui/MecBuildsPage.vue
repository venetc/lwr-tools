<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { storeToRefs } from 'pinia';

import { MEC_CLASSES } from '@entities/soldier';
import { decodeMecBuild } from '@features/share-build';
import { Button } from '@shared/ui/button';
import { BuildCalculator } from '@widgets/build-calculator';

import { useMecBuildsStore } from '../model/mec-builds';
import MecBuildTree from './MecBuildTree.vue';

const mecBuildsStore = useMecBuildsStore();

const { builds } = storeToRefs(mecBuildsStore);
</script>

<template>
  <BuildCalculator
    :builds="builds"
    :decode="decodeMecBuild"
    @import="mecBuildsStore.importBuild"
    @remove="mecBuildsStore.removeBuild"
  >
    <template #build="{ build }">
      <MecBuildTree :build="build" />
    </template>

    <template #add>
      <div :class="$style.addButtons">
        <Button
          v-for="soldierClass in MEC_CLASSES"
          :key="soldierClass.id"
          @click="mecBuildsStore.addBuild(soldierClass)"
        >
          <span :class="$style.addContent">
            <Plus :class="$style.plusIcon" aria-hidden="true" />
            <component
              :is="soldierClass.icon"
              :class="$style.classIcon"
              aria-hidden="true"
            />
            <span :class="$style.visuallyHidden">Add {{ soldierClass.name }}</span>
          </span>
        </Button>
      </div>
    </template>

    <template #nav-icon="{ build }">
      <component :is="build.soldierClass.icon" :class="$style.navIcon" />
    </template>
  </BuildCalculator>
</template>

<style lang="scss" module>
@use 'styles/colors';

// Toolbar width from which the add buttons get side padding; matches the toolbar row breakpoint of the calculator.
$toolbar-row-min-width: 720px;

.addButtons {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
}

.addContent {
  display: flex;
  align-items: center;
  gap: 1px;
  padding-block: 3px;

  @container (width >= #{$toolbar-row-min-width}) {
    padding-inline: 8px;
  }
}

.navIcon {
  width: 100%;
  height: 100%;
  color: colors.$accent;
}

.plusIcon {
  flex: none;
  width: 14px;
  height: 14px;
}

.classIcon {
  flex: none;
  width: 22px;
  height: 22px;
}

.visuallyHidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
