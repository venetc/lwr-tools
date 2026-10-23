import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { ClassTreeRank, SoldierBuildData } from '@entities/soldier';
import { classTree, featuredPerk, rankState } from '@entities/soldier';
import type { TieredPickerTier } from '@shared/ui/tiered-picker';
import { tierOption } from '@shared/ui/tiered-picker';

import { treeAbilityPickerItem } from './ability-picker-item';

/**
 * Soldier build shown in a class tree: build data with its lock.
 */
export type ClassTreeBuild = Readonly<SoldierBuildData & { readonly: boolean }>;

/**
 * Picker tier of a soldier rank.
 */
export interface ClassTreeRankTier extends TieredPickerTier {
  /** Soldier rank of the tier. */
  rank: ClassTreeRank
}

/**
 * Class tree of the build as picker tiers, and the item described while the user inspects none.
 *
 * @description Ranks are taken in any order: an empty rank of an editable build is available, a rank with a perk is
 * completed, and an empty rank of a readonly build is locked. A tier is disabled for a readonly build or the rank of the
 * base perk. Perks of an available rank look available, the perk selected on a completed rank looks selected, and the
 * rest look disabled, as in the game; a disabled-looking perk of a completed rank still replaces the selection.
 * The tree and its picker items are built only when the build class changes; a selection only rebuilds the options.
 *
 * @param build soldier build with its lock.
 */
export const useClassTreeTiers = (build: MaybeRefOrGetter<ClassTreeBuild>) => {
  const tree = computed(() => classTree(toValue(build).soldierClass));

  const rankPickerItems = computed(() => tree.value.ranks.map(rank => rank.perks.map(treeAbilityPickerItem)));

  const pickerItemById = computed(() => new Map(rankPickerItems.value.flat().map(item => [item.id, item])));

  const tiers = computed(() => {
    const { perks, readonly } = toValue(build);

    return tree.value.ranks.map((rank, rankIndex): ClassTreeRankTier => {
      const selectedId = perks[rankIndex] ?? null;
      const state = rankState(selectedId, readonly);

      return {
        id: rank.id,
        name: rank.name,
        rank,
        state,
        isDisabled: readonly || rankIndex === 0,
        selectedId,
        options: (rankPickerItems.value[rankIndex] ?? []).map(item => tierOption(item, state, selectedId)),
      };
    });
  });

  const featuredPickerItem = computed(() => {
    const perk = featuredPerk(tree.value, toValue(build).perks);

    if (!perk) return null;

    return pickerItemById.value.get(perk.id) ?? null;
  });

  return { tree, tiers, featuredPickerItem };
};
