import type { ArmorId, EquipmentId, LoadoutUnitId, ShivTypeId, WeaponId } from '@entities/loadout';

import { DEFAULT_SQUAD_ID, SQUAD_NAME } from '../config/constants';

/**
 * Build a Unit refers to: the Build calculator it belongs to and its id there.
 */
export interface SquadUnitBuild {
  /** Kind of the build: the unit type of its Build calculator. */
  kind: LoadoutUnitId
  /** Build id in its Build calculator. */
  id: string
}

/**
 * Loadout of a Unit as the Squad keeps it: an item of an unknown code leaves its slot empty, and the check of the Unit
 * fills the armor and primary weapon slots again.
 */
export interface UnitLoadout {
  /** Armor, MEC exoskeleton or, for a SHIV, its SHIV type; null until the check if its code is unknown. */
  armor: ArmorId | ShivTypeId | null
  /** Primary weapon; null until the check if its code is unknown. */
  primary: WeaponId | null
  /** Secondary weapon; null for an empty slot or a unit without one. */
  secondary: WeaponId | null
  /** Items of the utility slots by position, Gear Slots and Psi Slots last; null for an empty slot. */
  utility: (EquipmentId | null)[]
  /** Modules of a MEC by position; null for an empty slot. */
  modules: (EquipmentId | null)[]
}

/**
 * Unit of a Squad: a saved build with its own Loadout.
 */
export interface SquadUnit {
  /** Unit id, unique in the Squad: one build may stand in a Squad more than once. */
  id: string
  /** Build the Unit refers to. */
  build: SquadUnitBuild
  /** Items the Unit carries. */
  loadout: UnitLoadout
}

/**
 * Named set of Units with no size limit.
 */
export interface Squad {
  /** Squad id, unique in the Squad list. */
  id: string
  /** Squad name shown in the title and the toolbar list. */
  name: string
  /** Units in the order they were added. */
  units: SquadUnit[]
}

/**
 * New empty Squad.
 *
 * @param id Squad id.
 * @param name Squad name.
 */
export const createSquad = (id: string, name: string): Squad => ({ id, name, units: [] });

/**
 * Name of a new Squad: `Squad N` with the smallest number no Squad is named with.
 *
 * @param names names of the existing Squads.
 */
export const nextSquadName = (names: readonly string[]) => {
  const takenNames = new Set(names);
  let number = 1;

  while (takenNames.has(`${SQUAD_NAME} ${number}`)) number += 1;

  return `${SQUAD_NAME} ${number}`;
};

/**
 * Squads shown while nothing has been saved yet: one empty `Squad 1` with a fixed id.
 */
export const defaultSquads = () => [createSquad(DEFAULT_SQUAD_ID, nextSquadName([]))];
