<script setup lang="ts">
import { useCssModule } from 'vue';

import type { UtilitySlotKind } from '@entities/loadout';

import { useSlotCaptionClass } from '../model/slot-caption';

interface Props {
  /** Slot caption. */
  caption: string
  /** Kind of the slot for its colour: a Gear Slot, a Psi Slot, or regular for any other slot. */
  tone: UtilitySlotKind
}

const props = defineProps<Props>();

const captionClass = useSlotCaptionClass(() => props.tone, useCssModule());
</script>

<template>
  <span :class="captionClass">{{ props.caption }}</span>
</template>

<style lang="scss" module src="./SlotCaption.scss" />
