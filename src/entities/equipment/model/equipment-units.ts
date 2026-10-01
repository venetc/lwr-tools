import { EQUIPMENT_UNIT_CONTENT } from '../config/constants/equipment-unit-content';
import type unitsJson from '../config/data/units.json';

export type EquipmentUnitId = keyof typeof unitsJson;

/**
 * Unit type record of `units.json`.
 */
export interface EquipmentUnitContent {
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
export const isEquipmentUnitId = (id: string): id is EquipmentUnitId => Object.hasOwn(EQUIPMENT_UNIT_CONTENT, id);
