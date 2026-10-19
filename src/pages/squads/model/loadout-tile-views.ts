import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { UtilitySlotKind } from '@entities/loadout';

import type { LoadoutTile } from './loadout-tiles';

/**
 * Loadout tiles with their classes: size, empty or filled state and the caption colour of the slot kind.
 *
 * @param tiles tiles in inventory order.
 * @param style CSS module of the tiles.
 */
export const useLoadoutTileViews = (tiles: MaybeRefOrGetter<readonly LoadoutTile[]>, style: Record<string, string>) => {
  const captionToneClass: Record<UtilitySlotKind, string | undefined> = {
    'regular': style.regularCaption,
    'gear-slot': style.gearSlotCaption,
    'psi-slot': style.psiSlotCaption,
  };

  return computed(() => toValue(tiles).map(tile => ({
    tile,
    tileClass: [style.tile, tile.isLarge ? style.large : style.small, tile.item ? style.filled : style.empty],
    imageClass: tile.isLarge ? style.largeImage : style.smallImage,
    captionClass: [style.caption, captionToneClass[tile.tone]],
  })));
};
