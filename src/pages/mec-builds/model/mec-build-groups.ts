import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { ClassTreeRankTier } from '@entities/soldier';
import { useClassTreeTiers } from '@entities/soldier';
import type { TieredPickerGroup } from '@shared/ui/tiered-picker';

import { CLASS_TREE_GROUP_ID } from '../config/constants';
import type { MecBuild } from './mec-builds';
import { useMecBuildsStore } from './mec-builds';

/**
 * Tier groups of a MEC build panel: the class tree alone, and the selection in it through the store.
 *
 * @param build MEC build.
 */
export const useMecBuildGroups = (build: MaybeRefOrGetter<Readonly<MecBuild>>) => {
  const mecBuildsStore = useMecBuildsStore();

  const { tree, tiers, featuredItem } = useClassTreeTiers(build);

  const groups = computed((): TieredPickerGroup<ClassTreeRankTier>[] => [{
    id: CLASS_TREE_GROUP_ID,
    name: tree.value.name,
    tiers: tiers.value,
    defaultItem: featuredItem.value,
  }]);

  /**
   * Selects a perk on the rank of the class tree, or clears the rank.
   *
   * @param _groupId group id: always the class tree.
   * @param rankIndex rank index in the tree.
   * @param perkId selected perk id, or null to clear the rank.
   */
  const select = (_groupId: string, rankIndex: number, perkId: string | null) => {
    mecBuildsStore.selectBuildPerk(toValue(build).id, rankIndex, perkId);
  };

  return { tree, groups, select };
};
