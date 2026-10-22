import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { BodyPartTier, ClassTreeRankTier, OfficerRankTier, PsiLevelTier } from '@entities/soldier';
import { useClassTreeTiers, useGeneModTiers, useOfficerTiers, usePsionicTiers } from '@entities/soldier';
import type { SvgIcon } from '@shared/ui/svg-icon';
import type { TieredPickerGroup, TieredPickerItem } from '@shared/ui/tiered-picker';

import { BIOSOLDIER_BRANCH_TITLE } from '../config/constants';
import type { BiosoldierBuild } from './biosoldier-builds';
import { useBiosoldierBuildsStore } from './biosoldier-builds';

/**
 * Branch of a biosoldier build: the class tree, the gene mods, the psionic abilities or the officer perks.
 */
export type BiosoldierBranch = keyof typeof BIOSOLDIER_BRANCH_TITLE;

/**
 * Tier of a biosoldier build panel: a rank of the class tree, a body part, a psi level or an officer rank.
 */
export type BiosoldierBuildTier = ClassTreeRankTier | BodyPartTier | PsiLevelTier | OfficerRankTier;

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
 * @param branch branch of the group.
 * @param tiers branch tiers.
 * @param selectedCount abilities selected in the branch.
 * @param defaultItem item described while the user inspects none in the branch.
 */
const branchGroup = (
  branch: BiosoldierBranch,
  tiers: readonly BiosoldierBuildTier[],
  selectedCount: number,
  defaultItem: TieredPickerItem | null,
): BiosoldierBuildGroup => ({
  id: branch,
  name: `${BIOSOLDIER_BRANCH_TITLE[branch]}, ${selectedCount} of ${tiers.length}`,
  title: BIOSOLDIER_BRANCH_TITLE[branch],
  counter: `${selectedCount}/${tiers.length}`,
  isEmpty: selectedCount === 0,
  tiers,
  defaultItem,
});

/**
 * Tier groups of a biosoldier build panel: the class tree, the gene mods, the psionic abilities and the officer perks,
 * and the selection in them through the store.
 *
 * @param build biosoldier build.
 */
export const useBiosoldierBuildGroups = (build: MaybeRefOrGetter<Readonly<BiosoldierBuild>>) => {
  const biosoldierBuildsStore = useBiosoldierBuildsStore();

  const classTree = useClassTreeTiers(build);

  const geneMods = useGeneModTiers(build);

  const psionic = usePsionicTiers(build);

  const officer = useOfficerTiers(build);

  const groups = computed((): BiosoldierBuildGroup[] => {
    const { perks, geneMods: selectedGeneMods, psionicAbilities, officerPerks } = toValue(build);

    return [
      branchGroup('class-tree', classTree.tiers.value, perks.length, classTree.featuredPickerItem.value),
      branchGroup(
        'gene-mods',
        geneMods.tiers.value,
        selectedGeneMods.filter(geneModId => geneModId !== null).length,
        geneMods.featuredPickerItem.value,
      ),
      branchGroup('psionic', psionic.tiers.value, psionicAbilities.length, psionic.featuredPickerItem.value),
      branchGroup('officer', officer.tiers.value, officerPerks.length, officer.featuredPickerItem.value),
    ];
  });

  /**
   * Selects an ability on a tier of the branch, or clears the tier: a perk on a rank, a gene mod of a body part,
   * a psionic ability on a psi level or an officer perk on an officer rank.
   *
   * @param branch branch of the tier.
   * @param tierIndex tier index in the branch.
   * @param abilityId selected ability id, or null to clear the tier.
   */
  const select = (branch: string, tierIndex: number, abilityId: string | null) => {
    const buildId = toValue(build).id;

    if (branch === 'gene-mods') {
      biosoldierBuildsStore.selectBuildGeneMod(buildId, tierIndex, abilityId);
      return;
    }

    if (branch === 'psionic') {
      biosoldierBuildsStore.selectBuildPsionicAbility(buildId, tierIndex, abilityId);
      return;
    }

    if (branch === 'officer') {
      biosoldierBuildsStore.selectBuildOfficerPerk(buildId, tierIndex, abilityId);
      return;
    }

    biosoldierBuildsStore.selectBuildPerk(buildId, tierIndex, abilityId);
  };

  return { tree: classTree.tree, groups, select };
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
