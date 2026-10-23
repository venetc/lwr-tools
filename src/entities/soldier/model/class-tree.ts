import { SOLDIER_RANKS } from '../config/constants/soldier-ranks';
import type { TreeAbility } from './abilities';
import { treeAbility } from './abilities';
import type { SoldierClass } from './classes';
import type { SoldierRank } from './ranks';
import { highestSelectedStepIndex } from './ranks';

export interface ClassTreeRank extends SoldierRank {
  /** Perks to choose from on the rank. */
  perks: TreeAbility[]
}

export interface ClassTree {
  /** Tree name. */
  name: string
  /** Tree ranks from lowest to highest. */
  ranks: ClassTreeRank[]
}

/**
 * Selected perk ids by rank, from the lowest rank: one entry per rank, null for an empty one.
 */
export type SelectedPerks = (TreeAbility['id'] | null)[];

/**
 * Perk to show when the user inspects none: the one selected on the highest completed rank,
 * otherwise the first perk of the first rank; null for an empty tree.
 *
 * @param tree class tree.
 * @param perks selected perks by rank.
 */
export const featuredPerk = (tree: ClassTree, perks: Readonly<SelectedPerks>): TreeAbility | null => {
  const lastRankIndex = highestSelectedStepIndex(perks);
  const lastRankPerks = tree.ranks[lastRankIndex]?.perks ?? [];
  const lastSelectedPerk = lastRankPerks.find(perk => perk.id === perks[lastRankIndex]);

  return lastSelectedPerk ?? tree.ranks[0]?.perks[0] ?? null;
};

/**
 * Class tree of the soldier class by rank, built anew on every call; callers that need it repeatedly cache it themselves.
 *
 * @param soldierClass soldier class.
 */
export const classTree = (soldierClass: SoldierClass): ClassTree => {
  return {
    name: soldierClass.name,
    ranks: SOLDIER_RANKS.map(rank => ({
      ...rank,
      perks: soldierClass.perks[rank.id].map(abilityId => treeAbility(abilityId)),
    })),
  };
};
