import { typedEntries } from '@shared/lib/object';

import { ABILITY_CONTENT } from '../config/constants/ability-content';
import { ABILITY_ICON } from '../config/constants/ability-icons';
import type { Ability, AbilityContent, AbilityId } from './types';

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

const abilityIdsByCode = new Map(typedEntries(ABILITY_CONTENT).map(([id, content]) => [content.code, id]));

/**
 * Id of the ability with the share code number, or null for an unknown number.
 *
 * @param code ability number.
 */
export const abilityIdByCode = (code: number) => abilityIdsByCode.get(code) ?? null;
