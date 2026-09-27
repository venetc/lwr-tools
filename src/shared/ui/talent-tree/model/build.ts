import { findRankTalent } from './tree';
import type { Talent, TalentBuild, TalentRankState, TalentTreeData } from './types';

/**
 * Rank state in the build: completed, available for selection, or locked.
 *
 * @param build selected talents by rank.
 * @param rankIndex rank index in the tree.
 * @param readonly readonly build: no rank is available for selection.
 */
export const rankState = (build: TalentBuild, rankIndex: number, readonly: boolean): TalentRankState => {
  if (rankIndex < build.length) return 'completed';
  if (rankIndex === build.length && !readonly) return 'available';
  return 'locked';
};

/**
 * Id of the talent selected on the rank, or null.
 *
 * @param build selected talents by rank.
 * @param rankIndex rank index in the tree.
 */
export const selectedTalentId = (build: TalentBuild, rankIndex: number): string | null => {
  return build[rankIndex] ?? null;
};

/**
 * Talent selected on the last completed rank, or null for an empty build.
 *
 * @param tree class talent tree.
 * @param build selected talents by rank.
 */
export const lastSelectedTalent = (tree: TalentTreeData, build: TalentBuild): Talent | null => {
  const lastRankIndex = build.length - 1;
  return findRankTalent(tree, lastRankIndex, selectedTalentId(build, lastRankIndex));
};

/**
 * Whether the rank belongs to the tree base build: its talent is granted and cannot change.
 *
 * @param tree class talent tree.
 * @param rankIndex rank index in the tree.
 */
export const isRankGranted = (tree: TalentTreeData, rankIndex: number): boolean => {
  return rankIndex < tree.baseBuild.length;
};

/**
 * Selects a talent on the rank and clears the selection on all higher ranks. Leaves ranks after the available one and granted ranks untouched.
 *
 * @param tree class talent tree.
 * @param build selected talents by rank; mutated in place.
 * @param rankIndex rank index in the tree.
 * @param talentId selected talent id, or null to clear the rank selection.
 */
export const selectTalent = (tree: TalentTreeData, build: TalentBuild, rankIndex: number, talentId: string | null): void => {
  if (isRankGranted(tree, rankIndex)) return;
  if (rankIndex > build.length) return;
  build.length = rankIndex;
  if (talentId !== null) build.push(talentId);
};
