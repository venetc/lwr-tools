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
 * State of a rank or an officer rank in a build. Steps are taken in any order, so any step is open in an editable build;
 * a step with a selection is completed even in a readonly build, where empty steps are locked.
 *
 * @param selectedId id selected on the step, or null.
 * @param isReadonly whether the build is readonly.
 */
export const rankState = (selectedId: string | null, isReadonly: boolean): RankState => {
  if (selectedId !== null) return 'completed';
  if (isReadonly) return 'locked';
  return 'available';
};

/**
 * Index of the highest step with a selection: ranks, psi levels or officer ranks are taken in any order.
 *
 * @param selectedIds ids by step; null for an empty step.
 * @returns the step index; -1 without any selection.
 */
export const highestSelectedStepIndex = (selectedIds: readonly (string | null)[]) => (
  selectedIds.reduce((highestIndex, id, index) => (id === null ? highestIndex : index), -1)
);
