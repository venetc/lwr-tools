import { markRaw } from 'vue';

import type { Talent, TalentTreeData } from '@shared/lib/talent-tree';

import { abilityById } from './abilities';
import { soldierClassBaseBuild } from './build';
import { SOLDIER_CLASSES } from './classes';
import { SOLDIER_RANKS } from './ranks';
import type { AbilityId, SoldierClass, SoldierTalentRank } from './types';

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
 * Soldier class talent tree by rank, built anew; static, kept non-reactive.
 *
 * @param soldierClass soldier class.
 */
const buildClassTree = (soldierClass: SoldierClass): TalentTreeData<SoldierTalentRank> => {
  return markRaw({
    name: soldierClass.name,
    ranks: SOLDIER_RANKS.map(rank => ({
      ...rank,
      talents: soldierClass.abilities[rank.id].map(abilityId => abilityTalent(abilityId)),
    })),
    baseBuild: soldierClassBaseBuild(soldierClass),
  });
};

const treeByClassId = new Map(SOLDIER_CLASSES.map(soldierClass => [soldierClass.id, buildClassTree(soldierClass)]));

/**
 * Soldier class talent tree by rank; one shared instance per class.
 *
 * @param soldierClass soldier class.
 */
export const soldierClassTalentTree = (soldierClass: SoldierClass) => {
  const cachedTree = treeByClassId.get(soldierClass.id) ?? null;

  if (cachedTree) return cachedTree;

  const tree = buildClassTree(soldierClass);

  treeByClassId.set(soldierClass.id, tree);

  return tree;
};
