import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import type { Talent, TalentBuild, TalentRank, TalentRankState, TalentTreeData } from './types';

import { computed, toValue } from 'vue';

import { talentColumn } from '../lib/layout';
import { rankState, selectedTalentId } from './build';

export interface TalentEntry {
  talent: Talent
  isSelected: boolean
  column: number
}

export interface RankEntry<Rank extends TalentRank = TalentRank> {
  rank: Rank
  rankIndex: number
  state: TalentRankState
  selectedId: string | null
  talentEntries: TalentEntry[]
}

export interface UseTalentRanks<Rank extends TalentRank> {
  rankEntries: ComputedRef<RankEntry<Rank>[]>
}

export function useTalentRanks<Rank extends TalentRank>(
  tree: MaybeRefOrGetter<TalentTreeData<Rank>>,
  build: Ref<TalentBuild>,
): UseTalentRanks<Rank> {
  const rankEntries = computed(() => toValue(tree).ranks.map((rank, rankIndex): RankEntry<Rank> => {
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
