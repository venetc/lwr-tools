import type { Talent, TalentTreeData } from './types';

export function findRankTalent(tree: TalentTreeData, rankIndex: number, talentId: string | null): Talent | null {
  const rankTalents = tree.ranks[rankIndex]?.talents ?? [];
  return rankTalents.find(talent => talent.id === talentId) ?? null;
}

export function firstTalent(tree: TalentTreeData): Talent | null {
  return tree.ranks[0]?.talents[0] ?? null;
}
