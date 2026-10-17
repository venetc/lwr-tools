<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { storeToRefs } from 'pinia';

import { BIOSOLDIER_CLASSES } from '@entities/soldier';
import { Button } from '@shared/ui/button';
import { DropdownMenu, DropdownMenuAction } from '@shared/ui/dropdown-menu';
import { BuildCalculator } from '@widgets/build-calculator';

import { useBiosoldierBuildsStore } from '../model/biosoldier-builds';
import BiosoldierBuildTree from './BiosoldierBuildTree.vue';
import BiosoldierClassIcon from './BiosoldierClassIcon.vue';

const biosoldierBuildsStore = useBiosoldierBuildsStore();

const { builds } = storeToRefs(biosoldierBuildsStore);
</script>

<template>
  <BuildCalculator
    :builds="builds"
    kind="biosoldier"
    @import="biosoldierBuildsStore.importBuild"
    @remove="biosoldierBuildsStore.removeBuild"
  >
    <template #build="{ build }">
      <BiosoldierBuildTree :build="build" />
    </template>

    <template #add>
      <DropdownMenu>
        <template #trigger>
          <Button>
            <span :class="$style.addContent">
              <Plus :class="$style.plusIcon" aria-hidden="true" />
              Add
            </span>
          </Button>
        </template>

        <DropdownMenuAction
          v-for="soldierClass in BIOSOLDIER_CLASSES"
          :key="soldierClass.id"
          @select="biosoldierBuildsStore.addBuild(soldierClass)"
        >
          <component
            :is="soldierClass.icon"
            :class="$style.classIcon"
            aria-hidden="true"
          />
          {{ soldierClass.name }}
        </DropdownMenuAction>
      </DropdownMenu>
    </template>

    <template #nav-icon="{ build }">
      <BiosoldierClassIcon :build="build" :class="$style.navIcon" />
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

.navIcon {
  width: 100%;
  height: 100%;
}

.plusIcon {
  flex: none;
  width: 14px;
  height: 14px;
}

.classIcon {
  flex: none;
  width: 20px;
  height: 20px;
}
</style>
