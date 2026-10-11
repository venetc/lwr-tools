import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { BiosoldierClassTreeRank, TreeAbility } from '@entities/biosoldier';
import { biosoldierClassTree, featuredPerk, rankState } from '@entities/biosoldier';
import type { TieredPickerItem, TieredPickerTier } from '@shared/ui/tiered-picker';

import type { BiosoldierBuild } from './biosoldier-builds';

/**
 * Picker tier of a soldier rank.
 */
export interface BiosoldierRankTier extends TieredPickerTier {
  /** Soldier rank of the tier. */
  rank: BiosoldierClassTreeRank
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
 * The tree is rebuilt only when the build class changes.
 *
 * @param build biosoldier build.
 */
export const useBiosoldierBuildTiers = (build: MaybeRefOrGetter<Readonly<BiosoldierBuild>>) => {
  const tree = computed(() => biosoldierClassTree(toValue(build).biosoldierClass));

  const tiers = computed(() => {
    const { perks, readonly } = toValue(build);

    return tree.value.ranks.map((rank, rankIndex): BiosoldierRankTier => {
      const state = rankState(perks, rankIndex, readonly);

      return {
        id: rank.id,
        name: rank.name,
        rank,
        state,
        isDisabled: readonly || rankIndex === 0 || state === 'locked',
        selectedId: perks[rankIndex] ?? null,
        items: rank.perks.map(perkItem),
      };
    });
  });

  const featuredItem = computed(() => {
    const perk = featuredPerk(tree.value, toValue(build).perks);

    if (!perk) return null;

    return perkItem(perk);
  });

  return { tree, tiers, featuredItem };
};
