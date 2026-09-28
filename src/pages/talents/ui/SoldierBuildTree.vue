<script setup lang="ts">
import { computed } from 'vue';

import { SoldierClassHeading, SoldierRankLabel } from '@entities/soldier';
import type { TalentRankState } from '@shared/ui/talent-tree';
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

const talents = computed({
  get: () => props.build.talents,
  set: value => talentsStore.setTalents(props.build.id, value),
});

const name = computed({
  get: () => props.build.name,
  set: value => talentsStore.setName(props.build.id, value),
});

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
    v-model="talents"
    :readonly="readonly"
    :tree="props.build.tree"
  >
    <template #header>
      <SoldierClassHeading
        v-model:name="name"
        :soldier-class="props.build.soldierClass"
        :readonly="readonly"
      />
      <BuildActions v-model:locked="readonly" @remove="requestRemove" />
    </template>

    <template #rank="{ rank, state }">
      <SoldierRankLabel :rank="rank" :highlighted="isRankHighlighted(state)" />
    </template>
  </TalentTree>
</template>
