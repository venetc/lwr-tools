<script setup lang="ts">
import { SHIV_BUILD_NAME } from '@entities/shiv';
import { useBuildEditor } from '@features/manage-builds';
import { TieredPickerTierLabel } from '@shared/ui/tiered-picker';
import { BuildPanel } from '@widgets/build-calculator';

import { useShivBuildGroups } from '../model/shiv-build-groups';
import type { ShivBuild } from '../model/shiv-builds';
import { useShivBuildsStore } from '../model/shiv-builds';

interface Props {
  /** SHIV build to render and edit. */
  build: Readonly<ShivBuild>
}

const props = defineProps<Props>();

const shivBuildsStore = useShivBuildsStore();

const { rename, lock, replace, reset, remove } = useBuildEditor(() => props.build, shivBuildsStore);

const { groups, select } = useShivBuildGroups(() => props.build);
</script>

<template>
  <BuildPanel
    :build="props.build"
    :label="SHIV_BUILD_NAME"
    :fallback-name="SHIV_BUILD_NAME"
    kind="shiv"
    :groups="groups"
    @rename="rename"
    @lock="lock"
    @replace="replace"
    @reset="reset"
    @remove="remove"
    @select="select"
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
