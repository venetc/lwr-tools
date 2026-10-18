<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import type { BiosoldierBranchSet, BiosoldierBuildData } from '@entities/soldier';
import { biosoldierBuildBranchSet } from '@entities/soldier';

interface Props {
  /** Biosoldier build whose class icon takes the colours of its branches. */
  build: Readonly<BiosoldierBuildData>
}

const props = defineProps<Props>();

const style = useCssModule();

/** Classes of the stacked icon copies for each branch set: one whole icon, or the gene mod and psionic halves for both. */
const branchSetLayers: Record<BiosoldierBranchSet, (string | undefined)[][]> = {
  'plain': [[style.icon, style.plain]],
  'gene-mods': [[style.icon, style.geneMods]],
  'psionic': [[style.icon, style.psionic]],
  'both': [[style.icon, style.geneModHalf], [style.icon, style.psionicHalf]],
};

const layers = computed(() => branchSetLayers[biosoldierBuildBranchSet(props.build)]);
</script>

<template>
  <span :class="$style.root">
    <component
      :is="props.build.soldierClass.icon"
      v-for="(layerClasses, index) in layers"
      :key="index"
      :class="layerClasses"
      aria-hidden="true"
    />
  </span>
</template>

<style lang="scss" module src="./BiosoldierClassIcon.scss" />
