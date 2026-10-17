import { LOADOUT_ABILITY_CONTENT } from '../config/constants/loadout-ability-content';
import { LOADOUT_ABILITY_ICON } from '../config/constants/loadout-ability-icons';
import type abilitiesJson from '../config/data/abilities.json';

export type LoadoutAbilityId = keyof typeof abilitiesJson;

/**
 * Non-perk ability record of `abilities.json`.
 */
export interface LoadoutAbilityContent {
  /** Ability name. */
  name: string
  /** Ability description. */
  description: string
}

/**
 * Non-perk ability that armor, a weapon or equipment grants to its wearer.
 */
export interface LoadoutAbility extends LoadoutAbilityContent {
  /** Ability id, the key in `abilities.json`. */
  id: LoadoutAbilityId
  /** Upscaled ability icon URL; the placeholder icon if the ability has no original icon. */
  icon: string
}

/**
 * Whether the string is a known non-perk ability id.
 *
 * @param id non-perk ability id candidate from the game data.
 */
export const isLoadoutAbilityId = (id: string): id is LoadoutAbilityId => Object.hasOwn(LOADOUT_ABILITY_CONTENT, id);

/**
 * Non-perk ability with its content and icon.
 *
 * @param id non-perk ability id.
 */
export const loadoutAbilityById = (id: LoadoutAbilityId): LoadoutAbility => ({
  ...LOADOUT_ABILITY_CONTENT[id],
  id,
  icon: LOADOUT_ABILITY_ICON[id],
});
