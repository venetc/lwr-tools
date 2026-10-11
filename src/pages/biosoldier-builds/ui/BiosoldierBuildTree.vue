<script setup lang="ts">
import { TieredPicker } from '@shared/ui/tiered-picker';

import type { BiosoldierBuild, BiosoldierBuildId } from '../model/biosoldier-builds';
import { useBiosoldierBuildEditor } from '../model/useBiosoldierBuildEditor';
import type { BiosoldierRankTier } from '../model/useBiosoldierBuildTiers';
import { useBiosoldierBuildTiers } from '../model/useBiosoldierBuildTiers';
import BiosoldierBuildHeading from './BiosoldierBuildHeading.vue';
import BuildActions from './BuildActions.vue';
import SoldierRankLabel from './SoldierRankLabel.vue';

interface Props {
  /** Biosoldier build to render and edit. */
  build: Readonly<BiosoldierBuild>
}

interface Emits {
  /** Requests removal of the build. */
  remove: [buildId: BiosoldierBuildId]
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const { tree, tiers, featuredItem } = useBiosoldierBuildTiers(() => props.build);

const { name, readonly, selectPerk, replace } = useBiosoldierBuildEditor(() => props.build);

/**
 * Requests removal of the build.
 */
const requestRemove = () => emit('remove', props.build.id);

/**
 * Checks whether the rank is the one currently open for selection.
 *
 * @param tier picker tier of the rank.
 */
const isRankHighlighted = (tier: BiosoldierRankTier) => tier.state === 'available';
</script>

<template>
  <TieredPicker
    :key="props.build.biosoldierClass.id"
    :label="tree.name"
    :tiers="tiers"
    :default-item="featuredItem"
    @select="selectPerk"
  >
    <template #header>
      <BiosoldierBuildHeading
        v-model:name="name"
        :biosoldier-class="props.build.biosoldierClass"
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
