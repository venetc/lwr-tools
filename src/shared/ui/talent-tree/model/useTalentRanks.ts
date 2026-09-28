import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { Talent, TalentBuild, TalentRank, TalentRankState, TalentTreeData } from '@shared/lib/talent-tree';
import { isRankGranted, rankState, selectedTalentId } from '@shared/lib/talent-tree';

import { talentColumn } from '../lib/layout';

export interface TalentEntry {
  talent: Talent
  isSelected: boolean
  column: number
}

export interface RankEntry<Rank extends TalentRank = TalentRank> {
  rank: Rank
  state: TalentRankState
  isGranted: boolean
  selectedId: string | null
  talentEntries: TalentEntry[]
}

/**
 * Tree ranks with state, selection and talent columns for rendering.
 *
 * @param tree class talent tree.
 * @param build selected talents by rank.
 * @param readonly whether the build is readonly.
 */
export const useTalentRanks = <Rank extends TalentRank>(
  tree: MaybeRefOrGetter<TalentTreeData<Rank>>,
  build: MaybeRefOrGetter<TalentBuild>,
  readonly: MaybeRefOrGetter<boolean>,
): ComputedRef<RankEntry<Rank>[]> => {
  return computed(() => {
    const treeValue = toValue(tree);
    const buildValue = toValue(build);

    return treeValue.ranks.map((rank, rankIndex): RankEntry<Rank> => {
      const state = rankState(buildValue, rankIndex, toValue(readonly));
      const selectedId = selectedTalentId(buildValue, rankIndex);

      return {
        rank,
        state,
        isGranted: isRankGranted(treeValue, rankIndex),
        selectedId,
        talentEntries: rank.talents.map((talent, talentIndex) => ({
          talent,
          isSelected: selectedId === talent.id,
          column: talentColumn(rank.talents.length, talentIndex),
        })),
      };
    });
  });
};
