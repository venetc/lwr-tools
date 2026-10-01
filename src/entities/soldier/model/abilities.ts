import { ABILITY_CONTENT } from '../config/constants/ability-content';
import { ABILITY_ICON } from '../config/constants/ability-icons';
import type abilitiesJson from '../config/data/abilities.json';
import type { TalentIcon } from './talent-tree';

export type AbilityId = keyof typeof abilitiesJson;

/**
 * Ability record of `abilities.json`.
 */
export interface AbilityContent {
  /** Stable ability number in share codes, from 1: a new ability gets the maximum plus one; never changed or reused. */
  code: number
  /** Ability name. */
  name: string
  /** Ability description. */
  description: string
  /** Ids of the abilities this ability grants. */
  grants?: readonly string[]
}

export interface Ability {
  id: AbilityId
  code: number
  name: string
  description: string
  icon: TalentIcon
  grants: AbilityId[]
}

/**
 * Whether the string is a known ability id.
 *
 * @param id ability id candidate.
 */
export const isAbilityId = (id: string): id is AbilityId => Object.hasOwn(ABILITY_CONTENT, id);

/**
 * Ability with its content and icon; unknown granted ids are skipped.
 *
 * @param id ability id.
 */
export const abilityById = (id: AbilityId): Ability => {
  const content: AbilityContent = ABILITY_CONTENT[id];

  return {
    id,
    code: content.code,
    name: content.name,
    description: content.description,
    icon: ABILITY_ICON[id],
    grants: (content.grants ?? []).filter(isAbilityId),
  };
};
