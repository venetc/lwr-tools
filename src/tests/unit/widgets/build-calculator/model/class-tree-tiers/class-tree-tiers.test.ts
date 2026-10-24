import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toValue } from 'vue';

import { classTree, featuredPerk, rankState } from '@entities/soldier';
import { useClassTreeTiers } from '@widgets/build-calculator/model/class-tree-tiers';

import {
  CLASS_TREE_MOCK,
  createBuildMock,
  PARTIAL_PERKS,
  READONLY_PARTIAL_RANK_STATE_CALLS,
  RIGHT_PERK,
  STRANGER_PERK,
} from './class-tree-tiers.mock';

vi.mock('@entities/soldier', () => ({
  classTree: vi.fn(),
  featuredPerk: vi.fn(),
  rankState: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(classTree).mockReset().mockReturnValue(CLASS_TREE_MOCK);
  vi.mocked(featuredPerk).mockReset().mockReturnValue(null);
  vi.mocked(rankState).mockReset().mockReturnValue('available');
});

describe('useClassTreeTiers', () => {
  it('gives a tier for each rank of the class tree', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value.map(tier => tier.name)).toEqual(['First', 'Second', 'Third']);
  });

  it('gives the id of the perk selected on the rank', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[1].selectedId).toBe('right');
  });

  it('gives null for a rank without selection', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[2].selectedId).toBeNull();
  });

  it('asks the rank state with the selection of each rank and the lock of the build', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS, true));

    toValue(tiers);

    expect(vi.mocked(rankState).mock.calls).toEqual(READONLY_PARTIAL_RANK_STATE_CALLS);
  });

  it('takes the state of each rank from its rank state', () => {
    vi.mocked(rankState).mockReturnValueOnce('completed').mockReturnValueOnce('locked');

    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value.map(tier => tier.state)).toEqual(['completed', 'locked', 'available']);
  });

  it('disables the rank of the base perk', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[0].isDisabled).toBe(true);
  });

  it('enables the other ranks of an editable build', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value.slice(1).map(tier => tier.isDisabled)).toEqual([false, false]);
  });

  it('disables every rank of a readonly build', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS, true));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([true, true, true]);
  });

  it('shows the perk selected on a completed rank as selected and its neighbour as disabled', () => {
    vi.mocked(rankState).mockReturnValue('completed');

    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[1].options.map(option => option.appearance)).toEqual(['disabled', 'selected']);
  });

  it('leaves the neighbour of the selected perk free to replace it', () => {
    vi.mocked(rankState).mockReturnValue('completed');

    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[1].options[0].isDisabled).toBe(false);
  });

  it('shows the perks of an available rank as available', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[1].options.map(option => option.appearance)).toEqual(['available', 'available']);
  });

  it('shows the perks of a locked rank as disabled', () => {
    vi.mocked(rankState).mockReturnValue('locked');

    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS, true));

    expect(tiers.value[2].options.map(option => option.appearance)).toEqual(['disabled']);
  });

  it('relates the abilities a perk grants to its picker item', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[0].options[0].item.related.map(item => item.id)).toEqual(['bonus']);
  });

  it('asks the featured perk of the class tree with the selected perks', () => {
    const { featuredPickerItem } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    toValue(featuredPickerItem);

    expect(featuredPerk).toHaveBeenCalledWith(CLASS_TREE_MOCK, PARTIAL_PERKS);
  });

  it('features the picker item of the featured perk', () => {
    vi.mocked(featuredPerk).mockReturnValue(RIGHT_PERK);

    const { featuredPickerItem } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(featuredPickerItem.value?.id).toBe('right');
  });

  it('features nothing without a featured perk', () => {
    const { featuredPickerItem } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(featuredPickerItem.value).toBeNull();
  });

  it('features nothing for a featured perk outside the class tree', () => {
    vi.mocked(featuredPerk).mockReturnValue(STRANGER_PERK);

    const { featuredPickerItem } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(featuredPickerItem.value).toBeNull();
  });
});
