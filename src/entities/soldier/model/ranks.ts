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
