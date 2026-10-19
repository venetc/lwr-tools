import type { Armor, Equipment, LoadoutItemId, ShivType, Weapon } from '@entities/loadout';
import { ARMOR_BY_ID, EQUIPMENT_BY_ID, SHIV_TYPE_BY_ID, WEAPON_BY_ID } from '@entities/loadout';
import type { DeepReadonly } from '@shared/lib/object';

/**
 * Item of any Loadout catalog with the kind of its catalog.
 */
export type LoadoutCatalogItem
  = | { kind: 'armor', item: DeepReadonly<Armor> }
    | { kind: 'shiv-type', item: DeepReadonly<ShivType> }
    | { kind: 'weapon', item: DeepReadonly<Weapon> }
    | { kind: 'equipment', item: DeepReadonly<Equipment> };

/**
 * Item of any Loadout catalog by id: armor, SHIV type, weapon, or equipment and Modules.
 *
 * @param id item id.
 * @returns the item with its catalog; null for an id missing from every catalog.
 */
export const findLoadoutItem = (id: LoadoutItemId): LoadoutCatalogItem | null => {
  const armor = ARMOR_BY_ID.get(id);

  if (armor) return { kind: 'armor', item: armor };

  const shivType = SHIV_TYPE_BY_ID.get(id);

  if (shivType) return { kind: 'shiv-type', item: shivType };

  const weapon = WEAPON_BY_ID.get(id);

  if (weapon) return { kind: 'weapon', item: weapon };

  const equipment = EQUIPMENT_BY_ID.get(id);

  if (equipment) return { kind: 'equipment', item: equipment };

  return null;
};
