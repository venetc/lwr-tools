<script setup lang="ts">
import { useBuildEditor } from '@features/manage-builds';
import { TieredPickerTierLabel } from '@shared/ui/tiered-picker';

import { useMecBuildGroups } from '../model/mec-build-groups';
import type { MecBuild } from '../model/mec-builds';
import { useMecBuildsStore } from '../model/mec-builds';
import BuildPanel from './BuildPanel.vue';

interface Props {
  /** MEC build to render and edit. */
  build: Readonly<MecBuild>
  /** Whether the tree offers removal of the build. */
  removable?: boolean
}

interface Emits {
  /** Requests removal of the build. */
  remove: [buildId: string]
}

const props = withDefaults(defineProps<Props>(), {
  removable: false,
});

const emit = defineEmits<Emits>();

const mecBuildsStore = useMecBuildsStore();

const { rename, lock, replace, reset } = useBuildEditor(() => props.build, mecBuildsStore);

const { tree, groups, select } = useMecBuildGroups(() => props.build);
</script>

<template>
  <BuildPanel
    :key="props.build.soldierClass.id"
    :build="props.build"
    :label="tree.name"
    :fallback-name="props.build.soldierClass.name"
    kind="mec"
    :groups="groups"
    :removable="props.removable"
    @rename="rename"
    @lock="lock"
    @replace="replace"
    @reset="reset"
    @remove="emit('remove', props.build.id)"
    @select="select"
  >
    <template #icon>
      <component
        :is="props.build.soldierClass.icon"
        :class="$style.classIcon"
        aria-hidden="true"
      />
    </template>

    <template #tier="{ tier, highlighted }">
      <TieredPickerTierLabel
        :icon="tier.rank.icon"
        :name="tier.rank.name"
        :highlighted="highlighted"
      />
    </template>
  </BuildPanel>
</template>

<style lang="scss" module src="./MecBuildTree.scss" />
