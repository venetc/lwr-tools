import { SOLDIER_RANKS } from '../config/constants/soldier-ranks';
import type { AbilityId } from './abilities';
import { abilityById } from './abilities';
import type { SoldierClass } from './classes';
import type { SoldierTalentTree, Talent } from './talent-tree';

/**
 * Tree talent built from an ability, together with the talents it grants; a grant back into the chain is skipped.
 *
 * @param abilityId ability id.
 * @param grantChain ids of the abilities that granted this one; restored after the call.
 */
const abilityTalent = (abilityId: AbilityId, grantChain = new Set<AbilityId>()): Talent => {
  const ability = abilityById(abilityId);

  grantChain.add(abilityId);

  const grants = ability.grants.reduce<Talent[]>((talents, grantedId) => {
    if (!grantChain.has(grantedId)) talents.push(abilityTalent(grantedId, grantChain));

    return talents;
  }, []);

  grantChain.delete(abilityId);

  return { ...ability, grants };
};

/**
 * Soldier class talent tree by rank, built anew on every call; callers that need it repeatedly cache it themselves.
 *
 * @param soldierClass soldier class.
 */
export const soldierClassTalentTree = (soldierClass: SoldierClass): SoldierTalentTree => {
  return {
    name: soldierClass.name,
    ranks: SOLDIER_RANKS.map(rank => ({
      ...rank,
      talents: soldierClass.abilities[rank.id].map(abilityId => abilityTalent(abilityId)),
    })),
    baseBuild: [...soldierClass.baseBuild],
  };
};
