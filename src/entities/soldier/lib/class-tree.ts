import type { Talent, TalentTreeData } from '@shared/ui/talent-tree';

import { ABILITIES } from '../config/constants/abilities';
import { SOLDIER_RANKS } from '../config/constants/ranks';
import { SOLDIER_RANK_ID } from '../config/constants/soldier-rank-id';
import type { Ability, SoldierClass, SoldierTalentRank } from '../model/types';

/**
 * Tree talent built from an ability, together with the abilities it grants.
 *
 * @param ability soldier ability.
 */
function toTalent(ability: Ability): Talent {
  return {
    ...ability,
    grants: (ability.grants ?? []).map(abilityId => toTalent(ABILITIES[abilityId])),
  };
}

/**
 * Soldier class talent tree by rank. The only first-rank talent is granted with the class.
 *
 * @param soldierClass soldier class.
 */
export function soldierClassTree(soldierClass: SoldierClass): TalentTreeData<SoldierTalentRank> {
  return {
    name: soldierClass.name,
    ranks: SOLDIER_RANKS.map(rank => ({
      ...rank,
      talents: soldierClass.abilities[rank.id].map(abilityId => toTalent(ABILITIES[abilityId])),
    })),
    baseBuild: [soldierClass.abilities[SOLDIER_RANK_ID.SPECIALIST][0]],
  };
}
