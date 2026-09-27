import type { Talent, TalentTreeData } from './types';

/**
 * Талант ранга по id или null, если на ранге такого нет.
 *
 * @param tree дерево талантов класса.
 * @param rankIndex индекс ранга в дереве.
 * @param talentId id искомого таланта или null.
 */
export function findRankTalent(tree: TalentTreeData, rankIndex: number, talentId: string | null): Talent | null {
  const rankTalents = tree.ranks[rankIndex]?.talents ?? [];
  return rankTalents.find(talent => talent.id === talentId) ?? null;
}

/**
 * Первый талант первого ранга или null для пустого дерева.
 *
 * @param tree дерево талантов класса.
 */
export function firstTalent(tree: TalentTreeData): Talent | null {
  return tree.ranks[0]?.talents[0] ?? null;
}
