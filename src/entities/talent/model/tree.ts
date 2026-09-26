import type { Talent, TalentTree } from './types';

export function findRankTalent(tree: TalentTree, rankIndex: number, talentId: string | null): Talent | null {
  const rankTalents = tree.ranks[rankIndex]?.talents ?? [];
  return rankTalents.find(talent => talent.id === talentId) ?? null;
}

export function firstTalent(tree: TalentTree): Talent | null {
  return tree.ranks[0]?.talents[0] ?? null;
}
