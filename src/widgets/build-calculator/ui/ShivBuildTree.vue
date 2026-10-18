<script setup lang="ts">
import { SHIV_BUILD_NAME } from '@entities/shiv';
import type { ShivBuild } from '@features/manage-builds';
import { useBuildEditor, useShivBuildGroups, useShivBuildsStore } from '@features/manage-builds';
import { TieredPickerTierLabel } from '@shared/ui/tiered-picker';

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
}

const props = withDefaults(defineProps<Props>(), {
  removable: false,
});

const emit = defineEmits<Emits>();

const shivBuildsStore = useShivBuildsStore();

const { rename, lock, replace, reset } = useBuildEditor(() => props.build, shivBuildsStore);

const { groups, select } = useShivBuildGroups(() => props.build);

/**
 * Requests removal of the build.
 */
const requestRemove = () => emit('remove', props.build.id);
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
    @remove="requestRemove"
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
