import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { AbilityId } from '../../model/abilities';
import { isAbilityId } from '../../model/abilities';
import type { SoldierClass } from '../../model/classes';
import type { SoldierRankId } from '../../model/ranks';
import { SOLDIER_CLASS_CONTENT } from './soldier-class-content';
import { SOLDIER_CLASS_ICON } from './soldier-class-icons';
import { SOLDIER_RANKS } from './soldier-ranks';

/** All soldier classes with their icons and abilities by rank; unknown ability ids are skipped. */
export const SOLDIER_CLASSES: DeepReadonly<SoldierClass[]> = typedEntries(SOLDIER_CLASS_CONTENT).map(([id, content]) => {
  const abilities = typedEntries(content.abilities).reduce((acc, [rankId, abilityIds]) => {
    acc[rankId] = abilityIds.filter(isAbilityId);

    return acc;
  }, {} as Record<SoldierRankId, AbilityId[]>);

  return {
    id,
    code: content.code,
    name: content.name,
    icon: SOLDIER_CLASS_ICON[id],
    abilities,
    baseBuild: abilities[SOLDIER_RANKS[0].id].slice(0, 1),
  };
});

/** Soldier classes by their share code number. */
export const SOLDIER_CLASS_BY_CODE: ReadonlyMap<number, DeepReadonly<SoldierClass>> = new Map(SOLDIER_CLASSES.map(soldierClass => [soldierClass.code, soldierClass]));
