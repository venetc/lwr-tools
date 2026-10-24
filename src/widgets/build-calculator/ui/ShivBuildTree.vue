<script setup lang="ts">
import { SHIV_BUILD_NAME } from '@entities/shiv';
import { useBuildEditor } from '@features/manage-builds';
import { TieredPickerTierLabel } from '@shared/ui/tiered-picker';

import { useBuildTreeHandlers } from '../model/build-tree-handlers';
import { useShivBuildGroups } from '../model/shiv-build-groups';
import type { ShivBuild } from '../model/shiv-builds';
import { useShivBuildsStore } from '../model/shiv-builds';
import BuildPanel from './BuildPanel.vue';

interface Props {
  /** SHIV build to render and edit. */
  build: Readonly<ShivBuild>
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

const shivBuildsStore = useShivBuildsStore();

const editor = useBuildEditor(() => props.build, shivBuildsStore);

const { groups, select: selectItem } = useShivBuildGroups(() => props.build);

const { rename, lock, replace, reset, update, select } = useBuildTreeHandlers(editor, selectItem, () => emit('change'));
</script>

<template>
  <BuildPanel
    :build="props.build"
    :label="SHIV_BUILD_NAME"
    :fallback-name="SHIV_BUILD_NAME"
    kind="shiv"
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
    <template #tier="{ tier, highlighted }">
      <TieredPickerTierLabel
        :icon="tier.level.icon"
        :name="tier.level.name"
        :highlighted="highlighted"
      />
    </template>
  </BuildPanel>
</template>
