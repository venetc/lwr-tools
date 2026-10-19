import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { LoadoutTile } from './loadout-tiles';

/**
 * Loadout tiles with their classes: the grid cell and the tile by size, and the empty or filled state.
 *
 * @param tiles tiles in inventory order.
 * @param style CSS module of the tiles.
 */
export const useLoadoutTileViews = (tiles: MaybeRefOrGetter<readonly LoadoutTile[]>, style: Record<string, string>) => {
  return computed(() => toValue(tiles).map(tile => ({
    tile,
    cellClass: tile.isLarge ? style.largeCell : style.smallCell,
    tileClass: [style.tile, tile.isLarge ? style.large : style.small, tile.item ? style.filled : style.empty],
    imageClass: tile.isLarge ? style.largeImage : style.smallImage,
  })));
};
