<script setup lang="ts">
import { useCssModule } from 'vue';

import { useBuildEditor } from '@features/manage-builds';
import { TieredPickerTierLabel } from '@shared/ui/tiered-picker';

import { useBiosoldierBranchClasses } from '../model/biosoldier-branch-classes';
import { tierLabel, useBiosoldierBuildGroups } from '../model/biosoldier-build-groups';
import type { BiosoldierBuild } from '../model/biosoldier-builds';
import { useBiosoldierBuildsStore } from '../model/biosoldier-builds';
import { useBuildTreeHandlers } from '../model/build-tree-handlers';
import BiosoldierClassIcon from './BiosoldierClassIcon.vue';
import BuildPanel from './BuildPanel.vue';
import OfficerRankBadge from './OfficerRankBadge.vue';

interface Props {
  /** Biosoldier build to render and edit. */
  build: Readonly<BiosoldierBuild>
  /** Whether the tree offers removal of the build. */
  removable?: boolean
}

interface Emits {
  /** Requests removal of the build. */
  remove: [buildId: string]
  /** Tells of an edit of what the build holds: a selection, a reset or an import. */
  change: []
}

const props = withDefaults(defineProps<Props>(), {
  removable: false,
});

const emit = defineEmits<Emits>();

const biosoldierBuildsStore = useBiosoldierBuildsStore();

const editor = useBuildEditor(() => props.build, biosoldierBuildsStore);

const { tree, groups, select: selectItem } = useBiosoldierBuildGroups(() => props.build);

const { rename, lock, replace, reset, select } = useBuildTreeHandlers(editor, selectItem, () => emit('change'));

const { getBranchClasses } = useBiosoldierBranchClasses(useCssModule());
</script>

<template>
  <BuildPanel
    :key="props.build.soldierClass.id"
    :build="props.build"
    :label="tree.name"
    :fallback-name="props.build.soldierClass.name"
    kind="biosoldier"
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
      <BiosoldierClassIcon :build="props.build" :class="$style.classIcon" />
    </template>

    <template #badge>
      <OfficerRankBadge :build="props.build" />
    </template>

    <template #tab="{ group }">
      <span :class="$style.tabLabel">
        <span>{{ group.title }}</span>
        <span :class="getBranchClasses(group).counter">{{ group.counter }}</span>
      </span>
    </template>

    <template #tier="{ tier, highlighted }">
      <TieredPickerTierLabel v-bind="tierLabel(tier)" :highlighted="highlighted" />
    </template>

    <template #item-name="{ item, group }">
      <span :class="getBranchClasses(group).name">{{ item.name }}</span>
    </template>
  </BuildPanel>
</template>

<style lang="scss" module src="./BiosoldierBuildTree.scss" />
