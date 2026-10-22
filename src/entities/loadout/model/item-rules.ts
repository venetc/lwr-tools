import type { DeepReadonly } from '@shared/lib/object';

import { EQUIPMENT, EQUIPMENT_BY_ID } from '../config/constants/equipment';
import { UTILITY_SLOT_KINDS } from '../config/constants/loadout-rules';
import type { Armor } from './armors';
import type { Equipment } from './equipment';
import type { LoadoutItemId, UtilitySlotKind } from './loadout';
import { isRiggingAdded, isSlotHolding } from './loadout';
import { findLoadoutItem } from './loadout-items';
import type { LoadoutUnitId } from './loadout-units';
import type { WeaponTier, WeaponType } from './weapons';

/**
 * Rules of armor or a MEC exoskeleton.
 */
export interface ArmorRules {
  /** Item kind. */
  kind: 'armor'
  /** Gear Slots: the last utility slots, for passive gear only. */
  gearSlots: number
  /** Psi Slots: the last utility slots, for passive psionic gear only. */
  psiSlots: number
  /** Whether Tactical Rigging adds no slot to the biosoldier armor, which has a rigging of its own; false for a MEC exoskeleton. */
  isRiggingIgnored: boolean
}

/**
 * Rules of a SHIV type: it has none besides its stats.
 */
export interface ShivTypeRules {
  /** Item kind. */
  kind: 'shiv-type'
}

/**
 * Rules of a weapon.
 */
export interface WeaponRules {
  /** Item kind. */
  kind: 'weapon'
  /** Utility slots the weapon takes away as a primary one; 0 if none. */
  takenUtilitySlots: number
}

/**
 * Rules of equipment or a Module.
 */
export interface EquipmentRules {
  /** Item kind. */
  kind: 'equipment'
  /** Items of the unit type the item does not stack with, in catalog order. */
  cantStackWith: DeepReadonly<Equipment[]>
  /** Technology tiers of the primary weapon the item works with; null if any. */
  primaryTiers: DeepReadonly<WeaponTier[]> | null
  /** Types of the primary weapon the item works with; null if any. */
  primaryTypes: DeepReadonly<WeaponType[]> | null
  /** Module the item needs in the same Loadout; null if none. */
  requiredModule: DeepReadonly<Equipment> | null
  /** Kinds of the utility slots that take the item; empty for a Module. */
  slotKinds: UtilitySlotKind[]
}

export type ItemRules = ArmorRules | ShivTypeRules | WeaponRules | EquipmentRules;

/**
 * Rules of armor.
 *
 * @param armor armor or MEC exoskeleton.
 */
const armorRules = (armor: DeepReadonly<Armor>): ArmorRules => ({
  kind: 'armor',
  gearSlots: armor.gearSlots,
  psiSlots: armor.psiSlots,
  isRiggingIgnored: armor.unit === 'biosoldier' && !isRiggingAdded(armor),
});

/**
 * Rules of equipment.
 *
 * @param equipment equipment or Module.
 * @param unit unit type that carries the item; only items of its own are named among those the item does not stack with.
 */
const equipmentRules = (equipment: DeepReadonly<Equipment>, unit: LoadoutUnitId): EquipmentRules => ({
  kind: 'equipment',
  cantStackWith: EQUIPMENT.filter(item => item.stackGroup !== null && item.stackGroup === equipment.stackGroup && item.id !== equipment.id && item.units.includes(unit)),
  primaryTiers: equipment.primaryTiers,
  primaryTypes: equipment.primaryTypes,
  requiredModule: equipment.requiredModule ? EQUIPMENT_BY_ID.get(equipment.requiredModule) ?? null : null,
  slotKinds: equipment.slot === 'utility' ? UTILITY_SLOT_KINDS.filter(kind => isSlotHolding(kind, equipment)) : [],
});

/**
 * Rules of an item of any catalog, as data for its description: the slots of armor, the slots a weapon takes away,
 * and what equipment does not stack with, works with, needs and fits.
 *
 * @param id item id.
 * @param unit unit type that carries the item.
 * @returns the rules by the kind of the item; null for an id missing from every catalog.
 */
export const itemRules = (id: LoadoutItemId, unit: LoadoutUnitId): ItemRules | null => {
  const found = findLoadoutItem(id);

  if (!found) return null;

  if (found.kind === 'armor') return armorRules(found.item);

  if (found.kind === 'shiv-type') return { kind: 'shiv-type' };

  if (found.kind === 'weapon') return { kind: 'weapon', takenUtilitySlots: Math.max(0, -found.item.utilitySlots) };

  return equipmentRules(found.item, unit);
};
