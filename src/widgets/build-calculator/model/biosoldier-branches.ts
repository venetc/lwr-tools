import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { TieredPickerItem } from '@shared/ui/tiered-picker';

import type { BIOSOLDIER_BRANCH_TITLE } from '../config/constants';
import type { BiosoldierBuild } from './biosoldier-builds';
import type { ClassTreeRankTier } from './class-tree-tiers';
import { useClassTreeTiers } from './class-tree-tiers';
import type { BodyPartTier } from './gene-mod-tiers';
import { useGeneModTiers } from './gene-mod-tiers';
import type { OfficerRankTier } from './officer-tiers';
import { useOfficerTiers } from './officer-tiers';
import type { PsiLevelTier } from './psionic-tiers';
import { usePsionicTiers } from './psionic-tiers';
import { savedTreeTiers, shownTreeBuild, soldierOutdatedCells } from './saved-tree';

/**
 * Branch of a biosoldier build: the class tree, the gene mods, the psionic abilities or the officer perks.
 */
export type BiosoldierBranch = keyof typeof BIOSOLDIER_BRANCH_TITLE;

/**
 * Tier of a biosoldier branch: a rank of the class tree, a body part, a psi level or an officer rank.
 */
export type BiosoldierBuildTier = ClassTreeRankTier | BodyPartTier | PsiLevelTier | OfficerRankTier;

/**
 * Branch of a biosoldier build with its picker tiers.
 */
export interface BiosoldierBranchTiers {
  /** Branch id. */
  id: BiosoldierBranch
  /** Picker tiers of the branch, from lowest to highest. */
  tiers: readonly BiosoldierBuildTier[]
  /** Abilities selected in the branch. */
  selectedCount: number
  /** Item described while the user inspects none in the branch. */
  featuredPickerItem: TieredPickerItem | null
}

/**
 * Branch with its picker tiers, the abilities selected on them and its featured item.
 *
 * @param id branch id.
 * @param tiers picker tiers of the branch.
 * @param featuredPickerItem item described while the user inspects none in the branch.
 */
const branchTiers = (
  id: BiosoldierBranch,
  tiers: readonly BiosoldierBuildTier[],
  featuredPickerItem: TieredPickerItem | null,
): BiosoldierBranchTiers => ({
  id,
  tiers,
  selectedCount: tiers.filter(tier => tier.selectedId !== null).length,
  featuredPickerItem,
});

/**
 * Branches of a biosoldier build as picker tiers with their featured items, in tab order: the class tree, the gene mods,
 * the psionic abilities and the officer perks. An Outdated build shows its saved tree: frozen, with the abilities of its
 * code in the cells of their variants.
 *
 * @param build biosoldier build.
 */
export const useBiosoldierBranches = (build: MaybeRefOrGetter<Readonly<BiosoldierBuild>>) => {
  const shownBuild = computed(() => shownTreeBuild(toValue(build)));

  const classTree = useClassTreeTiers(shownBuild);

  const geneMods = useGeneModTiers(shownBuild);

  const psionic = usePsionicTiers(shownBuild);

  const officer = useOfficerTiers(shownBuild);

  const cellsByBranch = computed(() => soldierOutdatedCells(toValue(build).outdated?.selections ?? []));

  /**
   * Tiers of the branch with the outdated cells of an Outdated build.
   *
   * @param id branch id.
   * @param tiers picker tiers of the current tree.
   */
  const savedBranchTiers = <Tier extends BiosoldierBuildTier>(id: BiosoldierBranch, tiers: readonly Tier[]) => savedTreeTiers(tiers, cellsByBranch.value.get(id) ?? []);

  const branches = computed((): BiosoldierBranchTiers[] => [
    branchTiers('class-tree', savedBranchTiers('class-tree', classTree.tiers.value), classTree.featuredPickerItem.value),
    branchTiers('gene-mods', savedBranchTiers('gene-mods', geneMods.tiers.value), geneMods.featuredPickerItem.value),
    branchTiers('psionic', savedBranchTiers('psionic', psionic.tiers.value), psionic.featuredPickerItem.value),
    branchTiers('officer', savedBranchTiers('officer', officer.tiers.value), officer.featuredPickerItem.value),
  ]);

  return { tree: classTree.tree, branches };
};
