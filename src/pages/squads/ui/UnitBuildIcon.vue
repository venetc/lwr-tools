<script setup lang="ts">
import type { SquadBuildData } from '../model/squad-build';
import { useSquadBuildViews } from '../model/unit-build';

interface Props {
  /** Build whose class icon is shown, saved or not yet. */
  squadBuild: SquadBuildData
}

const props = defineProps<Props>();

const { buildIcon, classIcon } = useSquadBuildViews(() => props.squadBuild);
</script>

<template>
  <component
    :is="buildIcon"
    v-if="buildIcon"
    :build="props.squadBuild.build"
  />
  <component
    :is="classIcon"
    v-else-if="classIcon"
    :class="$style.classIcon"
    aria-hidden="true"
  />
</template>

<style lang="scss" module src="./UnitBuildIcon.scss" />
