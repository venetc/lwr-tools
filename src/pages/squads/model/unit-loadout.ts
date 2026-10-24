import type { MaybeRefOrGetter } from 'vue';
import { ref, toValue } from 'vue';

import type { LoadoutTile } from './loadout-tiles';

/**
 * Loadout dialog of a Unit card: whether it is open and the tile it was opened from. The Loadout of a Unit of an
 * Outdated build is frozen until the update: its tiles open nothing.
 *
 * @param isFrozen whether the Loadout of the Unit is frozen.
 */
export const useUnitLoadout = (isFrozen: MaybeRefOrGetter<boolean>) => {
  const isOpen = ref(false);

  const slotId = ref('');

  /**
   * Opens the Loadout dialog on the slot of the tile, unless the Loadout is frozen.
   *
   * @param tile tile of the slot.
   */
  const openSlot = (tile: LoadoutTile) => {
    if (toValue(isFrozen)) return;

    slotId.value = tile.id;
    isOpen.value = true;
  };

  return { isOpen, slotId, openSlot };
};
