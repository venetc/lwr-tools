import type { SoldierRank } from './ranks';

export interface TalentIcon {
  /** Original icon, shown for a selected talent. */
  original: string
  /** Icon tinted for a talent available to select. */
  available: string
  /** Icon tinted for a talent that is locked or not selected. */
  disabled: string
}

export interface Talent {
  id: string
  name: string
  description: string
  icon: TalentIcon
  grants: Talent[]
}

export interface SoldierTalentRank extends SoldierRank {
  /** Talents to choose from on the rank. */
  talents: Talent[]
}

export interface SoldierTalentTree {
  /** Tree name. */
  name: string
  /** Tree ranks from lowest to highest. */
  ranks: SoldierTalentRank[]
  /** Talents granted without selection: their ranks are always completed and cannot change. */
  baseBuild: TalentBuild
}

/**
 * Selected talent ids by rank, from the lowest rank.
 */
export type TalentBuild = Talent['id'][];

/**
 * Rank state in the build: completed, available for selection, or locked.
 */
export type TalentRankState = 'completed' | 'available' | 'locked';

/**
 * Rank state in the build: completed, available for selection, or locked.
 *
 * @param build selected talents by rank.
 * @param rankIndex rank index in the tree.
 * @param readonly readonly build: no rank is available for selection.
 */
export const talentRankState = (build: TalentBuild, rankIndex: number, readonly: boolean): TalentRankState => {
  if (rankIndex < build.length) return 'completed';
  if (rankIndex === build.length && !readonly) return 'available';
  return 'locked';
};

/**
 * Talent to show when the user inspects none: the one selected on the last completed rank,
 * otherwise the first talent of the first rank; null for an empty tree.
 *
 * @param tree class talent tree.
 * @param build selected talents by rank.
 */
export const featuredTalent = (tree: SoldierTalentTree, build: TalentBuild): Talent | null => {
  const lastRankIndex = build.length - 1;
  const lastRankTalents = tree.ranks[lastRankIndex]?.talents ?? [];
  const lastSelectedTalent = lastRankTalents.find(talent => talent.id === build[lastRankIndex]) ?? null;

  return lastSelectedTalent ?? tree.ranks[0]?.talents[0] ?? null;
};
