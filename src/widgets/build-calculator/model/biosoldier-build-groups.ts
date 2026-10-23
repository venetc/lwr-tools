import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { SvgIcon } from '@shared/ui/svg-icon';
import type { TieredPickerGroup } from '@shared/ui/tiered-picker';

import { BIOSOLDIER_BRANCH_TITLE } from '../config/constants';
import type { BiosoldierBranch, BiosoldierBranchTiers, BiosoldierBuildTier } from './biosoldier-branches';
import { useBiosoldierBranches } from './biosoldier-branches';
import type { BiosoldierBuild } from './biosoldier-builds';
import { useBiosoldierBuildsStore } from './biosoldier-builds';

/**
 * Label of a tier of a biosoldier build panel.
 */
export interface BiosoldierTierLabel {
  /** Rank icon; null for other tiers. */
  icon: SvgIcon | null
  /** Officer rank medal; null for other tiers. */
  image: string | null
  /** Whether the medal is faded: the officer rank is locked. */
  faded: boolean
  /** Tier name. */
  name: string
  /** Why the officer rank is locked; null for other tiers and open officer ranks. */
  caption: string | null
}

/**
 * Tier group of a biosoldier build panel: one branch with its tab title and counter.
 */
export interface BiosoldierBuildGroup extends TieredPickerGroup<BiosoldierBuildTier> {
  /** Branch of the group. */
  id: BiosoldierBranch
  /** Tab title of the branch. */
  title: string
  /** Selected abilities of the branch out of its tiers, such as `3/7`. */
  counter: string
  /** Whether nothing is selected in the branch. */
  isEmpty: boolean
}

/**
 * Tier group of a branch with its tab: the accessible name carries the counter, such as "Gene mods, 2 of 5".
 *
 * @param branch branch with its picker tiers.
 */
const branchGroup = (branch: BiosoldierBranchTiers): BiosoldierBuildGroup => ({
  id: branch.id,
  name: `${BIOSOLDIER_BRANCH_TITLE[branch.id]}, ${branch.selectedCount} of ${branch.tiers.length}`,
  title: BIOSOLDIER_BRANCH_TITLE[branch.id],
  counter: `${branch.selectedCount}/${branch.tiers.length}`,
  isEmpty: branch.selectedCount === 0,
  tiers: branch.tiers,
  defaultItem: branch.featuredPickerItem,
});

/**
 * Tier groups of a biosoldier build panel, one by branch, and the selection in them through the store.
 *
 * @param build biosoldier build.
 */
export const useBiosoldierBuildGroups = (build: MaybeRefOrGetter<Readonly<BiosoldierBuild>>) => {
  const biosoldierBuildsStore = useBiosoldierBuildsStore();

  const { tree, branches } = useBiosoldierBranches(build);

  const groups = computed(() => branches.value.map(branchGroup));

  const selectByBranch = new Map<string, (buildId: string, tierIndex: number, abilityId: string | null) => void>([
    ['class-tree', biosoldierBuildsStore.selectBuildPerk],
    ['gene-mods', biosoldierBuildsStore.selectBuildGeneMod],
    ['psionic', biosoldierBuildsStore.selectBuildPsionicAbility],
    ['officer', biosoldierBuildsStore.selectBuildOfficerPerk],
  ]);

  /**
   * Selects an ability on a tier of the branch, or clears the tier: a perk on a rank, a gene mod of a body part,
   * a psionic ability on a psi level or an officer perk on an officer rank. An unknown branch changes nothing.
   *
   * @param branch branch of the tier.
   * @param tierIndex tier index in the branch.
   * @param abilityId selected ability id, or null to clear the tier.
   */
  const select = (branch: string, tierIndex: number, abilityId: string | null) => {
    const selectInBranch = selectByBranch.get(branch);

    if (!selectInBranch) return;

    selectInBranch(toValue(build).id, tierIndex, abilityId);
  };

  return { tree, groups, select };
};

/**
 * Label of a tier: the rank icon for the class tree; the medal, faded while locked, and the lock reason under the name
 * for an officer rank; the name alone for a body part or a psi level.
 *
 * @param tier tier of a biosoldier build panel.
 */
export const tierLabel = (tier: BiosoldierBuildTier): BiosoldierTierLabel => {
  if ('officerRank' in tier) {
    return { icon: null, image: tier.officerRank.medal, faded: tier.state === 'locked', name: tier.name, caption: tier.lockReason };
  }

  return { icon: 'rank' in tier ? tier.rank.icon : null, image: null, faded: false, name: tier.name, caption: null };
};
