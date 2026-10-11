import { SOLDIER_RANKS } from '../config/constants/soldier-ranks';
import type { AbilityIcon, AbilityId } from './abilities';
import { abilityById } from './abilities';
import type { BiosoldierClass } from './classes';
import type { SoldierRank } from './ranks';

export interface TreeAbility {
  id: string
  name: string
  description: string
  icon: AbilityIcon
  grants: TreeAbility[]
}

export interface BiosoldierClassTreeRank extends SoldierRank {
  /** Perks to choose from on the rank. */
  perks: TreeAbility[]
}

export interface BiosoldierClassTree {
  /** Tree name. */
  name: string
  /** Tree ranks from lowest to highest. */
  ranks: BiosoldierClassTreeRank[]
}

/**
 * Selected perk ids by rank, from the lowest rank.
 */
export type SelectedPerks = TreeAbility['id'][];

/**
 * Rank state in the build: completed, available for selection, or locked.
 */
export type RankState = 'completed' | 'available' | 'locked';

/**
 * Rank state in the build: completed, available for selection, or locked.
 *
 * @param perks selected perks by rank.
 * @param rankIndex rank index in the tree.
 * @param readonly readonly build: no rank is available for selection.
 */
export const rankState = (perks: SelectedPerks, rankIndex: number, readonly: boolean): RankState => {
  if (rankIndex < perks.length) return 'completed';
  if (rankIndex === perks.length && !readonly) return 'available';
  return 'locked';
};

/**
 * Perk to show when the user inspects none: the one selected on the last completed rank,
 * otherwise the first perk of the first rank; null for an empty tree.
 *
 * @param tree class tree.
 * @param perks selected perks by rank.
 */
export const featuredPerk = (tree: BiosoldierClassTree, perks: SelectedPerks): TreeAbility | null => {
  const lastRankIndex = perks.length - 1;
  const lastRankPerks = tree.ranks[lastRankIndex]?.perks ?? [];
  const lastSelectedPerk = lastRankPerks.find(perk => perk.id === perks[lastRankIndex]) ?? null;

  return lastSelectedPerk ?? tree.ranks[0]?.perks[0] ?? null;
};

/**
 * Tree ability built from an ability, together with the abilities it grants; a grant back into the chain is skipped.
 *
 * @param abilityId ability id.
 * @param grantChain ids of the abilities that granted this one; restored after the call.
 */
const treeAbility = (abilityId: AbilityId, grantChain = new Set<AbilityId>()): TreeAbility => {
  const ability = abilityById(abilityId);

  grantChain.add(abilityId);

  const grants = ability.grants.reduce<TreeAbility[]>((abilities, grantedId) => {
    if (!grantChain.has(grantedId)) abilities.push(treeAbility(grantedId, grantChain));

    return abilities;
  }, []);

  grantChain.delete(abilityId);

  return { ...ability, grants };
};

/**
 * Biosoldier class tree by rank, built anew on every call; callers that need it repeatedly cache it themselves.
 *
 * @param biosoldierClass biosoldier class.
 */
export const biosoldierClassTree = (biosoldierClass: BiosoldierClass): BiosoldierClassTree => {
  return {
    name: biosoldierClass.name,
    ranks: SOLDIER_RANKS.map(rank => ({
      ...rank,
      perks: biosoldierClass.perks[rank.id].map(abilityId => treeAbility(abilityId)),
    })),
  };
};
