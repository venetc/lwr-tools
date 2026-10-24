import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import { SHIV_BUILD_NAME } from '@entities/shiv';
import type { TieredPickerGroup } from '@shared/ui/tiered-picker';

import { SHIV_TREE_GROUP_ID } from '../config/constants';
import { savedTreeTiers, shivOutdatedCells, shivRemovedPerks, shownTreeBuild } from './saved-tree';
import type { TechnologyLevelTier } from './shiv-build-tiers';
import { useShivBuildTiers } from './shiv-build-tiers';
import type { ShivBuild } from './shiv-builds';
import { useShivBuildsStore } from './shiv-builds';

/**
 * SHIV tree of a SHIV build as picker tiers, the item described while the user inspects none, and the perks gone from
 * the SHIV tree. An Outdated build shows its saved tree: frozen, with both perks of a collision selected and marked on
 * their technology level.
 *
 * @param build SHIV build.
 */
export const useShivSavedTree = (build: MaybeRefOrGetter<Readonly<ShivBuild>>) => {
  const { tiers, featuredPickerItem } = useShivBuildTiers(computed(() => shownTreeBuild(toValue(build))));

  const outdatedSelections = computed(() => toValue(build).outdated?.selections ?? []);

  const savedTiers = computed(() => savedTreeTiers(tiers.value, shivOutdatedCells(outdatedSelections.value)));

  const removedPerks = computed(() => shivRemovedPerks(outdatedSelections.value));

  return { tiers: savedTiers, featuredPickerItem, removedPerks };
};

/**
 * Tier groups of a SHIV build panel: the saved SHIV tree alone, the perks gone from it for the plate under the tree,
 * and the selection in it through the store.
 *
 * @param build SHIV build.
 */
export const useShivBuildGroups = (build: MaybeRefOrGetter<Readonly<ShivBuild>>) => {
  const shivBuildsStore = useShivBuildsStore();

  const { tiers, featuredPickerItem, removedPerks } = useShivSavedTree(build);

  const groups = computed((): TieredPickerGroup<TechnologyLevelTier>[] => [{
    id: SHIV_TREE_GROUP_ID,
    name: SHIV_BUILD_NAME,
    tiers: tiers.value,
    defaultItem: featuredPickerItem.value,
  }]);

  const hasRemovedPerks = computed(() => removedPerks.value.length > 0);

  /**
   * Selects a perk on the technology level of the SHIV tree, or clears the level.
   *
   * @param _groupId group id: always the SHIV tree.
   * @param levelIndex technology level index.
   * @param perkId selected perk id, or null to clear the level.
   */
  const select = (_groupId: string, levelIndex: number, perkId: string | null) => {
    shivBuildsStore.selectBuildPerk(toValue(build).id, levelIndex, perkId);
  };

  return { groups, removedPerks, hasRemovedPerks, select };
};
