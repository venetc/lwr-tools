import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerAppearance, TieredPickerItem, TieredPickerOption, TieredPickerTier } from '@shared/ui/tiered-picker';

import { OFFICER_RANK_PICKER_ITEMS } from '../config/constants/officer-rank-picker-items';
import { OFFICER_RANKS } from '../config/constants/officer-ranks';
import type { BiosoldierBuildData } from './build';
import type { BuildBlockReason } from './build-rules';
import { officerPerkBlockReason } from './build-rules';
import type { OfficerRank } from './officer-ranks';
import { officerRankState } from './officer-ranks';
import type { RankState } from './ranks';

/**
 * Biosoldier build shown in the officer tree: its perks and officer perks with its lock.
 */
export type OfficerTreeBuild = Readonly<Pick<BiosoldierBuildData, 'perks' | 'officerPerks'> & { readonly: boolean }>;

/**
 * Picker tier of an officer rank.
 */
export interface OfficerRankTier extends TieredPickerTier {
  /** Officer rank of the tier. */
  officerRank: DeepReadonly<OfficerRank>
  /** Why the officer rank is locked, such as `Requires Corporal`; null for an open one or a readonly build. */
  lockReason: string | null
}

/**
 * Why the officer rank is locked, in words: first its required rank missing in the class tree, then the empty officer
 * rank below; null for an open officer rank or a readonly build.
 *
 * @param officerRank officer rank.
 * @param lowerOfficerRank officer rank below, or null for the first one.
 * @param blockReason why a Build rule blocks the officer rank, or null.
 * @param isReadonly whether the build is readonly.
 */
const lockReason = (
  officerRank: DeepReadonly<OfficerRank>,
  lowerOfficerRank: DeepReadonly<OfficerRank> | null,
  blockReason: BuildBlockReason | null,
  isReadonly: boolean,
): string | null => {
  if (isReadonly) return null;

  if (blockReason === 'required-rank') return `Requires ${officerRank.requiredRankName}`;

  if (blockReason === 'skipped-step' && lowerOfficerRank) return `Requires ${lowerOfficerRank.name}`;

  return null;
};

/**
 * Look of an officer perk: the chosen one is selected; the others of the open officer rank are available, and the rest
 * are disabled, as in the class tree; a disabled-looking officer perk of a completed officer rank still replaces the
 * selection.
 *
 * @param perkId officer perk id.
 * @param selectedId id of the officer perk of the officer rank, or null.
 * @param officerRankState state of the officer rank.
 */
const officerPerkAppearance = (perkId: string, selectedId: string | null, officerRankState: RankState): TieredPickerAppearance => {
  if (perkId === selectedId) return 'selected';
  if (officerRankState === 'available') return 'available';
  return 'disabled';
};

/**
 * Option of an officer perk with the look of `officerPerkAppearance`, noted with the lock reason of its officer rank.
 *
 * @param item picker item of the officer perk.
 * @param selectedId id of the officer perk of the officer rank, or null.
 * @param officerRankState state of the officer rank.
 * @param note lock reason of the officer rank, or null.
 */
const officerPerkOption = (
  item: TieredPickerItem,
  selectedId: string | null,
  officerRankState: RankState,
  note: string | null,
): TieredPickerOption => ({
  item,
  appearance: officerPerkAppearance(item.id, selectedId, officerRankState),
  isDisabled: false,
  note,
});

/**
 * Officer perks of the build as picker tiers by officer rank, and the item described while the user inspects none.
 *
 * @description Officer ranks are trained in order like ranks, and each one opens only once the class tree completes its
 * required rank: trained officer ranks are completed, the next open one is available, and the rest are locked and
 * unclickable with a lock reason under the name and on their officer perks. A readonly build locks every officer rank
 * without a reason and keeps the chosen officer perks selected. Gene mods and psionic abilities do not matter.
 * Picker items come from constants; a selection only rebuilds the options. The featured item is the officer perk of
 * the highest trained officer rank, otherwise the first officer perk of the first officer rank.
 *
 * @param build biosoldier build with its lock.
 */
export const useOfficerTiers = (build: MaybeRefOrGetter<OfficerTreeBuild>) => {
  const tiers = computed(() => {
    const officerTreeBuild = toValue(build);
    const { officerPerks, readonly } = officerTreeBuild;

    return OFFICER_RANKS.map((officerRank, officerRankIndex): OfficerRankTier => {
      const blockReason = officerPerkBlockReason(officerTreeBuild, officerRankIndex, null);
      const state = officerRankState(officerPerks, officerRankIndex, readonly, blockReason !== null);
      const selectedId = officerPerks[officerRankIndex] ?? null;
      const reason = lockReason(officerRank, OFFICER_RANKS[officerRankIndex - 1] ?? null, blockReason, readonly);

      return {
        id: officerRank.id,
        name: officerRank.name,
        officerRank,
        lockReason: reason,
        state,
        isDisabled: state === 'locked',
        selectedId,
        options: (OFFICER_RANK_PICKER_ITEMS[officerRankIndex] ?? []).map(item => officerPerkOption(item, selectedId, state, reason)),
      };
    });
  });

  const featuredPickerItem = computed(() => {
    const { officerPerks } = toValue(build);
    const officerRankIndex = officerPerks.length - 1;
    const selectedPickerItem = OFFICER_RANK_PICKER_ITEMS[officerRankIndex]?.find(item => item.id === officerPerks[officerRankIndex]);

    return selectedPickerItem ?? OFFICER_RANK_PICKER_ITEMS[0]?.[0] ?? null;
  });

  return { tiers, featuredPickerItem };
};
