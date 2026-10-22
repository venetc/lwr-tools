import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { SelectedOfficerPerks } from '@entities/soldier';
import { OFFICER_RANKS } from '@entities/soldier';

/**
 * Senior officer rank with an officer perk: officer perks go by officer rank without gaps, so it is the last one;
 * null without officer perks.
 *
 * @param officerRanks officer ranks from Lieutenant.
 * @param officerPerks officer perks of the build by officer rank.
 */
export const seniorOfficerRank = <OfficerRank>(
  officerRanks: readonly OfficerRank[],
  officerPerks: Readonly<SelectedOfficerPerks>,
): OfficerRank | null => officerRanks[officerPerks.length - 1] ?? null;

/**
 * Officer rank the badge of the build shows: the senior one with an officer perk; null without officer perks.
 *
 * @param officerPerks officer perks of the build by officer rank.
 */
export const useOfficerRankBadge = (officerPerks: MaybeRefOrGetter<Readonly<SelectedOfficerPerks>>) => (
  computed(() => seniorOfficerRank(OFFICER_RANKS, toValue(officerPerks)))
);
