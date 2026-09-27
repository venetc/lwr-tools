import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import { computed, toValue } from 'vue';

import { talentColumn } from '../lib/layout';
import { rankState, selectedTalentId } from './build';
import type { Talent, TalentBuild, TalentRank, TalentRankState, TalentTreeData } from './types';

export interface TalentEntry {
  talent: Talent
  isSelected: boolean
  column: number
}

export interface RankEntry<Rank extends TalentRank = TalentRank> {
  rank: Rank
  state: TalentRankState
  selectedId: string | null
  talentEntries: TalentEntry[]
}

/**
 * Ранги дерева с состоянием, выбором и колонками талантов для отрисовки.
 *
 * @param tree дерево талантов класса.
 * @param build выбранные таланты по рангам.
 */
export function useTalentRanks<Rank extends TalentRank>(
  tree: MaybeRefOrGetter<TalentTreeData<Rank>>,
  build: Ref<TalentBuild>,
): ComputedRef<RankEntry<Rank>[]> {
  return computed(() => toValue(tree).ranks.map((rank, rankIndex): RankEntry<Rank> => {
    const state = rankState(build.value, rankIndex);
    const selectedId = selectedTalentId(build.value, rankIndex);

    return {
      rank,
      state,
      selectedId,
      talentEntries: rank.talents.map((talent, talentIndex) => ({
        talent,
        isSelected: selectedId === talent.id,
        column: talentColumn(rank.talents.length, talentIndex),
      })),
    };
  }));
}
