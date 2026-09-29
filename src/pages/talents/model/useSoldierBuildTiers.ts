import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { SoldierTalentRank, Talent } from '@entities/soldier';
import { featuredTalent, soldierClassTalentTree, talentRankState } from '@entities/soldier';
import type { TieredPickerItem, TieredPickerTier } from '@shared/ui/tiered-picker';

import type { SoldierBuild } from './talents';

/**
 * Picker tier of a soldier rank.
 */
export interface SoldierRankTier extends TieredPickerTier {
  /** Soldier rank of the tier. */
  rank: SoldierTalentRank
}

/**
 * Picker item of a talent, with the talents it grants as related items.
 *
 * @param talent tree talent.
 */
const talentItem = (talent: Talent): TieredPickerItem => ({
  id: talent.id,
  name: talent.name,
  description: talent.description,
  icon: talent.icon,
  related: talent.grants.map(talentItem),
});

/**
 * Class talent tree of the build as picker tiers, and the item described while the user inspects none.
 *
 * @description A tier is disabled for a readonly build, a rank granted with the class, or a locked rank.
 * The tree is rebuilt only when the build class changes.
 *
 * @param build soldier build.
 */
export const useSoldierBuildTiers = (build: MaybeRefOrGetter<Readonly<SoldierBuild>>) => {
  const tree = computed(() => soldierClassTalentTree(toValue(build).soldierClass));

  const tiers = computed(() => {
    const { talents, readonly } = toValue(build);

    return tree.value.ranks.map((rank, rankIndex): SoldierRankTier => {
      const state = talentRankState(talents, rankIndex, readonly);

      return {
        id: rank.id,
        name: rank.name,
        rank,
        state,
        isDisabled: readonly || rankIndex < tree.value.baseBuild.length || state === 'locked',
        selectedId: talents[rankIndex] ?? null,
        items: rank.talents.map(talentItem),
      };
    });
  });

  const featuredItem = computed(() => {
    const talent = featuredTalent(tree.value, toValue(build).talents);

    if (!talent) return null;

    return talentItem(talent);
  });

  return { tree, tiers, featuredItem };
};
