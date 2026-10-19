import { EQUIPMENT_SLOTS, EQUIPMENT_STACK_GROUPS } from '../config/constants/equipment-categories';
import { EQUIPMENT_CONTENT } from '../config/constants/equipment-content';
import { EQUIPMENT_ICON } from '../config/constants/equipment-icons';
import type equipmentJson from '../config/data/equipment.json';
import type { LoadoutAbility } from './loadout-abilities';
import { isLoadoutAbilityId, loadoutAbilityById } from './loadout-abilities';
import type { LoadoutRequirement } from './loadout-requirements';
import { isLoadoutRequirement } from './loadout-requirements';
import type { LoadoutUnitId } from './loadout-units';
import { isLoadoutUnitId } from './loadout-units';
import type { WeaponTier, WeaponType } from './weapons';
import { isWeaponTier, isWeaponType } from './weapons';

export type EquipmentId = keyof typeof equipmentJson;

export type EquipmentSlot = typeof EQUIPMENT_SLOTS[number];

export type EquipmentStackGroup = typeof EQUIPMENT_STACK_GROUPS[number];

/**
 * One part of the stat line of an item, as the game writes it: "Aim: +5" or "Weightless".
 */
export interface EquipmentStat {
  /** Stat name. */
  name: string
  /** Stat value as text; empty for a stat without a value. */
  value: string
}

/**
 * Equipment or Module record of `equipment.json`.
 */
export interface EquipmentContent {
  /** Stable item number in share codes, from 1: a new item gets the maximum plus one; never changed or reused. */
  code: number
  /** Ids of the unit types that may carry the item. */
  units: readonly string[]
  /** Loadout slot. */
  slot: string
  /** Item name. */
  name: string
  /** Ids of the biosoldier classes that may carry the item; absent if every class may. */
  classes?: readonly string[]
  /** What the carrier needs besides the unit and class; absent if nothing. */
  requires?: string
  /** Whether the item is passive gear, the only kind a Gear Slot holds; absent if it is not. */
  isPassive?: boolean
  /** Group of items that do not stack; absent if the item stacks with any other. */
  stackGroup?: string
  /** Technology tiers of the primary weapon the item works with; absent if any. */
  primaryTiers?: readonly string[]
  /** Types of the primary weapon the item works with; absent if any. */
  primaryTypes?: readonly string[]
  /** Id of the Module the item needs in the same Loadout; absent if none. */
  requiredModule?: string
  /** Stat line of the item text. */
  stats: readonly EquipmentStat[]
  /** Tactical info text from the game; absent if the game gives none. */
  info?: string
  /** Ids of the non-perk abilities the item grants. */
  grants?: readonly string[]
}

/**
 * Equipment or Module with its id, image, granted abilities and checked categories and references.
 */
export interface Equipment extends Omit<EquipmentContent, 'units' | 'slot' | 'classes' | 'requires' | 'isPassive' | 'stackGroup' | 'primaryTiers' | 'primaryTypes' | 'requiredModule' | 'info' | 'grants'> {
  /** Item id, the key in `equipment.json`. */
  id: EquipmentId
  /** Ids of the unit types that may carry the item. */
  units: LoadoutUnitId[]
  /** Loadout slot. */
  slot: EquipmentSlot
  /** Ids of the biosoldier classes that may carry the item; null if every class may. */
  classes: readonly string[] | null
  /** What the carrier needs besides the unit and class; null if nothing. */
  requires: LoadoutRequirement | null
  /** Whether the item is passive gear, the only kind a Gear Slot holds. */
  isPassive: boolean
  /** Group of items that do not stack; null if the item stacks with any other. */
  stackGroup: EquipmentStackGroup | null
  /** Technology tiers of the primary weapon the item works with; null if any. */
  primaryTiers: WeaponTier[] | null
  /** Types of the primary weapon the item works with; null if any. */
  primaryTypes: WeaponType[] | null
  /** Id of the Module the item needs in the same Loadout; null if none. */
  requiredModule: EquipmentId | null
  /** Tactical info text from the game; null if the game gives none. */
  info: string | null
  /** Item image URL. */
  icon: string
  /** Non-perk abilities the item grants. */
  grants: LoadoutAbility[]
}

/**
 * Whether the string is a known equipment id.
 *
 * @param id equipment id candidate from the game data.
 */
export const isEquipmentId = (id: string): id is EquipmentId => Object.hasOwn(EQUIPMENT_CONTENT, id);

/**
 * Whether the string is a known equipment slot.
 *
 * @param slot equipment slot candidate from the game data.
 */
export const isEquipmentSlot = (slot: string): slot is EquipmentSlot => (EQUIPMENT_SLOTS as readonly string[]).includes(slot);

/**
 * Whether the string is a known group of items that do not stack.
 *
 * @param group stack group candidate from the game data.
 */
export const isEquipmentStackGroup = (group: string): group is EquipmentStackGroup => (EQUIPMENT_STACK_GROUPS as readonly string[]).includes(group);

/**
 * Equipment of an `equipment.json` entry, for `flatMap` over the records.
 *
 * @param entry equipment id and its record.
 * @returns the item alone, or nothing if a unit, its slot, requirement, stack group, weapon tier or type or its Module is unknown;
 * unknown granted ids are skipped.
 */
export const equipmentFromEntry = (entry: [EquipmentId, EquipmentContent]): Equipment[] => {
  const [id, content] = entry;
  const units = content.units.filter(isLoadoutUnitId);
  const requires = content.requires ?? null;
  const stackGroup = content.stackGroup ?? null;
  const primaryTiers = content.primaryTiers?.filter(isWeaponTier) ?? null;
  const primaryTypes = content.primaryTypes?.filter(isWeaponType) ?? null;
  const requiredModule = content.requiredModule ?? null;

  if (units.length !== content.units.length || !isEquipmentSlot(content.slot)) return [];

  if (requires !== null && !isLoadoutRequirement(requires)) return [];

  if (stackGroup !== null && !isEquipmentStackGroup(stackGroup)) return [];

  if (primaryTiers?.length !== content.primaryTiers?.length || primaryTypes?.length !== content.primaryTypes?.length) return [];

  if (requiredModule !== null && !isEquipmentId(requiredModule)) return [];

  return [{
    ...content,
    id,
    units,
    slot: content.slot,
    classes: content.classes ?? null,
    requires,
    isPassive: content.isPassive ?? false,
    stackGroup,
    primaryTiers,
    primaryTypes,
    requiredModule,
    info: content.info ?? null,
    icon: EQUIPMENT_ICON[id],
    grants: (content.grants ?? []).filter(isLoadoutAbilityId).map(loadoutAbilityById),
  }];
};
