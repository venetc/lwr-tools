import { ARMOR_ID_BY_CODE } from '../config/constants/armors';
import { EQUIPMENT_ID_BY_CODE } from '../config/constants/equipment';
import { SHIV_TYPE_ID_BY_CODE } from '../config/constants/shiv-types';
import { WEAPON_ID_BY_CODE } from '../config/constants/weapons';
import type { Loadout, LoadoutItemId, LoadoutSlot } from './loadout';
import { findLoadoutItem, slotCatalogKind } from './loadout-items';
import type { LoadoutUnitId } from './loadout-units';

/**
 * Loadout whose armor and primary weapon may be missing until the Unit check fills them again: as it is kept between
 * visits, where an item of an unknown code leaves its slot empty.
 */
export interface DecodedLoadout extends Omit<Loadout, 'armor' | 'primary'> {
  /** Armor, MEC exoskeleton or, for a SHIV, its SHIV type; null until the Unit check if its code is unknown. */
  armor: Loadout['armor'] | null
  /** Primary weapon; null until the Unit check if its code is unknown. */
  primary: Loadout['primary'] | null
}

/**
 * Loadout as stable item codes, in the shape of the Loadout.
 */
export interface LoadoutCodes {
  /** Code of the armor, MEC exoskeleton or, for a SHIV, its SHIV type; null if none. */
  armor: number | null
  /** Code of the primary weapon; null if none. */
  primary: number | null
  /** Code of the secondary weapon; null for an empty slot or a unit without one. */
  secondary: number | null
  /** Codes of the utility slots by position; null for an empty slot. */
  utility: (number | null)[]
  /** Codes of the Module slots by position; null for an empty slot. */
  modules: (number | null)[]
}

/**
 * Code of an item in the catalog of its slot.
 *
 * @param id item id; null for an empty slot.
 * @param slot slot of the item.
 * @param unit unit type that carries the Loadout.
 * @returns the code; null for an empty slot or an item missing from the catalog of the slot.
 */
const slotItemCode = (id: LoadoutItemId | null, slot: LoadoutSlot, unit: LoadoutUnitId) => {
  const found = id ? findLoadoutItem(id) : null;

  if (found?.kind !== slotCatalogKind(slot, unit)) return null;

  return found.item.code;
};

/**
 * Item id of a code in a catalog.
 *
 * @param idByCode item ids of the catalog by code.
 * @param code item code; null for an empty slot.
 * @returns the id; null for an empty slot or a code missing from the catalog.
 */
const codeItemId = <Id extends LoadoutItemId>(idByCode: ReadonlyMap<number, Id>, code: number | null) => {
  if (code === null) return null;

  return idByCode.get(code) ?? null;
};

/**
 * Loadout as stable item codes; a SHIV keeps the code of its SHIV type in the armor slot.
 *
 * @param loadout Loadout of the unit.
 * @param unit unit type that carries the Loadout.
 */
export const loadoutCodes = (loadout: Readonly<DecodedLoadout>, unit: LoadoutUnitId): LoadoutCodes => ({
  armor: slotItemCode(loadout.armor, { kind: 'armor' }, unit),
  primary: slotItemCode(loadout.primary, { kind: 'primary' }, unit),
  secondary: slotItemCode(loadout.secondary, { kind: 'secondary' }, unit),
  utility: loadout.utility.map((id, index) => slotItemCode(id, { kind: 'utility', index }, unit)),
  modules: loadout.modules.map((id, index) => slotItemCode(id, { kind: 'module', index }, unit)),
});

/**
 * Loadout of stable item codes; an unknown code leaves its slot empty, armor and the primary weapon included.
 *
 * @param codes item codes by slot.
 * @param unit unit type that carries the Loadout; the armor code of a SHIV is read as a SHIV type.
 */
export const loadoutFromCodes = (codes: Readonly<LoadoutCodes>, unit: LoadoutUnitId): DecodedLoadout => {
  const armorIdByCode = slotCatalogKind({ kind: 'armor' }, unit) === 'shiv-type' ? SHIV_TYPE_ID_BY_CODE : ARMOR_ID_BY_CODE;

  return {
    armor: codeItemId(armorIdByCode, codes.armor),
    primary: codeItemId(WEAPON_ID_BY_CODE, codes.primary),
    secondary: codeItemId(WEAPON_ID_BY_CODE, codes.secondary),
    utility: codes.utility.map(code => codeItemId(EQUIPMENT_ID_BY_CODE, code)),
    modules: codes.modules.map(code => codeItemId(EQUIPMENT_ID_BY_CODE, code)),
  };
};
