<script setup lang="ts">
import type { SquadBuildData } from '../model/squad-build';
import { useSquadBuildViews } from '../model/unit-build';

interface Props {
  /** Build whose Signature skill is shown, saved or not yet; only a biosoldier or MEC build has one. */
  squadBuild: SquadBuildData
}

const props = defineProps<Props>();

const { signatureSkillIcon } = useSquadBuildViews(() => props.squadBuild);
</script>

<template>
  <component
    :is="signatureSkillIcon"
    v-if="signatureSkillIcon"
    :build="props.squadBuild.build"
  />
</template>
