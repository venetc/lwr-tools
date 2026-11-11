import type { MaybeRefOrGetter } from 'vue';
import { computed, ref, shallowRef, toValue } from 'vue';

import type { LoadoutTile } from './loadout-tiles';

/**
 * Locker dialog of a Unit card: whether it is open and the tile of the slot it shows, titled with the slot caption.
 * The dialog keeps the tile it was opened from, so a change that removes the slot leaves it whole while it closes.
 * The Loadout of a Unit of an Outdated build is frozen until the update: its tiles open nothing.
 *
 * @param isFrozen whether the Loadout of the Unit is frozen.
 */
export const useUnitLoadout = (isFrozen: MaybeRefOrGetter<boolean>) => {
  const isOpen = ref(false);

  const tile = shallowRef<LoadoutTile | null>(null);

  const title = computed(() => tile.value?.caption ?? '');

  /**
   * Opens the Locker of the slot of the tile, unless the Loadout is frozen.
   *
   * @param selected tile of the slot.
   */
  const openSlot = (selected: LoadoutTile) => {
    if (toValue(isFrozen)) return;

    tile.value = selected;
    isOpen.value = true;
  };

  /**
   * Closes the Locker dialog.
   */
  const close = () => {
    isOpen.value = false;
  };

  return { isOpen, tile, title, openSlot, close };
};
