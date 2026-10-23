import { OFFICER_RANK_MEDAL } from '../config/constants/officer-rank-medals';
import { SOLDIER_RANKS } from '../config/constants/soldier-ranks';
import type officerRanksJson from '../config/data/officer-ranks.json';
import type { AbilityId } from './abilities';
import { isAbilityId } from './abilities';

export type OfficerRankId = keyof typeof officerRanksJson;

/**
 * Officer rank record of `officer-ranks.json`.
 */
export interface OfficerRankContent {
  /** Officer rank name. */
  name: string
  /** Short officer rank name from the game, such as `LT`. */
  abbreviation: string
  /** Id of the rank the game requires for the officer rank. */
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
  /** Name of the rank the game requires for the officer rank: a hint only, a Build takes officer ranks at any rank. */
  requiredRankName: string
  /** Officer perks to choose from: left, then right. */
  perks: AbilityId[]
  /** Medal image of the officer rank. */
  medal: string
}

/**
 * Officer perks of a build by officer rank, from Lieutenant: one entry per officer rank, null for an empty one.
 */
export type SelectedOfficerPerks = (AbilityId | null)[];

/**
 * Officer rank of its record with its medal; unknown ability ids are skipped.
 *
 * @param id officer rank id.
 * @param content officer rank record.
 */
export const createOfficerRank = (id: OfficerRankId, content: OfficerRankContent): OfficerRank => {
  const requiredRank = SOLDIER_RANKS.find(rank => rank.id === content.requiredRank);

  return {
    id,
    name: content.name,
    abbreviation: content.abbreviation,
    requiredRankName: requiredRank?.name ?? content.requiredRank,
    perks: content.perks.filter(isAbilityId),
    medal: OFFICER_RANK_MEDAL[id],
  };
};
