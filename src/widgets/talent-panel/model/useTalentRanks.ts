import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import type { Talent, TalentBuild, TalentRank, TalentRankState, TalentTree } from '@entities/talent';

import { computed, toValue } from 'vue';

import { rankState, selectedTalentId } from '@entities/talent';

import { talentColumn } from '../lib/layout';

export interface TalentEntry {
  talent: Talent
  isSelected: boolean
  column: number
}

export interface RankEntry {
  rank: TalentRank
  rankIndex: number
  state: TalentRankState
  selectedId: string | null
  talentEntries: TalentEntry[]
}

export interface UseTalentRanks {
  rankEntries: ComputedRef<RankEntry[]>
}

export function useTalentRanks(tree: MaybeRefOrGetter<TalentTree>, build: Ref<TalentBuild>): UseTalentRanks {
  const rankEntries = computed(() => toValue(tree).ranks.map((rank, rankIndex): RankEntry => {
    const state = rankState(build.value, rankIndex);
    const selectedId = selectedTalentId(build.value, rankIndex);

    return {
      rank,
      rankIndex,
      state,
      selectedId,
      talentEntries: rank.talents.map((talent, talentIndex) => ({
        talent,
        isSelected: selectedId === talent.id,
        column: talentColumn(rank.talents.length, talentIndex),
      })),
    };
  }));

  return { rankEntries };
}
