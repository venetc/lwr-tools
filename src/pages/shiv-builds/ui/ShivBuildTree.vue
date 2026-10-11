<script setup lang="ts">
import { SHIV_BUILD_NAME } from '@entities/shiv';
import { decodeShivBuild, encodeShivBuild } from '@features/share-build';
import { TieredPickerTierLabel } from '@shared/ui/tiered-picker';
import { BuildPanel } from '@widgets/build-calculator';

import type { ShivBuild } from '../model/shiv-builds';
import { useShivBuildsStore } from '../model/shiv-builds';
import { useShivBuildTiers } from '../model/useShivBuildTiers';

interface Props {
  /** SHIV build to render and edit. */
  build: Readonly<ShivBuild>
}

const props = defineProps<Props>();

const shivBuildsStore = useShivBuildsStore();

const { tiers, featuredItem } = useShivBuildTiers(() => props.build);
</script>

<template>
  <BuildPanel
    :build="props.build"
    :label="SHIV_BUILD_NAME"
    :fallback-name="SHIV_BUILD_NAME"
    :tiers="tiers"
    :default-item="featuredItem"
    :actions="shivBuildsStore"
    :encode="encodeShivBuild"
    :decode="decodeShivBuild"
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
