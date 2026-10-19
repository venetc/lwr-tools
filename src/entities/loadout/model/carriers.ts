import {
  CARRIER_CLASSES,
  CARRIER_EXCEPT,
  CARRIER_LISTED_CLASS_LIMIT,
  CARRIER_REQUIREMENT_NAMES,
  CARRIER_SEPARATOR,
  CARRIER_UNIT_GROUPS,
} from '../config/constants/carriers';
import { LOADOUT_UNITS } from '../config/constants/loadout-units';
import type { LoadoutRequirement } from './loadout-requirements';
import type { LoadoutUnitId } from './loadout-units';

/**
 * Fields of an item that say who may carry it: a Weapon (one unit type, classes), Armor (one unit type, requirement)
 * or Equipment (unit types, classes, requirement).
 */
export type CarriedItem
  = | {
    /** Id of the unit type that uses the weapon. */
    unit: LoadoutUnitId
    /** Ids of the biosoldier classes that may equip the weapon; null if every class of the unit may. */
    classes: readonly string[] | null
  }
  | {
    /** Id of the unit type that wears the armor. */
    unit: LoadoutUnitId
    /** What the wearer needs besides the unit; null if nothing. */
    requires: LoadoutRequirement | null
  }
  | {
    /** Ids of the unit types that may carry the item. */
    units: readonly LoadoutUnitId[]
    /** Ids of the biosoldier classes that may carry the item; null if every class may. */
    classes: readonly string[] | null
    /** What the carrier needs besides the unit and class; null if nothing. */
    requires: LoadoutRequirement | null
  };

/**
 * Carriers of an item as the game shows them on its stat line: 'Biosoldier', 'Sniper/Scout',
 * 'Biosoldier except Sniper/Gunner', 'Psi Soldier', 'MEC/SHIV', 'All Units'.
 *
 * @param item Weapon, Armor or Equipment.
 */
export const itemCarriers = (item: CarriedItem): string => {
  const requires = 'requires' in item ? item.requires : null;

  if (requires) return CARRIER_REQUIREMENT_NAMES[requires];

  const units = 'units' in item ? item.units : [item.unit];
  const group = CARRIER_UNIT_GROUPS.find(candidate => candidate.units.length === units.length && candidate.units.every(unit => units.includes(unit)));

  if (group) return group.name;

  const unitNames = LOADOUT_UNITS.filter(unit => units.includes(unit.id)).map(unit => unit.name).join(CARRIER_SEPARATOR);
  const classes = 'classes' in item ? item.classes : null;

  if (!classes || units.length !== 1) return unitNames;

  const listed = CARRIER_CLASSES.filter(carrierClass => classes.includes(carrierClass.id)).map(carrierClass => carrierClass.name);
  const leftOut = CARRIER_CLASSES.filter(carrierClass => !classes.includes(carrierClass.id)).map(carrierClass => carrierClass.name);

  if (leftOut.length === 0) return unitNames;

  if (listed.length <= CARRIER_LISTED_CLASS_LIMIT) return listed.join(CARRIER_SEPARATOR);

  return `${unitNames} ${CARRIER_EXCEPT} ${leftOut.join(CARRIER_SEPARATOR)}`;
};
