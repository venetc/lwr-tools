import { SOLDIER_RANKS } from '../config/constants/soldier-ranks';
import type { AbilityId } from './abilities';
import { abilityById } from './abilities';
import type { BiosoldierClass } from './classes';
import type { BiosoldierTalentTree, Talent } from './talent-tree';

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
 * Biosoldier class talent tree by rank, built anew on every call; callers that need it repeatedly cache it themselves.
 *
 * @param biosoldierClass biosoldier class.
 */
export const biosoldierClassTalentTree = (biosoldierClass: BiosoldierClass): BiosoldierTalentTree => {
  return {
    name: biosoldierClass.name,
    ranks: SOLDIER_RANKS.map(rank => ({
      ...rank,
      talents: biosoldierClass.abilities[rank.id].map(abilityId => abilityTalent(abilityId)),
    })),
    baseBuild: [...biosoldierClass.baseBuild],
  };
};
