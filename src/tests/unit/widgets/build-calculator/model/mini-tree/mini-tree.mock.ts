import type { TieredPickerItem, TieredPickerTier, TieredPickerTierState } from '@shared/ui/tiered-picker/model/tiered-picker';
import type { BiosoldierBuild } from '@widgets/build-calculator/model/biosoldier-builds';
import type { MiniTreeRow } from '@widgets/build-calculator/model/mini-tree';

export const LEFT_ITEM: TieredPickerItem = {
  id: 'left',
  name: 'Left',
  description: 'Left choice.',
  icon: { selected: 'left-selected.png', available: 'left-available.png', disabled: 'left-disabled.png' },
  related: [],
};

export const RIGHT_ITEM: TieredPickerItem = {
  id: 'right',
  name: 'Right',
  description: 'Right choice.',
  icon: { selected: 'right-selected.png', available: 'right-available.png', disabled: 'right-disabled.png' },
  related: [],
};

/**
 * Tier named `First step` with two items.
 *
 * @param state tier state.
 * @param selectedId id of the selected item, or null.
 */
export const createTierMock = (state: TieredPickerTierState, selectedId: string | null): TieredPickerTier => ({
  id: 'first',
  name: 'First step',
  state,
  isDisabled: false,
  selectedId,
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

export const GENE_MOD_TIERS_MOCK = [createBranchTierMock('head', 'available', null, {})];

export const PSIONIC_TIERS_MOCK = [createBranchTierMock('awakening', 'locked', null, {})];

export const OFFICER_TIERS_MOCK = [
  createBranchTierMock('alpha', 'completed', 'left', { officerRank: { abbreviation: 'ALP' } }),
  createBranchTierMock('beta', 'available', null, { officerRank: { abbreviation: 'BET' } }),
  createBranchTierMock('gamma', 'locked', null, { officerRank: { abbreviation: 'GAM' } }),
];

export const BIOSOLDIER_BUILD_MOCK = {} as BiosoldierBuild;

/**
 * Officer row of a mini-tree, or undefined without one.
 *
 * @param rows rows of the mini-tree.
 */
export const officerRow = (rows: MiniTreeRow[]) => rows.find(({ id }) => id === 'officer');
