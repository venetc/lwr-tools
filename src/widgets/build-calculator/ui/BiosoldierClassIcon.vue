<script setup lang="ts">
import { useCssModule } from 'vue';

import type { BiosoldierBuildData } from '@entities/soldier';

import { useBiosoldierClassIconLayers } from '../model/biosoldier-class-icon';

interface Props {
  /** Biosoldier build whose class icon takes the colours of its branches. */
  build: Readonly<BiosoldierBuildData>
}

const props = defineProps<Props>();

const layers = useBiosoldierClassIconLayers(() => props.build, useCssModule());
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
