<script setup lang="ts">
import { TieredPicker } from '@shared/ui/tiered-picker';

import type { SoldierBuild, SoldierBuildId } from '../model/talents';
import { useSoldierBuildEditor } from '../model/useSoldierBuildEditor';
import type { SoldierRankTier } from '../model/useSoldierBuildTiers';
import { useSoldierBuildTiers } from '../model/useSoldierBuildTiers';
import BuildActions from './BuildActions.vue';
import SoldierBuildHeading from './SoldierBuildHeading.vue';
import SoldierRankLabel from './SoldierRankLabel.vue';

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

const { tree, tiers, featuredItem } = useSoldierBuildTiers(() => props.build);

const { name, readonly, selectTalent, replace } = useSoldierBuildEditor(() => props.build);

/**
 * Requests removal of the build.
 */
const requestRemove = () => emit('remove', props.build.id);

/**
 * Checks whether the rank is the one currently open for selection.
 *
 * @param tier picker tier of the rank.
 */
const isRankHighlighted = (tier: SoldierRankTier) => tier.state === 'available';
</script>

<template>
  <TieredPicker
    :key="props.build.soldierClass.id"
    :label="tree.name"
    :tiers="tiers"
    :default-item="featuredItem"
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
        @import="replace"
      />
    </template>

    <template #tier="{ tier }">
      <SoldierRankLabel :rank="tier.rank" :highlighted="isRankHighlighted(tier)" />
    </template>
  </TieredPicker>
</template>
