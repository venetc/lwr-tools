<script setup lang="ts">
import { OfficerRankBadge } from '@widgets/build-calculator';

import type { SquadBuild } from '../model/squad-build';
import { useKindBuilds } from '../model/unit-build';

interface Props {
  /** Build whose senior officer rank is shown; only a biosoldier build has one. */
  squadBuild: SquadBuild
}

const props = defineProps<Props>();

const { biosoldierBuild } = useKindBuilds(() => props.squadBuild);
</script>

<template>
  <OfficerRankBadge v-if="biosoldierBuild" :build="biosoldierBuild" />
</template>
