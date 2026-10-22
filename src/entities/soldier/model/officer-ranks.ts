import type { DeepReadonly } from '@shared/lib/object';

import { OFFICER_RANK_MEDAL } from '../config/constants/officer-rank-medals';
import { SOLDIER_RANKS } from '../config/constants/soldier-ranks';
import type officerRanksJson from '../config/data/officer-ranks.json';
import type { AbilityId } from './abilities';
import { isAbilityId } from './abilities';
import type { SelectedPerks } from './class-tree';
import type { RankState } from './ranks';
import { rankState } from './ranks';

export type OfficerRankId = keyof typeof officerRanksJson;

/**
 * Officer rank record of `officer-ranks.json`.
 */
export interface OfficerRankContent {
  /** Officer rank name. */
  name: string
  /** Short officer rank name from the game, such as `LT`. */
  abbreviation: string
  /** Id of the rank the class tree must complete to open the officer rank. */
  requiredRank: string
  /** Officer perk ids of the officer rank: left, then right. */
  perks: readonly string[]
}

export interface OfficerRank {
  /** Officer rank id. */
  id: OfficerRankId
  /** Officer rank name. */
  name: string
  /** Short officer rank name from the game, such as `LT`. */
  abbreviation: string
  /** Index of the rank the class tree must complete to open the officer rank; null for an unknown rank, which never opens it. */
  requiredRankIndex: number | null
  /** Name of the rank the class tree must complete to open the officer rank. */
  requiredRankName: string
  /** Officer perks to choose from: left, then right. */
  perks: AbilityId[]
  /** Medal image of the officer rank. */
  medal: string
}

/**
 * Officer perks of a build by officer rank, from Lieutenant: one per trained officer rank, without gaps.
 */
export type SelectedOfficerPerks = AbilityId[];

/**
 * Whether the class tree completes the rank the officer rank requires: a rank is completed once it has a perk.
 *
 * @param officerRank officer rank.
 * @param perks selected perks of the build by rank.
 */
export const hasRequiredRank = (officerRank: DeepReadonly<OfficerRank>, perks: Readonly<SelectedPerks>): boolean => (
  typeof officerRank.requiredRankIndex === 'number' && officerRank.requiredRankIndex < perks.length
);

/**
 * Officer rank state in a build: officer ranks are trained in order like ranks, and each one also needs its required rank
 * completed in the class tree; a readonly build locks every officer rank.
 *
 * @param officerRank officer rank.
 * @param officerRankIndex officer rank index.
 * @param perks selected perks of the build by rank.
 * @param officerPerks officer perks of the build by officer rank.
 * @param isReadonly whether the build is readonly.
 */
export const officerRankState = (
  officerRank: DeepReadonly<OfficerRank>,
  officerRankIndex: number,
  perks: Readonly<SelectedPerks>,
  officerPerks: Readonly<SelectedOfficerPerks>,
  isReadonly: boolean,
): RankState => {
  if (isReadonly || !hasRequiredRank(officerRank, perks)) return 'locked';
  return rankState(officerPerks, officerRankIndex, false);
};

/**
 * Officer rank of its record with its medal; unknown ability ids are skipped.
 *
 * @param id officer rank id.
 * @param content officer rank record.
 */
export const createOfficerRank = (id: OfficerRankId, content: OfficerRankContent): OfficerRank => {
  const requiredRankIndex = SOLDIER_RANKS.findIndex(rank => rank.id === content.requiredRank);

  return {
    id,
    name: content.name,
    abbreviation: content.abbreviation,
    requiredRankIndex: requiredRankIndex < 0 ? null : requiredRankIndex,
    requiredRankName: SOLDIER_RANKS[requiredRankIndex]?.name ?? content.requiredRank,
    perks: content.perks.filter(isAbilityId),
    medal: OFFICER_RANK_MEDAL[id],
  };
};
