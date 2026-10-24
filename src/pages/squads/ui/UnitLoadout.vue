<script setup lang="ts">
import { Dialog } from '@shared/ui/dialog';

import type { UnitCard } from '../model/unit-cards';
import { useUnitLoadout } from '../model/unit-loadout';
import LoadoutEditor from './LoadoutEditor.vue';
import LoadoutTiles from './LoadoutTiles.vue';

interface Props {
  /** Unit whose Loadout is shown and edited. */
  card: UnitCard
}

const props = defineProps<Props>();

const { isOpen, slotId, openSlot } = useUnitLoadout(() => props.card.isOutdated);
</script>

<template>
  <LoadoutTiles
    :tiles="props.card.tiles"
    :disabled="props.card.isOutdated"
    @select="openSlot"
  />

  <Dialog
    v-model:open="isOpen"
    title="Loadout"
    wide
  >
    <LoadoutEditor :card="props.card" :initial-slot-id="slotId" />
  </Dialog>
</template>
