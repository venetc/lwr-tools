import type { MaybeRefOrGetter } from 'vue';
import { computed } from 'vue';

import { useClassTreeTiers, useGeneModTiers, useOfficerTiers, usePsionicTiers } from '@entities/soldier';
import type { TieredPickerTier } from '@shared/ui/tiered-picker';

import {
  BIOSOLDIER_BRANCH_TITLE,
  MEC_TREE_GROUP_ID,
  MINI_TREE_LOCKED_STEP_NAME,
  MINI_TREE_OPEN_STEP_NAME,
  MINI_TREE_RANK_CAPTION,
  MINI_TREE_TECHNOLOGY_LEVEL_CAPTION,
  SHIV_MINI_TREE_TITLE,
  SHIV_TREE_GROUP_ID,
} from '../config/constants';
import type { BiosoldierBranch } from './biosoldier-build-groups';
import type { BiosoldierBuild } from './biosoldier-builds';
import type { MecBuild } from './mec-builds';
import { useShivBuildTiers } from './shiv-build-tiers';
import type { ShivBuild } from './shiv-builds';

/**
 * Look of a mini-tree step: an ability is selected, the step is open for selection, or it is locked.
 */
export type MiniTreeStepState = 'selected' | 'open' | 'locked';

/**
 * Step of a mini-tree: a rank, a body part, a psi level or a technology level.
 */
export interface MiniTreeStep {
  /** Tier id of the step. */
  id: string
  /** Short caption under the step. */
  caption: string
  /** Accessible name: the step and its ability, such as `Sergeant: Lightning Reflexes`. */
  label: string
  /** Icon of the selected ability in its selected look; null for an empty step. */
  icon: string | null
  /** Look of the step. */
  state: MiniTreeStepState
}

/**
 * Row of a mini-tree: one branch of the build, coloured as the branch; a MEC class tree and the SHIV tree take the colour
 * of the class tree.
 */
export interface MiniTreeRow {
  /** Row id, unique within the mini-tree. */
  id: string
  /** Branch title, also the accessible name of the row. */
  title: string
  /** Branch whose colour the row takes. */
  tone: BiosoldierBranch
  /** Steps from lowest to highest. */
  steps: MiniTreeStep[]
}

/**
 * Step of a mini-tree for a picker tier: the selected ability with its selected icon, otherwise an empty step open for
 * selection or locked; a selection missing from the tier items leaves the step locked.
 *
 * @param tier picker tier of the step.
 * @param caption short caption under the step.
 */
export const miniTreeStep = (tier: TieredPickerTier, caption: string): MiniTreeStep => {
  const selectedItem = tier.options.find(({ item }) => item.id === tier.selectedId)?.item;

  if (selectedItem) {
    return { id: tier.id, caption, label: `${tier.name}: ${selectedItem.name}`, icon: selectedItem.icon.selected, state: 'selected' };
  }

  const state = tier.state === 'available' ? 'open' : 'locked';
  const stepName = state === 'locked' ? MINI_TREE_LOCKED_STEP_NAME : MINI_TREE_OPEN_STEP_NAME;

  return { id: tier.id, caption, label: `${tier.name}: ${stepName}`, icon: null, state };
};

/**
 * Mini-tree of a biosoldier build: the class tree, the gene mods, the psionic abilities and the officer tree, each a row
 * even when empty.
 *
 * @param build biosoldier build.
 */
export const useBiosoldierMiniTree = (build: MaybeRefOrGetter<Readonly<BiosoldierBuild>>) => {
  const classTree = useClassTreeTiers(build);

  const geneMods = useGeneModTiers(build);

  const psionic = usePsionicTiers(build);

  const officer = useOfficerTiers(build);

  return computed((): MiniTreeRow[] => [
    {
      id: 'class-tree',
      title: BIOSOLDIER_BRANCH_TITLE['class-tree'],
      tone: 'class-tree',
      steps: classTree.tiers.value.map(tier => miniTreeStep(tier, MINI_TREE_RANK_CAPTION[tier.rank.id])),
    },
    {
      id: 'gene-mods',
      title: BIOSOLDIER_BRANCH_TITLE['gene-mods'],
      tone: 'gene-mods',
      steps: geneMods.tiers.value.map(tier => miniTreeStep(tier, tier.name)),
    },
    {
      id: 'psionic',
      title: BIOSOLDIER_BRANCH_TITLE.psionic,
      tone: 'psionic',
      steps: psionic.tiers.value.map(tier => miniTreeStep(tier, tier.name)),
    },
    {
      id: 'officer',
      title: BIOSOLDIER_BRANCH_TITLE.officer,
      tone: 'officer',
      steps: officer.tiers.value.map(tier => miniTreeStep(tier, tier.officerRank.abbreviation)),
    },
  ]);
};

/**
 * Mini-tree of a MEC build: the class tree as one row.
 *
 * @param build MEC build.
 */
export const useMecMiniTree = (build: MaybeRefOrGetter<Readonly<MecBuild>>) => {
  const { tiers } = useClassTreeTiers(build);

  return computed((): MiniTreeRow[] => [{
    id: MEC_TREE_GROUP_ID,
    title: BIOSOLDIER_BRANCH_TITLE['class-tree'],
    tone: 'class-tree',
    steps: tiers.value.map(tier => miniTreeStep(tier, MINI_TREE_RANK_CAPTION[tier.rank.id])),
  }]);
};

/**
 * Mini-tree of a SHIV build: the SHIV tree as one row.
 *
 * @param build SHIV build.
 */
export const useShivMiniTree = (build: MaybeRefOrGetter<Readonly<ShivBuild>>) => {
  const { tiers } = useShivBuildTiers(build);

  return computed((): MiniTreeRow[] => [{
    id: SHIV_TREE_GROUP_ID,
    title: SHIV_MINI_TREE_TITLE,
    tone: 'class-tree',
    steps: tiers.value.map(tier => miniTreeStep(tier, MINI_TREE_TECHNOLOGY_LEVEL_CAPTION[tier.level.id])),
  }]);
};
