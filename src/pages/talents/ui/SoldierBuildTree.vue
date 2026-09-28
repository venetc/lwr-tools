<script setup lang="ts">
import { computed } from 'vue';

import type { SoldierBuildData } from '@entities/soldier';
import { SoldierBuildHeading, soldierClassTalentTree, SoldierRankLabel } from '@entities/soldier';
import type { TalentRankState } from '@shared/lib/talent-tree';
import { TalentTree } from '@shared/ui/talent-tree';

import type { SoldierBuild, SoldierBuildId } from '../model/talents';
import { useTalentsStore } from '../model/talents';
import BuildActions from './BuildActions.vue';

interface Props {
  /** Soldier build to render and edit. */
  build: Readonly<SoldierBuild>
}

interface Emits {
  /** Requests removal of the build. */
  remove: [buildId: SoldierBuildId]
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

/**
 * Requests removal of the build.
 */
const requestRemove = () => emit('remove', props.build.id);

const talentsStore = useTalentsStore();

const tree = computed(() => soldierClassTalentTree(props.build.soldierClass));

/**
 * Selects a talent on the rank of the build.
 *
 * @param rankIndex rank index in the tree.
 * @param talentId selected talent id, or null to clear the rank selection.
 */
const selectTalent = (rankIndex: number, talentId: string | null) => {
  talentsStore.selectBuildTalent(props.build.id, rankIndex, talentId);
};

const name = computed({
  get: () => props.build.name,
  set: value => talentsStore.setName(props.build.id, value),
});

/**
 * Replaces the build with imported data.
 *
 * @param data imported build data.
 */
const importBuild = (data: SoldierBuildData) => talentsStore.replaceBuild(props.build.id, data);

const readonly = computed({
  get: () => props.build.readonly,
  set: value => talentsStore.setReadonly(props.build.id, value),
});

/**
 * Checks whether the rank is the one currently open for selection.
 *
 * @param state rank state in the tree.
 */
const isRankHighlighted = (state: TalentRankState) => state === 'available';
</script>

<template>
  <TalentTree
    :build="props.build.talents"
    :readonly="readonly"
    :tree="tree"
    @select="selectTalent"
  >
    <template #header>
      <SoldierBuildHeading
        v-model:name="name"
        :soldier-class="props.build.soldierClass"
        :readonly="readonly"
      />
      <BuildActions
        v-model:locked="readonly"
        :build="props.build"
        @remove="requestRemove"
        @import="importBuild"
      />
    </template>

    <template #rank="{ rank, state }">
      <SoldierRankLabel :rank="rank" :highlighted="isRankHighlighted(state)" />
    </template>
  </TalentTree>
</template>
