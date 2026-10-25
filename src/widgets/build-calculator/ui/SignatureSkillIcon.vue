<script setup lang="ts">
import type { SoldierBuildData } from '@entities/soldier';
import { LoadingImage } from '@shared/ui/loading-image';

import { useSignatureSkillIcon } from '../model/signature-skill-icon';

interface Props {
  /** Biosoldier or MEC build of the row, saved or read from a Share code; without a Signature skill the box stays empty. */
  build: Readonly<SoldierBuildData>
}

const props = defineProps<Props>();

const icon = useSignatureSkillIcon(() => props.build);
</script>

<template>
  <span :class="$style.root">
    <LoadingImage
      v-if="icon"
      :class="$style.image"
      :src="icon.src"
      :placeholder="icon.placeholder"
      :alt="icon.alt"
      :title="icon.name"
    />
  </span>
</template>

<style lang="scss" module src="./SignatureSkillIcon.scss" />
