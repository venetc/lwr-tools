<script setup lang="ts">
import { BiosoldierClassIcon } from '@widgets/build-calculator';

import type { SquadBuild } from '../model/squad-build';
import { useUnitBuildIcon } from '../model/unit-build-icon';

interface Props {
  /** Build whose class icon is shown. */
  squadBuild: SquadBuild
}

const props = defineProps<Props>();

const { biosoldierBuild, classIcon } = useUnitBuildIcon(() => props.squadBuild);
</script>

<template>
  <BiosoldierClassIcon v-if="biosoldierBuild" :build="biosoldierBuild" />
  <component
    :is="classIcon"
    v-else-if="classIcon"
    :class="$style.classIcon"
    aria-hidden="true"
  />
</template>

<style lang="scss" module src="./UnitBuildIcon.scss" />
