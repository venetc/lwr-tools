<script setup lang="ts">
import { Dialog } from '@shared/ui/dialog';
import { BiosoldierBuildTree, BiosoldierMiniTree, MecBuildTree, MecMiniTree, ShivBuildTree, ShivMiniTree } from '@widgets/build-calculator';

import type { SquadBuild } from '../model/squad-build';
import { useUnitBuild } from '../model/unit-build';

interface Props {
  /** Build of the Unit. */
  squadBuild: SquadBuild
  /** What closing the Build dialog takes off the Units of the Build, for screen readers; null if nothing. */
  closeNote: string | null
}

interface Emits {
  /** Tells of an edit of what the Build holds, made in the Build dialog. */
  change: []
  /** Tells that the Build dialog closed, so the edits made in it can be checked against the Loadouts. */
  close: []
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const { biosoldierBuild, mecBuild, shivBuild, isOpen, openBuild, closeNoteAnnouncement } = useUnitBuild(
  () => props.squadBuild,
  () => props.closeNote,
  () => emit('close'),
);
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
      <BiosoldierBuildTree
        v-if="biosoldierBuild"
        :build="biosoldierBuild"
        @change="emit('change')"
      />
      <MecBuildTree
        v-else-if="mecBuild"
        :build="mecBuild"
        @change="emit('change')"
      />
      <ShivBuildTree
        v-else-if="shivBuild"
        :build="shivBuild"
        @change="emit('change')"
      />
    </div>

    <p :class="$style.visuallyHidden" aria-live="polite">
      {{ closeNoteAnnouncement }}
    </p>
  </Dialog>
</template>

<style lang="scss" module src="./UnitBuild.scss" />
