import type { DeepReadonly } from '@shared/lib/object';

import type { LoadoutItemId } from '../../model/loadout';
import type { LoadoutCatalogItem, LoadoutCatalogKind } from '../../model/loadout-items';
import { ARMORS } from './armors';
import { EQUIPMENT } from './equipment';
import { SHIV_TYPES } from './shiv-types';
import { WEAPONS } from './weapons';

/** Items of each Loadout catalog with the kind of their catalog, in game data order. */
export const LOADOUT_CATALOG_ITEMS: DeepReadonly<Record<LoadoutCatalogKind, LoadoutCatalogItem[]>> = {
  'armor': ARMORS.map(item => ({ kind: 'armor', item })),
  'shiv-type': SHIV_TYPES.map(item => ({ kind: 'shiv-type', item })),
  'weapon': WEAPONS.map(item => ({ kind: 'weapon', item })),
  'equipment': EQUIPMENT.map(item => ({ kind: 'equipment', item })),
};

/** Items of every Loadout catalog with the kind of their catalog, by item id; ids never repeat across the catalogs. */
export const LOADOUT_CATALOG_ITEM_BY_ID: ReadonlyMap<LoadoutItemId, DeepReadonly<LoadoutCatalogItem>> = new Map(
  Object.values(LOADOUT_CATALOG_ITEMS).flat().map(found => [found.item.id, found]),
);
