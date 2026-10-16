import type { SvgIcon } from '@shared/ui/svg-icon';

import type ranksJson from '../config/data/ranks.json';

export type SoldierRankId = keyof typeof ranksJson;

/**
 * Rank record of `ranks.json`.
 */
export interface SoldierRankContent {
  /** Rank name. */
  name: string
}

export interface SoldierRank {
  id: SoldierRankId
  name: string
  icon: SvgIcon
}

/**
 * Rank state in the build: completed, available for selection, or locked.
 */
export type RankState = 'completed' | 'available' | 'locked';

/**
 * State of a rank, or of any step taken in order like ranks: the steps with a selection are completed,
 * the next one is available, and the ones above are locked.
 *
 * @param selectedIds ids selected by step, from the lowest, without gaps.
 * @param rankIndex step index.
 * @param readonly readonly build: no step is available for selection.
 */
export const rankState = (selectedIds: readonly string[], rankIndex: number, readonly: boolean): RankState => {
  if (rankIndex < selectedIds.length) return 'completed';
  if (rankIndex === selectedIds.length && !readonly) return 'available';
  return 'locked';
};
