import type { MaybeRefOrGetter } from 'vue';
import { computed } from 'vue';

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
import type { BiosoldierBranch, BiosoldierBuildTier } from './biosoldier-branches';
import { useBiosoldierBranches } from './biosoldier-branches';
import type { BiosoldierBuild } from './biosoldier-builds';
import { useClassTreeTiers } from './class-tree-tiers';
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
 * Short caption under a step of a biosoldier mini-tree: the short rank name, the officer rank abbreviation, or the name
 * of a body part or a psi level.
 *
 * @param tier tier of a biosoldier branch.
 */
const biosoldierStepCaption = (tier: BiosoldierBuildTier): string => {
  if ('rank' in tier) return MINI_TREE_RANK_CAPTION[tier.rank.id];
  if ('officerRank' in tier) return tier.officerRank.abbreviation;
  return tier.name;
};

/**
 * Mini-tree of a biosoldier build: a row for each branch, even when empty.
 *
 * @param build biosoldier build.
 */
export const useBiosoldierMiniTree = (build: MaybeRefOrGetter<Readonly<BiosoldierBuild>>) => {
  const { branches } = useBiosoldierBranches(build);

  return computed(() => branches.value.map((branch): MiniTreeRow => ({
    id: branch.id,
    title: BIOSOLDIER_BRANCH_TITLE[branch.id],
    tone: branch.id,
    steps: branch.tiers.map(tier => miniTreeStep(tier, biosoldierStepCaption(tier))),
  })));
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
