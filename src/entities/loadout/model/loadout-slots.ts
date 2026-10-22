import type { DeepReadonly } from '@shared/lib/object';

import type { Loadout, LoadoutItemId, LoadoutSlot, LoadoutWearer } from './loadout';
import { loadoutSlots } from './loadout';
import type { LoadoutCatalogItem } from './loadout-items';
import { findLoadoutItem } from './loadout-items';

/**
 * Id of the item in a slot of the Loadout.
 *
 * @param loadout Loadout of the unit.
 * @param slot slot of the Loadout.
 * @returns the item id; null for an empty slot or a utility or Module slot the Loadout does not have.
 */
export const slotItemId = (loadout: Readonly<Loadout>, slot: LoadoutSlot): LoadoutItemId | null => {
  if (slot.kind === 'utility') return loadout.utility[slot.index] ?? null;

  if (slot.kind === 'module') return loadout.modules[slot.index] ?? null;

  return loadout[slot.kind];
};

/**
 * Puts armor or a SHIV type in the armor slot in place.
 *
 * @param loadout Loadout to change.
 * @param found item with its catalog; null to empty the slot, which armor never is.
 * @returns whether the item was put.
 */
const setArmor = (loadout: Loadout, found: DeepReadonly<LoadoutCatalogItem> | null) => {
  if (found?.kind !== 'armor' && found?.kind !== 'shiv-type') return false;

  loadout.armor = found.item.id;

  return true;
};

/**
 * Puts a weapon in a weapon slot in place, or empties the secondary slot.
 *
 * @param loadout Loadout to change.
 * @param slot primary or secondary slot.
 * @param found item with its catalog; null to empty the slot, which the primary one never is.
 * @returns whether the slot was changed.
 */
const setWeapon = (loadout: Loadout, slot: 'primary' | 'secondary', found: DeepReadonly<LoadoutCatalogItem> | null) => {
  if (!found && slot === 'secondary') {
    loadout.secondary = null;
    return true;
  }

  if (found?.kind !== 'weapon') return false;

  loadout[slot] = found.item.id;

  return true;
};

/**
 * Puts equipment in a utility or Module slot in place, or empties it.
 *
 * @param loadout Loadout to change.
 * @param slot utility or Module slot.
 * @param found item with its catalog; null to empty the slot.
 * @returns whether the slot was changed: never for a position the Loadout does not have.
 */
const setEquipment = (loadout: Loadout, slot: Extract<LoadoutSlot, { index: number }>, found: DeepReadonly<LoadoutCatalogItem> | null) => {
  const items = slot.kind === 'utility' ? loadout.utility : loadout.modules;

  if (slot.index < 0 || slot.index >= items.length) return false;

  if (found && found.kind !== 'equipment') return false;

  items[slot.index] = found ? found.item.id : null;

  return true;
};

/**
 * Puts the item in the slot of the Loadout in place, or empties the slot; the rules of the unit are not checked, which
 * `fitLoadout` does after.
 *
 * @param loadout Loadout to change.
 * @param slot slot of the Loadout.
 * @param id item id; null to empty the slot.
 * @returns whether the slot was changed: never for an unknown item, an item of another catalog than the slot's (the armor
 * slot takes armor and SHIV types alike, as the unit is not known here), a utility or Module slot the Loadout does not
 * have, or an empty armor or primary slot; the Loadout is then left as it was.
 */
export const setSlotItem = (loadout: Loadout, slot: LoadoutSlot, id: LoadoutItemId | null): boolean => {
  const found = id ? findLoadoutItem(id) : null;

  if (id && !found) return false;

  if (slot.kind === 'armor') return setArmor(loadout, found);

  if (slot.kind === 'primary' || slot.kind === 'secondary') return setWeapon(loadout, slot.kind, found);

  return setEquipment(loadout, slot, found);
};

/**
 * Whether the item of the slot can be taken off: never armor and the primary weapon, nor the secondary weapon of a slot
 * that is never empty (the rocket launcher of a Rocketeer).
 *
 * @param slot slot of the Loadout.
 * @param loadout Loadout of the unit.
 * @param wearer unit that carries the Loadout.
 */
export const isSlotRemovable = (slot: LoadoutSlot, loadout: Loadout, wearer: LoadoutWearer) => {
  if (slot.kind === 'armor' || slot.kind === 'primary') return false;

  if (slot.kind === 'secondary') return !loadoutSlots(loadout, wearer).isSecondaryRequired;

  return true;
};
