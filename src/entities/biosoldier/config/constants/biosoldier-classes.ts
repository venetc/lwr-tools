import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { AbilityId } from '../../model/abilities';
import { isAbilityId } from '../../model/abilities';
import type { BiosoldierClass } from '../../model/classes';
import type { SoldierRankId } from '../../model/ranks';
import { BIOSOLDIER_CLASS_CONTENT } from './biosoldier-class-content';
import { BIOSOLDIER_CLASS_ICON } from './biosoldier-class-icons';
import { SOLDIER_RANKS } from './soldier-ranks';

/** All biosoldier classes with their icons and perks by rank; unknown ability ids are skipped. The base perk is the first perk of the first rank. */
export const BIOSOLDIER_CLASSES: DeepReadonly<BiosoldierClass[]> = typedEntries(BIOSOLDIER_CLASS_CONTENT).map(([id, content]) => {
  const perks = typedEntries(content.perks).reduce((acc, [rankId, abilityIds]) => {
    acc[rankId] = abilityIds.filter(isAbilityId);

    return acc;
  }, {} as Record<SoldierRankId, AbilityId[]>);

  return {
    id,
    code: content.code,
    name: content.name,
    icon: BIOSOLDIER_CLASS_ICON[id],
    perks,
    basePerk: perks[SOLDIER_RANKS[0].id][0],
  };
});

/** Biosoldier classes by their share code number. */
export const BIOSOLDIER_CLASS_BY_CODE: ReadonlyMap<number, DeepReadonly<BiosoldierClass>> = new Map(BIOSOLDIER_CLASSES.map(biosoldierClass => [biosoldierClass.code, biosoldierClass]));
