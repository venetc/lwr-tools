import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { TieredPickerItem, TieredPickerTier } from '@shared/ui/tiered-picker';
import { tierOption } from '@shared/ui/tiered-picker';

import type { SoldierBuildData } from './build';
import type { ClassTreeRank, TreeAbility } from './class-tree';
import { classTree, featuredPerk, rankState } from './class-tree';

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
 * Picker item of a tree ability, with the abilities it grants as related items.
 *
 * @param ability tree ability: a perk or a granted ability.
 */
const perkItem = (ability: TreeAbility): TieredPickerItem => ({
  id: ability.id,
  name: ability.name,
  description: ability.description,
  icon: ability.icon,
  related: ability.grants.map(perkItem),
});

/**
 * Class tree of the build as picker tiers, and the item described while the user inspects none.
 *
 * @description A tier is disabled for a readonly build, the rank of the base perk, or a locked rank.
 * Perks of the available rank look available, the perk selected on a completed rank looks selected, and the rest look
 * disabled, as in the game; a disabled-looking perk of a completed rank still replaces the selection.
 * The tree and its picker items are built only when the build class changes; a selection only rebuilds the options.
 *
 * @param build soldier build with its lock.
 */
export const useClassTreeTiers = (build: MaybeRefOrGetter<ClassTreeBuild>) => {
  const tree = computed(() => classTree(toValue(build).soldierClass));

  const rankItems = computed(() => tree.value.ranks.map(rank => rank.perks.map(perkItem)));

  const itemById = computed(() => new Map(rankItems.value.flat().map(item => [item.id, item])));

  const tiers = computed(() => {
    const { perks, readonly } = toValue(build);

    return tree.value.ranks.map((rank, rankIndex): ClassTreeRankTier => {
      const state = rankState(perks, rankIndex, readonly);
      const selectedId = perks[rankIndex] ?? null;

      return {
        id: rank.id,
        name: rank.name,
        rank,
        state,
        isDisabled: readonly || rankIndex === 0 || state === 'locked',
        selectedId,
        options: (rankItems.value[rankIndex] ?? []).map(item => tierOption(item, state, selectedId)),
      };
    });
  });

  const featuredItem = computed(() => {
    const perk = featuredPerk(tree.value, toValue(build).perks);

    if (!perk) return null;

    return itemById.value.get(perk.id) ?? null;
  });

  return { tree, tiers, featuredItem };
};
