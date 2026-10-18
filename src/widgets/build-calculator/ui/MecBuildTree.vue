<script setup lang="ts">
import type { MecBuild } from '@features/manage-builds';
import { useBuildEditor, useMecBuildGroups, useMecBuildsStore } from '@features/manage-builds';
import { TieredPickerTierLabel } from '@shared/ui/tiered-picker';

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

/**
 * Requests removal of the build.
 */
const requestRemove = () => emit('remove', props.build.id);
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
    @remove="requestRemove"
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

<style lang="scss" module>
@use 'styles/colors';

.classIcon {
  flex: none;
  width: 34px;
  height: 34px;
  color: colors.$accent;
}
</style>
