import type { Talent, TalentTreeData } from '@shared/ui/talent-tree';
import type { Ability, SoldierClass, SoldierTalentRank } from '../model/types';

import { ABILITIES } from '../model/abilities';
import { SOLDIER_RANKS } from '../model/ranks';

function toTalent(ability: Ability): Talent {
  return {
    id: ability.id,
    name: ability.name,
    description: ability.description,
    icon: ability.icon,
    grants: (ability.grants ?? []).map(abilityId => toTalent(ABILITIES[abilityId])),
  };
}

export function soldierClassTree(soldierClass: SoldierClass): TalentTreeData<SoldierTalentRank> {
  return {
    name: soldierClass.name,
    ranks: SOLDIER_RANKS.map(rank => ({
      id: rank.id,
      name: rank.name,
      soldierRank: rank,
      talents: soldierClass.abilities[rank.id].map(abilityId => toTalent(ABILITIES[abilityId])),
    })),
  };
}
