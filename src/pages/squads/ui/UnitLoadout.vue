<script setup lang="ts">
import { Dialog } from '@shared/ui/dialog';

import type { UnitCard } from '../model/unit-cards';
import { useUnitLoadout } from '../model/unit-loadout';
import LoadoutTiles from './LoadoutTiles.vue';
import SlotLocker from './SlotLocker.vue';

interface Props {
  /** Unit whose Loadout is shown and edited. */
  card: UnitCard
}

const props = defineProps<Props>();

const { isOpen, tile, title, openSlot, close } = useUnitLoadout(() => props.card.isOutdated);
</script>

<template>
  <LoadoutTiles
    :tiles="props.card.tiles"
    :disabled="props.card.isOutdated"
    @select="openSlot"
  />

  <Dialog
    v-model:open="isOpen"
    :title="title"
    width="wide"
  >
    <SlotLocker
      v-if="tile"
      :card="props.card"
      :tile="tile"
      @close="close"
    />
  </Dialog>
</template>
