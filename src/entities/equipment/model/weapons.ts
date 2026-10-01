import { WEAPON_SLOTS, WEAPON_TIERS, WEAPON_TYPES } from '../config/constants/weapon-categories';
import { WEAPON_ICON } from '../config/constants/weapon-icons';
import type weaponsJson from '../config/data/weapons.json';
import type { EquipmentAbility } from './equipment-abilities';
import { equipmentAbilityById, isEquipmentAbilityId } from './equipment-abilities';
import type { EquipmentUnitId } from './equipment-units';
import { isEquipmentUnitId } from './equipment-units';

export type WeaponId = keyof typeof weaponsJson;

export type WeaponTier = typeof WEAPON_TIERS[number];

export type WeaponType = typeof WEAPON_TYPES[number];

export type WeaponSlot = typeof WEAPON_SLOTS[number];

/**
 * Extra stats of a weapon against mechanical targets, added to its base stats.
 */
export interface WeaponMechanicalBonus {
  /** Extra damage. */
  damage: number
  /** Extra armor penetration. */
  penetration: number
  /** Extra aim. */
  aim: number
}

/**
 * Weapon record of `weapons.json`.
 */
export interface WeaponContent {
  /** Stable weapon number in share codes, from 1: a new weapon gets the maximum plus one; never changed or reused. */
  code: number
  /** Id of the unit type that uses the weapon. */
  unit: string
  /** Weapon name. */
  name: string
  /** Technology tier. */
  tier: string
  /** Weapon type. */
  type: string
  /** Loadout slot. */
  slot: string
  /** Ids of the soldier classes that may equip the weapon; absent if every class of the unit may. */
  classes?: readonly string[]
  /** Base damage. */
  damage: number
  /** Armor penetration. */
  penetration: number
  /** Critical hit chance bonus. */
  crit: number
  /** Aim bonus. */
  aim: number
  /** Ammo, charges or rockets. */
  ammo: number
  /** Mobility offset in tiles, as the game shows it. */
  mobility: number
  /** Range in tiles. */
  range: number
  /** Small equipment slots the weapon adds or takes. */
  smallSlots: number
  /** Extra ammo from a Foundry project. */
  ammoUpgrade?: number
  /** Extra damage from a Foundry project. */
  damageUpgrade?: number
  /** Critical damage bonus, percent. */
  critDamage?: number
  /** Damage to the environment. */
  environmentDamage?: number
  /** Blast radius in tiles. */
  radius?: number
  /** Whether the weapon can critically hit; absent if it can. */
  canCrit?: boolean
  /** Extra stats against mechanical targets. */
  vsMechanical?: WeaponMechanicalBonus
  /** Tactical info text from the game. */
  info: string
  /** Ids of the equipment abilities the weapon grants. */
  grants?: readonly string[]
}

/**
 * Weapon with its id, image, granted abilities, checked categories and optional stats filled in.
 */
export interface Weapon extends Required<Omit<WeaponContent, 'unit' | 'tier' | 'type' | 'slot' | 'classes' | 'vsMechanical' | 'grants'>> {
  /** Weapon id, the key in `weapons.json`. */
  id: WeaponId
  /** Id of the unit type that uses the weapon. */
  unit: EquipmentUnitId
  /** Technology tier. */
  tier: WeaponTier
  /** Weapon type. */
  type: WeaponType
  /** Loadout slot. */
  slot: WeaponSlot
  /** Ids of the soldier classes that may equip the weapon; null if every class of the unit may. */
  classes: readonly string[] | null
  /** Extra stats against mechanical targets; null if there are none. */
  vsMechanical: WeaponMechanicalBonus | null
  /** Weapon image URL. */
  icon: string
  /** Equipment abilities the weapon grants. */
  grants: EquipmentAbility[]
}

/**
 * Whether the string is a known weapon tier.
 *
 * @param tier weapon tier candidate from the game data.
 */
export const isWeaponTier = (tier: string): tier is WeaponTier => (WEAPON_TIERS as readonly string[]).includes(tier);

/**
 * Whether the string is a known weapon type.
 *
 * @param type weapon type candidate from the game data.
 */
export const isWeaponType = (type: string): type is WeaponType => (WEAPON_TYPES as readonly string[]).includes(type);

/**
 * Whether the string is a known weapon slot.
 *
 * @param slot weapon slot candidate from the game data.
 */
export const isWeaponSlot = (slot: string): slot is WeaponSlot => (WEAPON_SLOTS as readonly string[]).includes(slot);

/**
 * Weapon of a `weapons.json` entry, for `flatMap` over the records.
 *
 * @param entry weapon id and its record.
 * @returns the weapon alone, or nothing if its unit, tier, type or slot is unknown; unknown granted ids are skipped.
 */
export const weaponsFromEntry = (entry: [WeaponId, WeaponContent]): Weapon[] => {
  const [id, content] = entry;

  if (!isEquipmentUnitId(content.unit) || !isWeaponTier(content.tier) || !isWeaponType(content.type) || !isWeaponSlot(content.slot)) return [];

  return [{
    ...content,
    id,
    unit: content.unit,
    tier: content.tier,
    type: content.type,
    slot: content.slot,
    classes: content.classes ?? null,
    ammoUpgrade: content.ammoUpgrade ?? 0,
    damageUpgrade: content.damageUpgrade ?? 0,
    critDamage: content.critDamage ?? 0,
    environmentDamage: content.environmentDamage ?? 0,
    radius: content.radius ?? 0,
    canCrit: content.canCrit ?? true,
    vsMechanical: content.vsMechanical ?? null,
    icon: WEAPON_ICON[id],
    grants: (content.grants ?? []).filter(isEquipmentAbilityId).map(equipmentAbilityById),
  }];
};
