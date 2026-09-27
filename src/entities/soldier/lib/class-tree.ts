import type { Talent, TalentTreeData } from '@shared/ui/talent-tree';

import { ABILITIES } from '../config/constants/abilities';
import { SOLDIER_RANKS } from '../config/constants/ranks';
import type { Ability, SoldierClass, SoldierTalentRank } from '../model/types';

/**
 * Талант дерева из абилки вместе с абилками, которые она даёт.
 *
 * @param ability абилка солдата.
 */
function toTalent(ability: Ability): Talent {
  return {
    ...ability,
    grants: (ability.grants ?? []).map(abilityId => toTalent(ABILITIES[abilityId])),
  };
}

/**
 * Дерево талантов класса солдата по рангам.
 *
 * @param soldierClass класс солдата.
 */
export function soldierClassTree(soldierClass: SoldierClass): TalentTreeData<SoldierTalentRank> {
  return {
    name: soldierClass.name,
    ranks: SOLDIER_RANKS.map(rank => ({
      ...rank,
      talents: soldierClass.abilities[rank.id].map(abilityId => toTalent(ABILITIES[abilityId])),
    })),
  };
}
