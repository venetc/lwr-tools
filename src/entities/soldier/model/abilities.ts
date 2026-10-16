import { ABILITY_CONTENT } from '../config/constants/ability-content';
import { ABILITY_ICON } from '../config/constants/ability-icons';
import type abilitiesJson from '../config/data/abilities.json';

export type AbilityId = keyof typeof abilitiesJson;

export interface AbilityIcon {
  /** Icon of a selected ability. */
  selected: string
  /** Icon of an ability available to select. */
  available: string
  /** Icon of an ability that is locked, not selected or blocked. */
  disabled: string
}

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

export interface TreeAbility {
  id: string
  name: string
  description: string
  icon: AbilityIcon
  grants: TreeAbility[]
}

export interface Ability {
  id: AbilityId
  code: number
  name: string
  description: string
  icon: AbilityIcon
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

/**
 * Tree ability built from an ability, together with the abilities it grants; a grant back into the chain is skipped.
 *
 * @param abilityId ability id.
 * @param grantChain ids of the abilities that granted this one; restored after the call.
 */
export const treeAbility = (abilityId: AbilityId, grantChain = new Set<AbilityId>()): TreeAbility => {
  const ability = abilityById(abilityId);

  grantChain.add(abilityId);

  const grants = ability.grants.reduce<TreeAbility[]>((abilities, grantedId) => {
    if (!grantChain.has(grantedId)) abilities.push(treeAbility(grantedId, grantChain));

    return abilities;
  }, []);

  grantChain.delete(abilityId);

  return { ...ability, grants };
};
