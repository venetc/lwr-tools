<script setup lang="ts">
import { useCssModule } from 'vue';

import { useBuildEditor } from '@features/manage-builds';
import { TieredPickerTierLabel } from '@shared/ui/tiered-picker';

import type { BiosoldierBranch, BiosoldierBuildGroup } from '../model/biosoldier-build-groups';
import { tierIcon, useBiosoldierBuildGroups } from '../model/biosoldier-build-groups';
import type { BiosoldierBuild } from '../model/biosoldier-builds';
import { useBiosoldierBuildsStore } from '../model/biosoldier-builds';
import BiosoldierClassIcon from './BiosoldierClassIcon.vue';
import BuildPanel from './BuildPanel.vue';

interface Props {
  /** Biosoldier build to render and edit. */
  build: Readonly<BiosoldierBuild>
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

const style = useCssModule();

const biosoldierBuildsStore = useBiosoldierBuildsStore();

const { rename, lock, replace, reset } = useBuildEditor(() => props.build, biosoldierBuildsStore);

const { tree, groups, select } = useBiosoldierBuildGroups(() => props.build);

/** Colours of each branch: its counter when the branch has a selection, and the described ability name. */
const branchClasses: Record<BiosoldierBranch, { counter: string | undefined, name: string | undefined }> = {
  'class-tree': { counter: style.counterClassTree, name: undefined },
  'gene-mods': { counter: style.counterGeneMods, name: style.geneModName },
  'psionic': { counter: style.counterPsionic, name: style.psionicName },
};

/**
 * Classes of a branch: the tab counter, grey for an empty branch, and the described ability name.
 *
 * @param group tier group of the branch.
 */
const getBranchClasses = (group: BiosoldierBuildGroup) => ({
  counter: [style.counter, group.isEmpty ? style.counterEmpty : branchClasses[group.id].counter],
  name: branchClasses[group.id].name,
});

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
    kind="biosoldier"
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
      <BiosoldierClassIcon :build="props.build" :class="$style.classIcon" />
    </template>

    <template #tab="{ group }">
      <span :class="$style.tabLabel">
        <span>{{ group.title }}</span>
        <span :class="getBranchClasses(group).counter">{{ group.counter }}</span>
      </span>
    </template>

    <template #tier="{ tier, highlighted }">
      <TieredPickerTierLabel
        :icon="tierIcon(tier)"
        :name="tier.name"
        :highlighted="highlighted"
      />
    </template>

    <template #item-name="{ item, group }">
      <span :class="getBranchClasses(group).name">{{ item.name }}</span>
    </template>
  </BuildPanel>
</template>

<style lang="scss" module src="./BiosoldierBuildTree.scss" />
