import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { BiosoldierBuildData, OfficerRank } from '@entities/soldier';
import { highestSelectedStepIndex, OFFICER_RANKS, rankState } from '@entities/soldier';
import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerOption } from '@shared/ui/tiered-picker';
import { tierOption } from '@shared/ui/tiered-picker';

import { OFFICER_RANK_PICKER_ITEMS } from '../config/constants';
import type { BuildTreeTier } from './saved-tree';

/**
 * Biosoldier build shown in the officer tree: its officer perks with its lock.
 */
export type OfficerTreeBuild = Readonly<Pick<BiosoldierBuildData, 'officerPerks'> & { readonly: boolean }>;

/**
 * Picker tier of an officer rank.
 */
export interface OfficerRankTier extends BuildTreeTier {
  /** Officer rank of the tier. */
  officerRank: DeepReadonly<OfficerRank>
}

/**
 * Note of the officer perks of an officer rank: the rank the game requires for it, such as `Requires Corporal in game`.
 *
 * @param officerRank officer rank.
 */
const requiredRankNote = (officerRank: DeepReadonly<OfficerRank>) => `Requires ${officerRank.requiredRankName} in game`;

/**
 * Officer perks of the build as picker tiers by officer rank, and the item described while the user inspects none.
 *
 * @description Officer ranks are taken in any order and at any rank of the class tree: an officer rank with an officer
 * perk is completed, an empty one of an editable build is available, and an empty one of a readonly build is locked;
 * a readonly build makes every officer rank unclickable. Officer perks look as perks of a class tree rank and carry
 * the rank the game requires as a note. Gene mods and psionic abilities do not matter. Picker items come from
 * constants; a selection only rebuilds the options. The featured item is the officer perk of the highest trained
 * officer rank, otherwise the first officer perk of the first officer rank.
 *
 * @param build biosoldier build with its lock.
 */
export const useOfficerTiers = (build: MaybeRefOrGetter<OfficerTreeBuild>) => {
  const tiers = computed(() => {
    const { officerPerks, readonly } = toValue(build);

    return OFFICER_RANKS.map((officerRank, officerRankIndex): OfficerRankTier => {
      const selectedId = officerPerks[officerRankIndex] ?? null;
      const state = rankState(selectedId, readonly);
      const note = requiredRankNote(officerRank);

      return {
        id: officerRank.id,
        name: officerRank.name,
        officerRank,
        state,
        isDisabled: readonly,
        selectedId,
        outdatedItemIds: [],
        options: (OFFICER_RANK_PICKER_ITEMS[officerRankIndex] ?? []).map((item): TieredPickerOption => ({ ...tierOption(item, state, selectedId), note })),
      };
    });
  });

  const featuredPickerItem = computed(() => {
    const { officerPerks } = toValue(build);
    const officerRankIndex = highestSelectedStepIndex(officerPerks);
    const selectedPickerItem = OFFICER_RANK_PICKER_ITEMS[officerRankIndex]?.find(item => item.id === officerPerks[officerRankIndex]);

    return selectedPickerItem ?? OFFICER_RANK_PICKER_ITEMS[0]?.[0] ?? null;
  });

  return { tiers, featuredPickerItem };
};
