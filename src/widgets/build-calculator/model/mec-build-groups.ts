import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { TieredPickerGroup } from '@shared/ui/tiered-picker';

import { MEC_TREE_GROUP_ID } from '../config/constants';
import type { ClassTreeRankTier } from './class-tree-tiers';
import { useClassTreeTiers } from './class-tree-tiers';
import type { MecBuild } from './mec-builds';
import { useMecBuildsStore } from './mec-builds';
import { savedTreeTiers, shownTreeBuild, soldierOutdatedCells } from './saved-tree';

/**
 * Class tree of a MEC build as picker tiers, and the item described while the user inspects none. An Outdated build
 * shows its saved tree: frozen, with the perks of its code in the cells of their variants.
 *
 * @param build MEC build.
 */
export const useMecSavedTree = (build: MaybeRefOrGetter<Readonly<MecBuild>>) => {
  const { tree, tiers, featuredPickerItem } = useClassTreeTiers(computed(() => shownTreeBuild(toValue(build))));

  const outdatedCells = computed(() => soldierOutdatedCells(toValue(build).outdated?.selections ?? []).get(MEC_TREE_GROUP_ID) ?? []);

  const savedTiers = computed(() => savedTreeTiers(tiers.value, outdatedCells.value));

  return { tree, tiers: savedTiers, featuredPickerItem };
};

/**
 * Tier groups of a MEC build panel: the saved class tree alone, and the selection in it through the store.
 *
 * @param build MEC build.
 */
export const useMecBuildGroups = (build: MaybeRefOrGetter<Readonly<MecBuild>>) => {
  const mecBuildsStore = useMecBuildsStore();

  const { tree, tiers, featuredPickerItem } = useMecSavedTree(build);

  const groups = computed((): TieredPickerGroup<ClassTreeRankTier>[] => [{
    id: MEC_TREE_GROUP_ID,
    name: tree.value.name,
    tiers: tiers.value,
    defaultItem: featuredPickerItem.value,
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
