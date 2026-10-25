<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { storeToRefs } from 'pinia';

import { MEC_CLASSES } from '@entities/soldier';
import { BuildRemovalDialog, useBuildRemoval } from '@features/manage-squads';
import { Button } from '@shared/ui/button';
import { DropdownMenu, DropdownMenuAction } from '@shared/ui/dropdown-menu';
import { BuildCalculator, MecBuildTree, SignatureSkillIcon, useMecBuildsStore } from '@widgets/build-calculator';

const mecBuildsStore = useMecBuildsStore();

const { builds } = storeToRefs(mecBuildsStore);

const { isDialogOpen, title, note, removeBuild, confirmRemoval } = useBuildRemoval('mec', mecBuildsStore);
</script>

<template>
  <BuildCalculator
    :builds="builds"
    kind="mec"
    @import="mecBuildsStore.importBuild"
    @remove="removeBuild"
  >
    <template #build="{ build }">
      <MecBuildTree
        :build="build"
        removable
        @remove="removeBuild"
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
      <SignatureSkillIcon :build="build" />
    </template>
  </BuildCalculator>

  <BuildRemovalDialog
    v-model:open="isDialogOpen"
    :title="title"
    :note="note"
    @delete="confirmRemoval"
  />
</template>

<style lang="scss" module src="./MecBuildsPage.scss" />
