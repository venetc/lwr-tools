<script setup lang="ts">
import { useCssModule } from 'vue';

import { TieredPickerTierLabel } from '@shared/ui/tiered-picker';

import { useBiosoldierBranchClasses } from '../model/biosoldier-branch-classes';
import { tierLabel, useBiosoldierBuildGroups } from '../model/biosoldier-build-groups';
import type { BiosoldierBuild } from '../model/biosoldier-builds';
import { useBiosoldierBuildsStore } from '../model/biosoldier-builds';
import { useBuildEditor } from '../model/build-editor';
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
  /** Tells of an edit of what the build holds: a selection, a reset, an import or an update. */
  change: []
}

const props = withDefaults(defineProps<Props>(), {
  removable: false,
});

const emit = defineEmits<Emits>();

const biosoldierBuildsStore = useBiosoldierBuildsStore();

const { tree, groups, select: selectItem } = useBiosoldierBuildGroups(() => props.build);

const { rename, lock, replace, reset, update, select } = useBuildEditor(() => props.build, biosoldierBuildsStore, selectItem, () => emit('change'));

const { getBranchClasses } = useBiosoldierBranchClasses(useCssModule());
</script>

<template>
  <div :class="$style.tree">
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
      @update="update"
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
  </div>
</template>

<style lang="scss" module src="./BiosoldierBuildTree.scss" />
