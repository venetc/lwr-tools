<script setup lang="ts">
import type { SquadBuild } from '../model/squad-build';
import { useSquadBuildViews } from '../model/unit-build';

interface Props {
  /** Build whose senior officer rank is shown; only a biosoldier build has one. */
  squadBuild: SquadBuild
}

const props = defineProps<Props>();

const { officerRankBadge } = useSquadBuildViews(() => props.squadBuild);
</script>

<template>
  <component
    :is="officerRankBadge"
    v-if="officerRankBadge"
    :build="props.squadBuild.build"
  />
</template>
