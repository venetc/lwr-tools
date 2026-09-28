import { typedEntries } from '@shared/lib/object';

import { SOLDIER_CLASS_CONTENT } from '../config/constants/soldier-class-content';
import { SOLDIER_CLASS_ICON } from '../config/constants/soldier-class-icons';
import { isAbilityId } from './abilities';
import type { AbilityId, SoldierClass, SoldierClassContent, SoldierRankId } from './types';

/**
 * Class abilities by rank; unknown ability ids are skipped.
 *
 * @param content class record.
 */
const classAbilities = (content: SoldierClassContent) => {
  return typedEntries(content.abilities).reduce((acc, [rankId, abilityIds]) => {
    acc[rankId] = abilityIds.filter(isAbilityId);

    return acc;
  }, {} as Record<SoldierRankId, AbilityId[]>);
};

export const SOLDIER_CLASSES: SoldierClass[] = typedEntries(SOLDIER_CLASS_CONTENT).map(([id, content]) => ({
  id,
  code: content.code,
  name: content.name,
  icon: SOLDIER_CLASS_ICON[id],
  abilities: classAbilities(content),
}));

const soldierClassesByCode = new Map(SOLDIER_CLASSES.map(soldierClass => [soldierClass.code, soldierClass]));

/**
 * Soldier class with the share code number, or null for an unknown number.
 *
 * @param code class number.
 */
export const soldierClassByCode = (code: number) => soldierClassesByCode.get(code) ?? null;
