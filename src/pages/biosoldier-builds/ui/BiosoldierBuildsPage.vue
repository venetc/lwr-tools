<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { storeToRefs } from 'pinia';

import { BIOSOLDIER_CLASSES } from '@entities/soldier';
import { Button } from '@shared/ui/button';
import { DropdownMenu, DropdownMenuAction } from '@shared/ui/dropdown-menu';
import { BiosoldierBuildTree, BiosoldierClassIcon, BuildCalculator, OfficerRankBadge, useBiosoldierBuildsStore } from '@widgets/build-calculator';

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
      <BiosoldierBuildTree
        :build="build"
        removable
        @remove="biosoldierBuildsStore.removeBuild"
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

    <template #nav-badge="{ build }">
      <OfficerRankBadge :build="build" />
    </template>
  </BuildCalculator>
</template>

<style lang="scss" module src="./BiosoldierBuildsPage.scss" />
