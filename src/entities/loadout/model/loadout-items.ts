import type { DeepReadonly } from '@shared/lib/object';

import { LOADOUT_CATALOG_ITEM_BY_ID, LOADOUT_CATALOG_ITEMS } from '../config/constants/loadout-catalog-items';
import type { Armor } from './armors';
import type { Equipment } from './equipment';
import type { LoadoutItemId, LoadoutSlot } from './loadout';
import type { LoadoutUnitId } from './loadout-units';
import type { ShivType } from './shiv-types';
import type { Weapon } from './weapons';

/**
 * Item of any Loadout catalog with the kind of its catalog.
 */
export type LoadoutCatalogItem
  = | { kind: 'armor', item: DeepReadonly<Armor> }
    | { kind: 'shiv-type', item: DeepReadonly<ShivType> }
    | { kind: 'weapon', item: DeepReadonly<Weapon> }
    | { kind: 'equipment', item: DeepReadonly<Equipment> };

export type LoadoutCatalogKind = LoadoutCatalogItem['kind'];

/**
 * Catalog a slot takes its items from: SHIV types for the armor slot of a SHIV, armor and MEC exoskeletons for that of
 * any other unit, weapons for weapon slots, equipment and Modules for utility and Module slots.
 *
 * @param slot slot of the Loadout.
 * @param unit unit type that carries the Loadout.
 */
export const slotCatalogKind = (slot: LoadoutSlot, unit: LoadoutUnitId): LoadoutCatalogKind => {
  if (slot.kind === 'armor') return unit === 'shiv' ? 'shiv-type' : 'armor';

  if (slot.kind === 'primary' || slot.kind === 'secondary') return 'weapon';

  return 'equipment';
};

/**
 * Item of any Loadout catalog by id: armor, SHIV type, weapon, or equipment and Modules.
 *
 * @param id item id.
 * @returns the item with its catalog; null for an id missing from every catalog.
 */
export const findLoadoutItem = (id: LoadoutItemId): DeepReadonly<LoadoutCatalogItem> | null => LOADOUT_CATALOG_ITEM_BY_ID.get(id) ?? null;

/**
 * Every item of the catalog the slot takes from, in game data order, those of other unit types and slots included.
 *
 * @param slot slot of the Loadout.
 * @param unit unit type that carries the Loadout.
 */
export const slotItems = (slot: LoadoutSlot, unit: LoadoutUnitId) => LOADOUT_CATALOG_ITEMS[slotCatalogKind(slot, unit)];
