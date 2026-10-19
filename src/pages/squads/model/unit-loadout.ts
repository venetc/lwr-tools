import { ref } from 'vue';

import type { LoadoutTile } from './loadout-tiles';

/**
 * Loadout dialog of a Unit card: whether it is open and the tile it was opened from.
 */
export const useUnitLoadout = () => {
  const isOpen = ref(false);

  const slotId = ref('');

  /**
   * Opens the Loadout dialog on the slot of the tile.
   *
   * @param tile tile of the slot.
   */
  const openSlot = (tile: LoadoutTile) => {
    slotId.value = tile.id;
    isOpen.value = true;
  };

  return { isOpen, slotId, openSlot };
};
