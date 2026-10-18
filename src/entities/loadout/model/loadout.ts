import type { DeepReadonly } from '@shared/lib/object';

import { ARMOR_BY_ID, ARMORS } from '../config/constants/armors';
import { EQUIPMENT_BY_ID } from '../config/constants/equipment';
import type { LOADOUT_BLOCK_REASONS } from '../config/constants/loadout-rules';
import { ARMORS_WITHOUT_TACTICAL_RIGGING, MAX_UTILITY_SLOTS, REQUIRED_SECONDARY_WEAPON_TYPES, TACTICAL_RIGGING_SLOTS } from '../config/constants/loadout-rules';
import { SHIV_TYPE_BY_ID, SHIV_TYPES } from '../config/constants/shiv-types';
import { WEAPON_BY_ID, WEAPONS } from '../config/constants/weapons';
import type { ArmorId } from './armors';
import type { Equipment, EquipmentId } from './equipment';
import type { LoadoutRequirement } from './loadout-requirements';
import type { LoadoutUnitId } from './loadout-units';
import type { ShivTypeId } from './shiv-types';
import { isShivTypeId } from './shiv-types';
import type { WeaponId } from './weapons';

/**
 * What the Loadout rules need to know about the unit that carries it.
 */
export interface LoadoutWearer {
  /** Unit type id. */
  unit: LoadoutUnitId
  /** Id of the biosoldier class or MEC class; null for a SHIV. */
  classId: string | null
  /** Whether the unit has at least one Gene mod, Neural Damping included. */
  hasGeneMod: boolean
  /** Whether the unit has at least one Psionic ability. */
  hasPsionicAbility: boolean
  /** Whether the unit is marked as an Officer; it counts only while the unit may be one. */
  isOfficer: boolean
}

/**
 * Items a unit carries, by slot.
 */
export interface Loadout {
  /** Armor, MEC exoskeleton or, for a SHIV, its SHIV type; never empty. */
  armor: ArmorId | ShivTypeId
  /** Primary weapon; never empty. */
  primary: WeaponId
  /** Secondary weapon; null for an empty slot or a unit without one. */
  secondary: WeaponId | null
  /** Items of the utility slots by position, Mounts last; null for an empty slot. */
  utility: (EquipmentId | null)[]
  /** Modules of a MEC by position; null for an empty slot. */
  modules: (EquipmentId | null)[]
}

export type LoadoutItemId = ArmorId | ShivTypeId | WeaponId | EquipmentId;

export type LoadoutSlotKind = 'armor' | 'primary' | 'secondary' | 'utility' | 'module';

/**
 * One slot of a Loadout: armor and weapon slots by kind, utility and Module slots by position.
 */
export type LoadoutSlot = { kind: 'armor' } | { kind: 'primary' } | { kind: 'secondary' } | { kind: 'utility', index: number } | { kind: 'module', index: number };

export type UtilitySlotKind = 'regular' | 'gear-mount' | 'psi-mount';

export type LoadoutBlockReason = typeof LOADOUT_BLOCK_REASONS[number];

/**
 * Slots a unit has with its armor and primary weapon.
 */
export interface LoadoutSlots {
  /** Whether the unit has a secondary weapon slot. */
  hasSecondary: boolean
  /** Whether the secondary weapon slot is never empty. */
  isSecondaryRequired: boolean
  /** Kinds of the utility slots by position. */
  utility: UtilitySlotKind[]
  /** Number of Module slots. */
  moduleCount: number
}

/**
 * Whether an item limited to the given classes fits the class.
 *
 * @param classes ids of the classes that may carry the item; null if every class may.
 * @param classId class of the wearer; null for a unit without one.
 */
const isClassAllowed = (classes: readonly string[] | null, classId: string | null) => classes === null || (classId !== null && classes.includes(classId));

/**
 * Kinds of the utility slots of a unit with the given armor and primary weapon.
 *
 * @description Regular slots are those of the armor without its Mounts, plus Tactical Rigging on biosoldier armor
 * that has no rigging of its own, plus the slots the primary weapon takes away (LMG, Stun Rifle); never below zero.
 * Mounts follow them, and all slots together are capped.
 *
 * @param loadout armor and primary weapon of the unit.
 */
const utilitySlotKinds = (loadout: Pick<Loadout, 'armor' | 'primary'>): UtilitySlotKind[] => {
  const armor = ARMOR_BY_ID.get(loadout.armor);
  const shivType = SHIV_TYPE_BY_ID.get(loadout.armor);
  const primary = WEAPON_BY_ID.get(loadout.primary);
  const gearMounts = armor?.gearMountSlots ?? 0;
  const psiMounts = armor?.psiMountSlots ?? 0;
  const hasRigging = armor?.unit === 'biosoldier' && !ARMORS_WITHOUT_TACTICAL_RIGGING.includes(armor.id);
  const armorRegular = (armor?.utilitySlots ?? shivType?.utilitySlots ?? 0) - gearMounts - psiMounts;
  const regular = Math.max(0, armorRegular + (hasRigging ? TACTICAL_RIGGING_SLOTS : 0) + (primary?.utilitySlots ?? 0));

  return [
    ...Array.from<UtilitySlotKind>({ length: Math.min(regular, MAX_UTILITY_SLOTS - gearMounts - psiMounts) }).fill('regular'),
    ...Array.from<UtilitySlotKind>({ length: gearMounts }).fill('gear-mount'),
    ...Array.from<UtilitySlotKind>({ length: psiMounts }).fill('psi-mount'),
  ];
};

/**
 * Slots of a unit with the given armor and primary weapon: utility slots as `utilitySlotKinds` counts them, Module slots
 * of a MEC exoskeleton, and a secondary slot if the class can carry any secondary weapon.
 *
 * @param loadout armor and primary weapon of the unit.
 * @param wearer unit that carries the Loadout.
 */
export const loadoutSlots = (loadout: Pick<Loadout, 'armor' | 'primary'>, wearer: LoadoutWearer): LoadoutSlots => {
  const armor = ARMOR_BY_ID.get(loadout.armor);
  const secondaries = WEAPONS.filter(weapon => weapon.slot === 'secondary' && weapon.unit === wearer.unit && isClassAllowed(weapon.classes, wearer.classId));

  return {
    hasSecondary: secondaries.length > 0,
    isSecondaryRequired: secondaries.some(weapon => REQUIRED_SECONDARY_WEAPON_TYPES.includes(weapon.type)),
    utility: utilitySlotKinds(loadout),
    moduleCount: armor?.moduleSlots ?? 0,
  };
};

/**
 * Whether the unit may be an Officer: only a biosoldier without Gene mods and Psionic abilities.
 *
 * @param wearer unit to check.
 */
export const canBeOfficer = (wearer: LoadoutWearer) => wearer.unit === 'biosoldier' && !wearer.hasGeneMod && !wearer.hasPsionicAbility;

/**
 * Reasons the wearer does not meet the requirement of an item.
 *
 * @param requires what the item needs besides the unit and class; null if nothing.
 * @param wearer unit that carries the Loadout.
 */
const requirementReasons = (requires: LoadoutRequirement | null, wearer: LoadoutWearer): [LoadoutBlockReason, boolean][] => [
  ['needs-gene-mod', requires === 'gene-mod' && !wearer.hasGeneMod],
  ['needs-psionic', requires === 'psionic' && !wearer.hasPsionicAbility],
  ['needs-officer', requires === 'officer' && !(wearer.isOfficer && canBeOfficer(wearer))],
];

/**
 * Reasons that hold, in the order of the checks.
 *
 * @param checks reasons with whether each holds.
 */
const heldReasons = (checks: [LoadoutBlockReason, boolean][]) => checks.filter(([, isHeld]) => isHeld).map(([reason]) => reason);

/**
 * Reasons armor or a SHIV type does not fit the armor slot.
 *
 * @param item armor or SHIV type id.
 * @param wearer unit that carries the Loadout.
 */
const armorReasons = (item: LoadoutItemId, wearer: LoadoutWearer): LoadoutBlockReason[] => {
  if (wearer.unit === 'shiv') return isShivTypeId(item) ? [] : ['wrong-unit'];

  const armor = ARMOR_BY_ID.get(item);

  if (armor?.unit !== wearer.unit) return ['wrong-unit'];

  return heldReasons(requirementReasons(armor.requires, wearer));
};

/**
 * Reasons a weapon does not fit a weapon slot.
 *
 * @param item weapon id.
 * @param slot primary or secondary slot.
 * @param wearer unit that carries the Loadout.
 */
const weaponReasons = (item: LoadoutItemId, slot: 'primary' | 'secondary', wearer: LoadoutWearer): LoadoutBlockReason[] => {
  const weapon = WEAPON_BY_ID.get(item);

  if (weapon?.unit !== wearer.unit || weapon.slot !== slot) return ['wrong-unit'];

  return heldReasons([['class-limited', !isClassAllowed(weapon.classes, wearer.classId)]]);
};

/**
 * Whether a Mount holds the item; a regular slot holds any.
 *
 * @param kind kind of the utility slot.
 * @param item equipment in the slot.
 */
export const isMountHolding = (kind: UtilitySlotKind, item: DeepReadonly<Equipment>) => {
  if (kind === 'gear-mount') return item.isPassive;

  if (kind === 'psi-mount') return item.isPassive && item.requires === 'psionic';

  return true;
};

/**
 * Reasons equipment does not fit a utility or Module slot.
 *
 * @param item equipment id.
 * @param slot utility or Module slot.
 * @param loadout Loadout the item goes to; the item in the slot itself is replaced.
 * @param wearer unit that carries the Loadout.
 */
const equipmentReasons = (item: LoadoutItemId, slot: Extract<LoadoutSlot, { index: number }>, loadout: Loadout, wearer: LoadoutWearer): LoadoutBlockReason[] => {
  const equipment = EQUIPMENT_BY_ID.get(item);

  const armor = ARMOR_BY_ID.get(loadout.armor);
  const utilityKinds = utilitySlotKinds(loadout);
  const slotCount = slot.kind === 'utility' ? utilityKinds.length : armor?.moduleSlots ?? 0;
  const isSlotMissing = slot.index < 0 || slot.index >= slotCount;

  if (!equipment || !equipment.units.includes(wearer.unit) || equipment.slot !== slot.kind || isSlotMissing) return ['wrong-unit'];

  const others = [
    ...loadout.utility.filter((_, index) => slot.kind !== 'utility' || index !== slot.index),
    ...loadout.modules.filter((_, index) => slot.kind !== 'module' || index !== slot.index),
  ].filter(id => id !== null);
  const primary = WEAPON_BY_ID.get(loadout.primary);
  const slotKind = slot.kind === 'utility' ? utilityKinds[slot.index] ?? 'regular' : 'regular';
  const isTierSupported = equipment.primaryTiers === null || (primary ? equipment.primaryTiers.includes(primary.tier) : false);
  const isTypeSupported = equipment.primaryTypes === null || (primary ? equipment.primaryTypes.includes(primary.type) : false);

  return heldReasons([
    ['class-limited', !isClassAllowed(equipment.classes, wearer.classId)],
    ...requirementReasons(equipment.requires, wearer),
    ['max-one', others.includes(equipment.id)],
    ['cant-stack', equipment.stackGroup !== null && others.some(id => id !== equipment.id && EQUIPMENT_BY_ID.get(id)?.stackGroup === equipment.stackGroup)],
    ['unsupported-weapon', !isTierSupported || !isTypeSupported],
    ['needs-module', equipment.requiredModule !== null && !loadout.modules.includes(equipment.requiredModule)],
    ['gear-mount-passive-only', slotKind === 'gear-mount' && !isMountHolding(slotKind, equipment)],
    ['psi-mount-psi-only', slotKind === 'psi-mount' && !isMountHolding(slotKind, equipment)],
  ]);
};

/**
 * Why an item does not fit a slot of the Loadout.
 *
 * @param item armor, SHIV type, weapon or equipment id.
 * @param slot slot the item goes to; the item already in it is replaced.
 * @param loadout Loadout of the unit.
 * @param wearer unit that carries the Loadout.
 * @returns reasons in the order of `LOADOUT_BLOCK_REASONS`; empty if the item fits. `wrong-unit` comes alone, also for a
 * utility or Module slot the unit does not have.
 */
export const blockReasons = (item: LoadoutItemId, slot: LoadoutSlot, loadout: Loadout, wearer: LoadoutWearer): LoadoutBlockReason[] => {
  if (slot.kind === 'armor') return armorReasons(item, wearer);

  if (slot.kind === 'primary' || slot.kind === 'secondary') return weaponReasons(item, slot.kind, wearer);

  return equipmentReasons(item, slot, loadout, wearer);
};

/**
 * Loadout of a new unit: the first fitting item by code in each slot that is never empty, the other slots empty.
 *
 * @param wearer unit that carries the Loadout.
 * @returns the Loadout, or null if no armor or primary weapon fits the unit.
 */
export const defaultLoadout = (wearer: LoadoutWearer): Loadout | null => {
  const armor = ARMORS.find(item => armorReasons(item.id, wearer).length === 0)?.id
    ?? SHIV_TYPES.find(item => armorReasons(item.id, wearer).length === 0)?.id
    ?? null;
  const primary = WEAPONS.find(weapon => weaponReasons(weapon.id, 'primary', wearer).length === 0)?.id ?? null;

  if (armor === null || primary === null) return null;

  const slots = loadoutSlots({ armor, primary }, wearer);
  const secondary = WEAPONS.find(weapon => weaponReasons(weapon.id, 'secondary', wearer).length === 0)?.id ?? null;

  return {
    armor,
    primary,
    secondary: slots.isSecondaryRequired ? secondary : null,
    utility: slots.utility.map(() => null),
    modules: Array.from<EquipmentId | null>({ length: slots.moduleCount }).fill(null),
  };
};
