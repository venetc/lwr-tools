import type { Talent, TalentTreeData } from './types';

/**
 * Rank talent by id, or null if the rank has no such talent.
 *
 * @param tree class talent tree.
 * @param rankIndex rank index in the tree.
 * @param talentId id of the talent to find, or null.
 */
export const findRankTalent = (tree: TalentTreeData, rankIndex: number, talentId: string | null): Talent | null => {
  const rankTalents = tree.ranks[rankIndex]?.talents ?? [];
  return rankTalents.find(talent => talent.id === talentId) ?? null;
};

/**
 * First talent of the first rank, or null for an empty tree.
 *
 * @param tree class talent tree.
 */
export const firstTalent = (tree: TalentTreeData): Talent | null => {
  return tree.ranks[0]?.talents[0] ?? null;
};
