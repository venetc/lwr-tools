import { findRankTalent } from './tree';
import type { Talent, TalentBuild, TalentRankState, TalentTreeData } from './types';

/**
 * Состояние ранга в билде: пройден, доступен для выбора или закрыт.
 *
 * @param build выбранные таланты по рангам.
 * @param rankIndex индекс ранга в дереве.
 */
export function rankState(build: TalentBuild, rankIndex: number): TalentRankState {
  if (rankIndex < build.length) return 'completed';
  if (rankIndex === build.length) return 'available';
  return 'locked';
}

/**
 * Id таланта, выбранного на ранге, или null.
 *
 * @param build выбранные таланты по рангам.
 * @param rankIndex индекс ранга в дереве.
 */
export function selectedTalentId(build: TalentBuild, rankIndex: number): string | null {
  return build[rankIndex] ?? null;
}

/**
 * Талант, выбранный на последнем пройденном ранге, или null для пустого билда.
 *
 * @param tree дерево талантов класса.
 * @param build выбранные таланты по рангам.
 */
export function lastSelectedTalent(tree: TalentTreeData, build: TalentBuild): Talent | null {
  const lastRankIndex = build.length - 1;
  return findRankTalent(tree, lastRankIndex, selectedTalentId(build, lastRankIndex));
}

/**
 * Выбирает талант на ранге и сбрасывает выбор на всех рангах выше. Ранги после доступного не трогает.
 *
 * @param build выбранные таланты по рангам; меняется на месте.
 * @param rankIndex индекс ранга в дереве.
 * @param talentId id выбранного таланта или null, чтобы снять выбор с ранга.
 */
export function selectTalent(build: TalentBuild, rankIndex: number, talentId: string | null): void {
  if (rankIndex > build.length) return;
  build.length = rankIndex;
  if (talentId !== null) build.push(talentId);
}
