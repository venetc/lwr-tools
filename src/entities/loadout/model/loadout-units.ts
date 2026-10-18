import { LOADOUT_UNIT_CONTENT } from '../config/constants/loadout-unit-content';
import type unitsJson from '../config/data/units.json';

export type LoadoutUnitId = keyof typeof unitsJson;

/**
 * Unit type record of `units.json`.
 */
export interface LoadoutUnitContent {
  /** Stable unit type number in share codes, from 1: a new unit type gets the maximum plus one; never changed or reused. */
  code: number
  /** Unit type name. */
  name: string
}

/**
 * Whether the string is a known unit type id.
 *
 * @param id unit type id candidate from the game data.
 */
export const isLoadoutUnitId = (id: string): id is LoadoutUnitId => Object.hasOwn(LOADOUT_UNIT_CONTENT, id);

/**
 * Unit type with its id.
 */
export interface LoadoutUnit extends LoadoutUnitContent {
  /** Unit type id, the key in `units.json`. */
  id: LoadoutUnitId
}

/**
 * Unit type of a `units.json` entry.
 *
 * @param entry unit type id and its record.
 */
export const loadoutUnitFromEntry = (entry: [LoadoutUnitId, LoadoutUnitContent]): LoadoutUnit => {
  const [id, content] = entry;

  return { ...content, id };
};
