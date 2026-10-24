import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toValue } from 'vue';

import { featuredShivPerk, technologyLevelState } from '@entities/shiv';
import { useShivBuildTiers } from '@widgets/build-calculator/model/shiv-build-tiers';

import {
  createBuildMock,
  FIRST_FILLED_BUILD,
  FIRST_FILLED_PERKS,
  READONLY_FIRST_FILLED_STATE_CALLS,
  RIGHT_PERK,
  STRANGER_PERK,
  TECHNOLOGY_LEVELS_MOCK,
} from './shiv-build-tiers.mock';

vi.mock('@entities/shiv', async () => ({
  TECHNOLOGY_LEVELS: (await import('./shiv-build-tiers.mock')).TECHNOLOGY_LEVELS_MOCK,
  featuredShivPerk: vi.fn(),
  technologyLevelState: vi.fn(),
}));

vi.mock('@entities/soldier', () => ({ BODY_PARTS: [], OFFICER_RANKS: [], PSI_LEVELS: [] }));

beforeEach(() => {
  vi.mocked(featuredShivPerk).mockReset().mockReturnValue(null);
  vi.mocked(technologyLevelState).mockReset().mockReturnValue('available');
});

describe('useShivBuildTiers', () => {
  it('gives a tier for each technology level', () => {
    const { tiers } = useShivBuildTiers(FIRST_FILLED_BUILD);

    expect(tiers.value.map(tier => tier.name)).toEqual(['First', 'Second']);
  });

  it('gives the id of the perk selected on the level', () => {
    const { tiers } = useShivBuildTiers(FIRST_FILLED_BUILD);

    expect(tiers.value[0].selectedId).toBe('right');
  });

  it('gives null for a level without selection', () => {
    const { tiers } = useShivBuildTiers(FIRST_FILLED_BUILD);

    expect(tiers.value[1].selectedId).toBeNull();
  });

  it('asks the technology level state with the selection of each level and the lock of the build', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS, true));

    toValue(tiers);

    expect(vi.mocked(technologyLevelState).mock.calls).toEqual(READONLY_FIRST_FILLED_STATE_CALLS);
  });

  it('takes the state of each level from its technology level state', () => {
    vi.mocked(technologyLevelState).mockReturnValueOnce('locked');

    const { tiers } = useShivBuildTiers(FIRST_FILLED_BUILD);

    expect(tiers.value.map(tier => tier.state)).toEqual(['locked', 'available']);
  });

  it('keeps every level of an editable build enabled', () => {
    const { tiers } = useShivBuildTiers(FIRST_FILLED_BUILD);

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([false, false]);
  });

  it('disables every level of a readonly build', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS, true));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([true, true]);
  });

  it('shows the perk selected on a completed level as selected and its neighbour as disabled', () => {
    vi.mocked(technologyLevelState).mockReturnValue('completed');

    const { tiers } = useShivBuildTiers(FIRST_FILLED_BUILD);

    expect(tiers.value[0].options.map(option => option.appearance)).toEqual(['disabled', 'selected']);
  });

  it('leaves the neighbour of the selected perk free to replace it', () => {
    vi.mocked(technologyLevelState).mockReturnValue('completed');

    const { tiers } = useShivBuildTiers(FIRST_FILLED_BUILD);

    expect(tiers.value[0].options[0].isDisabled).toBe(false);
  });

  it('shows a perk of an available level as available', () => {
    const { tiers } = useShivBuildTiers(FIRST_FILLED_BUILD);

    expect(tiers.value[1].options[0].appearance).toBe('available');
  });

  it('shows a perk of a locked level as disabled', () => {
    vi.mocked(technologyLevelState).mockReturnValue('locked');

    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS, true));

    expect(tiers.value[1].options[0].appearance).toBe('disabled');
  });

  it('asks the featured perk of the SHIV tree with the selected perks', () => {
    const { featuredPickerItem } = useShivBuildTiers(FIRST_FILLED_BUILD);

    toValue(featuredPickerItem);

    expect(featuredShivPerk).toHaveBeenCalledWith(TECHNOLOGY_LEVELS_MOCK, FIRST_FILLED_PERKS);
  });

  it('features the picker item of the featured perk', () => {
    vi.mocked(featuredShivPerk).mockReturnValue(RIGHT_PERK);

    const { featuredPickerItem } = useShivBuildTiers(FIRST_FILLED_BUILD);

    expect(featuredPickerItem.value?.id).toBe('right');
  });

  it('features nothing without a featured perk', () => {
    const { featuredPickerItem } = useShivBuildTiers(FIRST_FILLED_BUILD);

    expect(featuredPickerItem.value).toBeNull();
  });

  it('features nothing for a featured perk outside the SHIV tree', () => {
    vi.mocked(featuredShivPerk).mockReturnValue(STRANGER_PERK);

    const { featuredPickerItem } = useShivBuildTiers(FIRST_FILLED_BUILD);

    expect(featuredPickerItem.value).toBeNull();
  });
});
