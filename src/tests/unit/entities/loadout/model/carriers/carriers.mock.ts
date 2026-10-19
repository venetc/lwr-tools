import type { CarriedItem } from '@entities/loadout/model/carriers';

/** A Weapon every Biosoldier may carry. */
export const ANY_BIOSOLDIER_WEAPON: CarriedItem = { unit: 'biosoldier', classes: null };

/** Equipment four biosoldier classes may carry, ids out of the game order. */
export const FOUR_CLASS_EQUIPMENT: CarriedItem = { units: ['biosoldier'], classes: ['gunner', 'rocketeer', 'scout', 'sniper'], requires: null };

/** A Weapon five biosoldier classes may carry: all but Sniper, Rocketeer and Gunner. */
export const FIVE_CLASS_WEAPON: CarriedItem = { unit: 'biosoldier', classes: ['scout', 'infantry', 'assault', 'medic', 'engineer'] };

/** Equipment that needs a Psionic ability. */
export const PSIONIC_EQUIPMENT: CarriedItem = { units: ['biosoldier'], classes: null, requires: 'psionic' };

/** Equipment every unit type may carry. */
export const ALL_UNITS_EQUIPMENT: CarriedItem = { units: ['biosoldier', 'mec', 'shiv'], classes: null, requires: null };

/** Equipment MECs and SHIVs may carry. */
export const MEC_SHIV_EQUIPMENT: CarriedItem = { units: ['mec', 'shiv'], classes: null, requires: null };

/** Armor that needs a Gene mod. */
export const GENE_MOD_ARMOR: CarriedItem = { unit: 'biosoldier', requires: 'gene-mod' };

/** Armor only an Officer may wear. */
export const OFFICER_ARMOR: CarriedItem = { unit: 'biosoldier', requires: 'officer' };

/** Equipment Biosoldiers and MECs may carry. */
export const SOLDIER_EQUIPMENT: CarriedItem = { units: ['biosoldier', 'mec'], classes: null, requires: null };

/** A Weapon of MECs. */
export const MEC_WEAPON: CarriedItem = { unit: 'mec', classes: null };

/** A Weapon of SHIVs. */
export const SHIV_WEAPON: CarriedItem = { unit: 'shiv', classes: null };

/** Equipment of one biosoldier class. */
export const ONE_CLASS_EQUIPMENT: CarriedItem = { units: ['biosoldier'], classes: ['engineer'], requires: null };

/** A pistol: every class but Rocketeer and Gunner, which have no pistol slot. */
export const PISTOL: CarriedItem = { unit: 'biosoldier', classes: ['sniper', 'scout', 'infantry', 'assault', 'medic', 'engineer'] };

/** Equipment that lists every biosoldier class. */
export const EVERY_CLASS_EQUIPMENT: CarriedItem = {
  units: ['biosoldier'],
  classes: ['sniper', 'scout', 'infantry', 'assault', 'gunner', 'rocketeer', 'medic', 'engineer'],
  requires: null,
};
