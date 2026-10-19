import type { DeepReadonly } from '@shared/lib/object';

import type { LoadoutRequirement } from '../../model/loadout-requirements';
import type { LoadoutUnitId } from '../../model/loadout-units';

/**
 * Biosoldier classes with their names, in the order the game lists them in Carriers: class pairs of the base classes
 * Marksman (Sniper, Scout), Weapons (Rocketeer, Gunner), Support (Medic, Engineer) and Tactical (Assault, Infantry).
 */
export const CARRIER_CLASSES: DeepReadonly<{ id: string, name: string }[]> = [
  { id: 'sniper', name: 'Sniper' },
  { id: 'scout', name: 'Scout' },
  { id: 'rocketeer', name: 'Rocketeer' },
  { id: 'gunner', name: 'Gunner' },
  { id: 'medic', name: 'Medic' },
  { id: 'engineer', name: 'Engineer' },
  { id: 'assault', name: 'Assault' },
  { id: 'infantry', name: 'Infantry' },
];

/** What joins the names of Carriers: 'Sniper/Scout', 'MEC/SHIV'. */
export const CARRIER_SEPARATOR = '/';

/** Most classes Carriers list by name; with more, they name the classes left out. */
export const CARRIER_LISTED_CLASS_LIMIT = 4;

/** Word between the unit and the classes left out: 'Biosoldier except Sniper/Gunner'. */
export const CARRIER_EXCEPT = 'except';

/** Carriers of an item with a requirement, by requirement: the requirement stands in place of the unit. */
export const CARRIER_REQUIREMENT_NAMES: DeepReadonly<Record<LoadoutRequirement, string>> = {
  'psionic': 'Psi Soldier',
  'gene-mod': 'Gene-Modded',
  'officer': 'Officer',
};

/** Names of the sets of unit types the game names as one: every unit type, and Biosoldier with MEC. */
export const CARRIER_UNIT_GROUPS: DeepReadonly<{ units: LoadoutUnitId[], name: string }[]> = [
  { units: ['biosoldier', 'mec', 'shiv'], name: 'All Units' },
  { units: ['biosoldier', 'mec'], name: 'Soldier' },
];
