import type { TieredPickerIcon, TieredPickerItem, TieredPickerTierState } from '@shared/ui/tiered-picker/model/tiered-picker';
import type { BiosoldierBuild } from '@widgets/build-calculator/model/biosoldier-builds';
import type { MiniTreeRow } from '@widgets/build-calculator/model/mini-tree';
import type { BuildTreeTier } from '@widgets/build-calculator/model/saved-tree';

const PLACEHOLDER: TieredPickerIcon['placeholder'] = {
  selected: { backdrop: '#000000', glyph: '#ffffff' },
  available: { backdrop: '#000000', glyph: '#888888' },
  disabled: { backdrop: '#222222', glyph: '#444444' },
};

export const LEFT_ITEM: TieredPickerItem = {
  id: 'left',
  name: 'Left',
  description: 'Left choice.',
  icon: { selected: 'left-selected.png', available: 'left-available.png', disabled: 'left-disabled.png', placeholder: PLACEHOLDER },
  related: [],
};

export const RIGHT_ITEM: TieredPickerItem = {
  id: 'right',
  name: 'Right',
  description: 'Right choice.',
  icon: { selected: 'right-selected.png', available: 'right-available.png', disabled: 'right-disabled.png', placeholder: PLACEHOLDER },
  related: [],
};

/**
 * Tier named `First step` with two items.
 *
 * @param state tier state.
 * @param selectedId id of the selected item, or null.
 * @param outdatedItemIds ids of the items of the code of an Outdated build on the tier.
 */
export const createTierMock = (state: TieredPickerTierState, selectedId: string | null, outdatedItemIds: string[] = []): BuildTreeTier => ({
  id: 'first',
  name: 'First step',
  state,
  isDisabled: false,
  selectedId,
  outdatedItemIds,
  options: [LEFT_ITEM, RIGHT_ITEM].map(item => ({ item, appearance: 'available', isDisabled: false, note: null })),
});

export const CAPTION = 'FST';

/**
 * Tier with the extra fields a branch of the mini-tree reads.
 *
 * @param id tier id.
 * @param state tier state.
 * @param selectedId id of the selected item, or null.
 * @param fields extra fields of the tier.
 */
const createBranchTierMock = (id: string, state: TieredPickerTierState, selectedId: string | null, fields: object) => ({
  ...createTierMock(state, selectedId),
  id,
  ...fields,
});

export const CLASS_TREE_TIERS_MOCK = [createBranchTierMock('specialist', 'completed', 'right', { rank: { id: 'specialist' } })];

export const GENE_MOD_TIERS_MOCK = [{ ...createBranchTierMock('head', 'available', null, {}), name: 'Head' }];

export const PSIONIC_TIERS_MOCK = [createBranchTierMock('awakening', 'locked', null, {})];

export const OFFICER_TIERS_MOCK = [
  createBranchTierMock('alpha', 'completed', 'left', { officerRank: { abbreviation: 'ALP' } }),
  createBranchTierMock('beta', 'available', null, { officerRank: { abbreviation: 'BET' } }),
  createBranchTierMock('gamma', 'locked', null, { officerRank: { abbreviation: 'GAM' } }),
];

/**
 * Branch of the mini-tree with its tiers.
 *
 * @param id branch id.
 * @param tiers branch tiers.
 */
const createBranchMock = (id: string, tiers: object[]) => ({ id, tiers, selectedCount: 0, featuredPickerItem: null });

export const BRANCHES_MOCK = [
  createBranchMock('class-tree', CLASS_TREE_TIERS_MOCK),
  createBranchMock('gene-mods', GENE_MOD_TIERS_MOCK),
  createBranchMock('psionic', PSIONIC_TIERS_MOCK),
  createBranchMock('officer', OFFICER_TIERS_MOCK),
];

export const BIOSOLDIER_BUILD_MOCK = {} as BiosoldierBuild;

/**
 * Row of a branch of a mini-tree, or undefined without one.
 *
 * @param rows rows of the mini-tree.
 * @param id branch id.
 */
export const branchRow = (rows: MiniTreeRow[], id: string) => rows.find(row => row.id === id);
