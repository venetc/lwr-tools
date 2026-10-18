<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { storeToRefs } from 'pinia';

import { MEC_CLASSES } from '@entities/soldier';
import { useMecBuildsStore } from '@features/manage-builds';
import { Button } from '@shared/ui/button';
import { DropdownMenu, DropdownMenuAction } from '@shared/ui/dropdown-menu';
import { BuildCalculator, MecBuildTree } from '@widgets/build-calculator';

const mecBuildsStore = useMecBuildsStore();

const { builds } = storeToRefs(mecBuildsStore);
</script>

<template>
  <BuildCalculator
    :builds="builds"
    kind="mec"
    @import="mecBuildsStore.importBuild"
    @remove="mecBuildsStore.removeBuild"
  >
    <template #build="{ build }">
      <MecBuildTree
        :build="build"
        removable
        @remove="mecBuildsStore.removeBuild"
      />
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
          v-for="soldierClass in MEC_CLASSES"
          :key="soldierClass.id"
          @select="mecBuildsStore.addBuild(soldierClass)"
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
      <component :is="build.soldierClass.icon" :class="$style.navIcon" />
    </template>
  </BuildCalculator>
</template>

<style lang="scss" module>
@use 'styles/colors';

.addContent {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 12px;
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
  width: 20px;
  height: 20px;
}
</style>
