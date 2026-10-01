import { EQUIPMENT_ABILITY_CONTENT } from '../config/constants/equipment-ability-content';
import { EQUIPMENT_ABILITY_ICON } from '../config/constants/equipment-ability-icons';
import type abilitiesJson from '../config/data/abilities.json';

export type EquipmentAbilityId = keyof typeof abilitiesJson;

/**
 * Equipment ability record of `abilities.json`.
 */
export interface EquipmentAbilityContent {
  /** Ability name. */
  name: string
  /** Ability description. */
  description: string
}

/**
 * Ability that equipment grants to its wearer.
 */
export interface EquipmentAbility extends EquipmentAbilityContent {
  /** Ability id, the key in `abilities.json`. */
  id: EquipmentAbilityId
  /** Upscaled ability icon URL; null if the game has no icon for the ability. */
  icon: string | null
}

/**
 * Whether the string is a known equipment ability id.
 *
 * @param id equipment ability id candidate from the game data.
 */
export const isEquipmentAbilityId = (id: string): id is EquipmentAbilityId => Object.hasOwn(EQUIPMENT_ABILITY_CONTENT, id);

/**
 * Equipment ability with its content and icon.
 *
 * @param id equipment ability id.
 */
export const equipmentAbilityById = (id: EquipmentAbilityId): EquipmentAbility => ({
  ...EQUIPMENT_ABILITY_CONTENT[id],
  id,
  icon: EQUIPMENT_ABILITY_ICON[id],
});
