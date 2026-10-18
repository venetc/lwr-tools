<script setup lang="ts">
import { Dialog } from '@shared/ui/dialog';
import { BiosoldierBuildTree, BiosoldierMiniTree, MecBuildTree, MecMiniTree, ShivBuildTree, ShivMiniTree } from '@widgets/build-calculator';

import type { SquadBuild } from '../model/squad-build';
import { useUnitBuild } from '../model/unit-build';

interface Props {
  /** Build of the Unit. */
  squadBuild: SquadBuild
}

const props = defineProps<Props>();

const { biosoldierBuild, mecBuild, shivBuild, isOpen, openBuild } = useUnitBuild(() => props.squadBuild);
</script>

<template>
  <div :class="$style.miniTree">
    <BiosoldierMiniTree v-if="biosoldierBuild" :build="biosoldierBuild" />
    <MecMiniTree v-else-if="mecBuild" :build="mecBuild" />
    <ShivMiniTree v-else-if="shivBuild" :build="shivBuild" />

    <button
      :class="$style.edit"
      type="button"
      @click="openBuild"
    >
      <span :class="$style.visuallyHidden">Edit {{ props.squadBuild.build.name }}</span>
    </button>
  </div>

  <Dialog v-model:open="isOpen" title="Build">
    <div :class="$style.panel">
      <BiosoldierBuildTree v-if="biosoldierBuild" :build="biosoldierBuild" />
      <MecBuildTree v-else-if="mecBuild" :build="mecBuild" />
      <ShivBuildTree v-else-if="shivBuild" :build="shivBuild" />
    </div>
  </Dialog>
</template>

<style lang="scss" module src="./UnitBuild.scss" />
