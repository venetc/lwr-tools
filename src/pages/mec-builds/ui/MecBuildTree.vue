<script setup lang="ts">
import { useClassTreeTiers } from '@entities/soldier';
import { decodeMecBuild, encodeMecBuild } from '@features/share-build';
import { TieredPickerTierLabel } from '@shared/ui/tiered-picker';
import { BuildPanel } from '@widgets/build-calculator';

import type { MecBuild } from '../model/mec-builds';
import { useMecBuildsStore } from '../model/mec-builds';

interface Props {
  /** MEC build to render and edit. */
  build: Readonly<MecBuild>
}

const props = defineProps<Props>();

const mecBuildsStore = useMecBuildsStore();

const { tree, tiers, featuredItem } = useClassTreeTiers(() => props.build);
</script>

<template>
  <BuildPanel
    :key="props.build.soldierClass.id"
    :build="props.build"
    :label="tree.name"
    :fallback-name="props.build.soldierClass.name"
    :tiers="tiers"
    :default-item="featuredItem"
    :actions="mecBuildsStore"
    :encode="encodeMecBuild"
    :decode="decodeMecBuild"
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
