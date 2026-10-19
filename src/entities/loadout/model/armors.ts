import { ARMOR_CATEGORIES } from '../config/constants/armor-categories';
import { ARMOR_CONTENT } from '../config/constants/armor-content';
import { ARMOR_ICON } from '../config/constants/armor-icons';
import type armorsJson from '../config/data/armors.json';
import type { LoadoutAbility } from './loadout-abilities';
import { isLoadoutAbilityId, loadoutAbilityById } from './loadout-abilities';
import type { LoadoutRequirement } from './loadout-requirements';
import { isLoadoutRequirement } from './loadout-requirements';
import type { LoadoutUnitId } from './loadout-units';
import { isLoadoutUnitId } from './loadout-units';

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
  /** Utility slots. */
  utilitySlots: number
  /** Module slots of a MEC exoskeleton; 0 for biosoldier armor. */
  moduleSlots: number
  /** Gear Slots: the last utility slots, for passive equipment only. */
  gearSlots: number
  /** Psi Slots: the last utility slots, for passive psionic equipment only. */
  psiSlots: number
  /** Flight fuel; 0 for armor without flight. */
  fuel: number
  /** What the wearer needs besides the unit; absent if nothing. */
  requires?: string
  /** Tactical info text from the game. */
  info: string
  /** Ids of the non-perk abilities the armor grants. */
  grants?: readonly string[]
}

/**
 * Armor with its id, image, granted abilities and checked unit, category and requirement.
 */
export interface Armor extends Omit<ArmorContent, 'unit' | 'category' | 'requires' | 'grants'> {
  /** Armor id, the key in `armors.json`. */
  id: ArmorId
  /** Id of the unit type that wears the armor. */
  unit: LoadoutUnitId
  /** Weight category. */
  category: ArmorCategory
  /** What the wearer needs besides the unit; null if nothing. */
  requires: LoadoutRequirement | null
  /** Armor image URL. */
  icon: string
  /** Non-perk abilities the armor grants. */
  grants: LoadoutAbility[]
}

/**
 * Whether the string is a known armor id.
 *
 * @param id armor id candidate.
 */
export const isArmorId = (id: string): id is ArmorId => Object.hasOwn(ARMOR_CONTENT, id);

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
 * @returns the armor alone, or nothing if its unit, category or requirement is unknown; unknown granted ids are skipped.
 */
export const armorsFromEntry = (entry: [ArmorId, ArmorContent]): Armor[] => {
  const [id, content] = entry;
  const requires = content.requires ?? null;

  if (!isLoadoutUnitId(content.unit) || !isArmorCategory(content.category)) return [];

  if (requires !== null && !isLoadoutRequirement(requires)) return [];

  return [{
    ...content,
    id,
    unit: content.unit,
    category: content.category,
    requires,
    icon: ARMOR_ICON[id],
    grants: (content.grants ?? []).filter(isLoadoutAbilityId).map(loadoutAbilityById),
  }];
};
