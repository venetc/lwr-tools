import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  bodyPartState,
  classTree,
  featuredPerk,
  geneModBlockReason,
  highestSelectedStepIndex,
  psiLevelState,
  psionicAbilityBlockReason,
  rankState,
} from '@entities/soldier';
import { useBiosoldierBranches } from '@widgets/build-calculator/model/biosoldier-branches';

import {
  CLASS_TREE_MOCK,
  EMPTY_BUILD,
  FILLED_BUILD,
  FROZEN_TIERS,
  OUTDATED_BUILD,
  OUTDATED_ITEM_IDS,
  READONLY_FILLED_BUILD,
  RIGHT_PERK,
} from './biosoldier-branches.mock';

vi.mock('@entities/soldier', async () => {
  const { BODY_PARTS_MOCK, OFFICER_RANKS_MOCK, PSI_LEVELS_MOCK, treeAbilityStub } = await import('./biosoldier-branches.mock');

  return {
    BODY_PARTS: BODY_PARTS_MOCK,
    OFFICER_RANKS: OFFICER_RANKS_MOCK,
    PSI_LEVELS: PSI_LEVELS_MOCK,
    bodyPartState: vi.fn(),
    classTree: vi.fn(),
    featuredPerk: vi.fn(),
    geneModBlockReason: vi.fn(),
    highestSelectedStepIndex: vi.fn(),
    psiLevelState: vi.fn(),
    psionicAbilityBlockReason: vi.fn(),
    rankState: vi.fn(),
    treeAbility: treeAbilityStub,
  };
});

vi.mock('@entities/shiv', () => ({ TECHNOLOGY_LEVELS: [] }));

beforeEach(() => {
  vi.mocked(bodyPartState).mockReset().mockReturnValue('available');
  vi.mocked(classTree).mockReset().mockReturnValue(CLASS_TREE_MOCK);
  vi.mocked(featuredPerk).mockReset().mockReturnValue(null);
  vi.mocked(geneModBlockReason).mockReset().mockReturnValue(null);
  vi.mocked(highestSelectedStepIndex).mockReset().mockReturnValue(-1);
  vi.mocked(psiLevelState).mockReset().mockReturnValue('available');
  vi.mocked(psionicAbilityBlockReason).mockReset().mockReturnValue(null);
  vi.mocked(rankState).mockReset().mockReturnValue('available');
});

describe('useBiosoldierBranches', () => {
  it('lists the class tree, the gene mods, the psionic abilities and the officer perks in this order', () => {
    const { branches } = useBiosoldierBranches(EMPTY_BUILD);

    expect(branches.value.map(({ id }) => id)).toEqual(['class-tree', 'gene-mods', 'psionic', 'officer']);
  });

  it('counts the abilities selected in each branch', () => {
    const { branches } = useBiosoldierBranches(FILLED_BUILD);

    expect(branches.value.map(({ selectedCount }) => selectedCount)).toEqual([2, 1, 1, 1]);
  });

  it('counts the selected abilities of a build whose steps are all locked', () => {
    vi.mocked(rankState).mockReturnValue('locked');
    vi.mocked(bodyPartState).mockReturnValue('locked');
    vi.mocked(psiLevelState).mockReturnValue('locked');

    const { branches } = useBiosoldierBranches(READONLY_FILLED_BUILD);

    expect(branches.value.map(({ selectedCount }) => selectedCount)).toEqual([2, 1, 1, 1]);
  });

  it('features an ability in each branch', () => {
    vi.mocked(featuredPerk).mockReturnValue(RIGHT_PERK);
    vi.mocked(highestSelectedStepIndex).mockReturnValue(0);

    const { branches } = useBiosoldierBranches(FILLED_BUILD);

    expect(branches.value.map(({ featuredPickerItem }) => featuredPickerItem?.id)).toEqual(['right', 'feet-second', 'low-right', 'alpha-right']);
  });

  it('freezes every tier of an Outdated build', () => {
    const { branches } = useBiosoldierBranches(OUTDATED_BUILD);

    expect(branches.value.flatMap(({ tiers }) => tiers.map(tier => tier.isDisabled))).toEqual(FROZEN_TIERS);
  });

  it('shows the abilities of the code of an Outdated build on the tiers of their branch', () => {
    const { branches } = useBiosoldierBranches(OUTDATED_BUILD);

    expect(branches.value.map(({ tiers }) => tiers.map(tier => tier.outdatedItemIds))).toEqual(OUTDATED_ITEM_IDS);
  });

  it('puts an ability of the code of an Outdated build in the cell of its variant', () => {
    const { branches } = useBiosoldierBranches(OUTDATED_BUILD);

    expect(branches.value[1].tiers[1].options.map(option => option.item.id)).toEqual(['feet-old', 'feet-second']);
  });
});
