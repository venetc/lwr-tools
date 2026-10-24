<script setup lang="ts">
import { useBuildEditor } from '@features/manage-builds';
import { TieredPickerTierLabel } from '@shared/ui/tiered-picker';

import { useBuildTreeHandlers } from '../model/build-tree-handlers';
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
  /** Tells of an edit of what the build holds: a selection, a reset, an import or an update. */
  change: []
}

const props = withDefaults(defineProps<Props>(), {
  removable: false,
});

const emit = defineEmits<Emits>();

const mecBuildsStore = useMecBuildsStore();

const editor = useBuildEditor(() => props.build, mecBuildsStore);

const { tree, groups, select: selectItem } = useMecBuildGroups(() => props.build);

const { rename, lock, replace, reset, update, select } = useBuildTreeHandlers(editor, selectItem, () => emit('change'));
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
    @update="update"
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
