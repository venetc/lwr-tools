<script setup lang="ts">
import { useCssModule } from 'vue';

import { useBuildEditor } from '@features/manage-builds';
import { TieredPickerTierLabel } from '@shared/ui/tiered-picker';
import { BuildPanel } from '@widgets/build-calculator';

import type { BiosoldierBranch, BiosoldierBuildGroup } from '../model/biosoldier-build-groups';
import { tierIcon, useBiosoldierBuildGroups } from '../model/biosoldier-build-groups';
import type { BiosoldierBuild } from '../model/biosoldier-builds';
import { useBiosoldierBuildsStore } from '../model/biosoldier-builds';
import BiosoldierClassIcon from './BiosoldierClassIcon.vue';

interface Props {
  /** Biosoldier build to render and edit. */
  build: Readonly<BiosoldierBuild>
}

const props = defineProps<Props>();

const style = useCssModule();

const biosoldierBuildsStore = useBiosoldierBuildsStore();

const { rename, lock, replace, remove } = useBuildEditor(() => props.build, biosoldierBuildsStore);

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
</script>

<template>
  <BuildPanel
    :key="props.build.soldierClass.id"
    :build="props.build"
    :label="tree.name"
    :fallback-name="props.build.soldierClass.name"
    kind="biosoldier"
    :groups="groups"
    @rename="rename"
    @lock="lock"
    @replace="replace"
    @remove="remove"
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

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';
@use '@entities/soldier/config/styles/branches';

.classIcon {
  flex: none;
  width: 34px;
  height: 34px;
}

.tabLabel {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  column-gap: 6px;
}

.counter {
  @include typography.numeric-3;
}

.counterClassTree {
  color: colors.$text-accent;
}

.counterGeneMods {
  color: branches.$gene-mod-text;
}

.counterPsionic {
  color: branches.$psionic-text;
}

.counterEmpty {
  color: colors.$text-disabled;
}

.geneModName {
  color: branches.$gene-mod-text;
}

.psionicName {
  color: branches.$psionic-text;
}
</style>
