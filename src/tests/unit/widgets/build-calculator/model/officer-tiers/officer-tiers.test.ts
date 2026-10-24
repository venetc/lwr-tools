import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toValue } from 'vue';

import { highestSelectedStepIndex, rankState } from '@entities/soldier';
import { useOfficerTiers } from '@widgets/build-calculator/model/officer-tiers';

import {
  ALPHA_AND_BETA_OFFICER_PERKS,
  ALPHA_BUILD,
  ALPHA_OFFICER_PERKS,
  createBuildMock,
  NO_OFFICER_PERKS,
  READONLY_ALPHA_STATE_CALLS,
} from './officer-tiers.mock';

vi.mock('@entities/soldier', async () => {
  const { OFFICER_RANKS_MOCK, treeAbilityStub } = await import('./officer-tiers.mock');

  return {
    BODY_PARTS: [],
    OFFICER_RANKS: OFFICER_RANKS_MOCK,
    PSI_LEVELS: [],
    highestSelectedStepIndex: vi.fn(),
    rankState: vi.fn(),
    treeAbility: treeAbilityStub,
  };
});

vi.mock('@entities/shiv', () => ({ TECHNOLOGY_LEVELS: [] }));

beforeEach(() => {
  vi.mocked(highestSelectedStepIndex).mockReset().mockReturnValue(-1);
  vi.mocked(rankState).mockReset().mockReturnValue('available');
});

describe('useOfficerTiers', () => {
  it('gives a tier for each officer rank', () => {
    const { tiers } = useOfficerTiers(ALPHA_BUILD);

    expect(tiers.value.map(tier => tier.name)).toEqual(['Alpha', 'Beta', 'Gamma']);
  });

  it('gives the id of the officer perk of the officer rank', () => {
    const { tiers } = useOfficerTiers(ALPHA_BUILD);

    expect(tiers.value[0].selectedId).toBe('alpha-left');
  });

  it('gives null for an officer rank without an officer perk', () => {
    const { tiers } = useOfficerTiers(ALPHA_BUILD);

    expect(tiers.value[1].selectedId).toBeNull();
  });

  it('asks the rank state with the officer perk of each officer rank and the lock of the build', () => {
    const { tiers } = useOfficerTiers(createBuildMock(ALPHA_OFFICER_PERKS, true));

    toValue(tiers);

    expect(vi.mocked(rankState).mock.calls).toEqual(READONLY_ALPHA_STATE_CALLS);
  });

  it('takes the state of each officer rank from its rank state', () => {
    vi.mocked(rankState).mockReturnValueOnce('completed').mockReturnValueOnce('locked');

    const { tiers } = useOfficerTiers(ALPHA_BUILD);

    expect(tiers.value.map(tier => tier.state)).toEqual(['completed', 'locked', 'available']);
  });

  it('disables no officer rank of an editable build', () => {
    const { tiers } = useOfficerTiers(ALPHA_BUILD);

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([false, false, false]);
  });

  it('disables every officer rank of a readonly build', () => {
    const { tiers } = useOfficerTiers(createBuildMock(ALPHA_OFFICER_PERKS, true));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([true, true, true]);
  });

  it('notes the officer perks with the rank the game requires', () => {
    const { tiers } = useOfficerTiers(ALPHA_BUILD);

    expect(tiers.value[1].options.map(option => option.note)).toEqual(['Requires Third in game', 'Requires Third in game']);
  });

  it('notes the officer perks of a completed officer rank with the rank the game requires', () => {
    vi.mocked(rankState).mockReturnValue('completed');

    const { tiers } = useOfficerTiers(ALPHA_BUILD);

    expect(tiers.value[0].options.map(option => option.note)).toEqual(['Requires Second in game', 'Requires Second in game']);
  });

  it('shows the chosen officer perk of a completed officer rank as selected and the other one as disabled', () => {
    vi.mocked(rankState).mockReturnValue('completed');

    const { tiers } = useOfficerTiers(ALPHA_BUILD);

    expect(tiers.value[0].options.map(option => option.appearance)).toEqual(['selected', 'disabled']);
  });

  it('shows the officer perks of an available officer rank as available', () => {
    const { tiers } = useOfficerTiers(ALPHA_BUILD);

    expect(tiers.value[2].options.map(option => option.appearance)).toEqual(['available', 'available']);
  });

  it('shows the officer perks of a locked officer rank as disabled', () => {
    vi.mocked(rankState).mockReturnValue('locked');

    const { tiers } = useOfficerTiers(createBuildMock(ALPHA_OFFICER_PERKS, true));

    expect(tiers.value[2].options.map(option => option.appearance)).toEqual(['disabled', 'disabled']);
  });

  it('asks the highest selected officer rank with the officer perks', () => {
    const { featuredPickerItem } = useOfficerTiers(createBuildMock(ALPHA_AND_BETA_OFFICER_PERKS));

    toValue(featuredPickerItem);

    expect(highestSelectedStepIndex).toHaveBeenCalledWith(ALPHA_AND_BETA_OFFICER_PERKS);
  });

  it('features the officer perk of the highest selected officer rank', () => {
    vi.mocked(highestSelectedStepIndex).mockReturnValue(1);

    const { featuredPickerItem } = useOfficerTiers(createBuildMock(ALPHA_AND_BETA_OFFICER_PERKS));

    expect(featuredPickerItem.value?.id).toBe('beta-right');
  });

  it('features the first officer perk of the first officer rank without officer perks', () => {
    const { featuredPickerItem } = useOfficerTiers(createBuildMock(NO_OFFICER_PERKS));

    expect(featuredPickerItem.value?.id).toBe('alpha-left');
  });
});
