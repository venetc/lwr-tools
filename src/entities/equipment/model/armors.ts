import { ARMOR_CATEGORIES } from '../config/constants/armor-categories';
import { ARMOR_ICON } from '../config/constants/armor-icons';
import type armorsJson from '../config/data/armors.json';
import type { EquipmentAbility } from './equipment-abilities';
import { equipmentAbilityById, isEquipmentAbilityId } from './equipment-abilities';
import type { EquipmentUnitId } from './equipment-units';
import { isEquipmentUnitId } from './equipment-units';

export type ArmorId = keyof typeof armorsJson;

export type ArmorCategory = typeof ARMOR_CATEGORIES[number];

/**
 * Armor record of `armors.json`.
 */
export interface ArmorContent {
  /** Stable armor number in share codes, from 1: a new armor gets the maximum plus one; never changed or reused. */
  code: number
  /** Id of the unit type that wears the armor. */
  unit: string
  /** Armor name. */
  name: string
  /** Weight category. */
  category: string
  /** Armor HP added to the unit. */
  hp: number
  /** Base damage reduction, percent. */
  damageReduction: number
  /** Defense bonus. */
  defense: number
  /** Mobility offset in tiles, as the game shows it. */
  mobility: number
  /** Will bonus. */
  will: number
  /** Critical hit resistance. */
  critResist: number
  /** Aim bonus while the unit is at full HP. */
  fullHpAim: number
  /** Small equipment slots. */
  smallSlots: number
  /** Large equipment slots. */
  largeSlots: number
  /** Flight fuel; 0 for armor without flight. */
  fuel: number
  /** Tactical info text from the game. */
  info: string
  /** Ids of the equipment abilities the armor grants. */
  grants?: readonly string[]
}

/**
 * Armor with its id, image, granted abilities and checked unit and category.
 */
export interface Armor extends Omit<ArmorContent, 'unit' | 'category' | 'grants'> {
  /** Armor id, the key in `armors.json`. */
  id: ArmorId
  /** Id of the unit type that wears the armor. */
  unit: EquipmentUnitId
  /** Weight category. */
  category: ArmorCategory
  /** Armor image URL. */
  icon: string
  /** Equipment abilities the armor grants. */
  grants: EquipmentAbility[]
}

/**
 * Whether the string is a known armor category.
 *
 * @param category armor category candidate from the game data.
 */
export const isArmorCategory = (category: string): category is ArmorCategory => (ARMOR_CATEGORIES as readonly string[]).includes(category);

/**
 * Armor of an `armors.json` entry, for `flatMap` over the records.
 *
 * @param entry armor id and its record.
 * @returns the armor alone, or nothing if its unit or category is unknown; unknown granted ids are skipped.
 */
export const armorsFromEntry = (entry: [ArmorId, ArmorContent]): Armor[] => {
  const [id, content] = entry;

  if (!isEquipmentUnitId(content.unit) || !isArmorCategory(content.category)) return [];

  return [{
    ...content,
    id,
    unit: content.unit,
    category: content.category,
    icon: ARMOR_ICON[id],
    grants: (content.grants ?? []).filter(isEquipmentAbilityId).map(equipmentAbilityById),
  }];
};
