import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toValue } from 'vue';

import { highestSelectedStepIndex, psiLevelState, psionicAbilityBlockReason } from '@entities/soldier';
import { usePsionicTiers } from '@widgets/build-calculator/model/psionic-tiers';

import {
  createBuildMock,
  LOW_AND_HIGH_PSIONICS,
  LOW_BLOCK_CALLS,
  LOW_BUILD,
  LOW_PSIONICS,
  NEURAL_DAMPING_BLOCKED_OPTIONS,
  NO_PSIONICS,
  READONLY_LOW_STATE_CALLS,
} from './psionic-tiers.mock';

vi.mock('@entities/soldier', async () => {
  const { PSI_LEVELS_MOCK, treeAbilityStub } = await import('./psionic-tiers.mock');

  return {
    BODY_PARTS: [],
    OFFICER_RANKS: [],
    PSI_LEVELS: PSI_LEVELS_MOCK,
    highestSelectedStepIndex: vi.fn(),
    psiLevelState: vi.fn(),
    psionicAbilityBlockReason: vi.fn(),
    treeAbility: treeAbilityStub,
  };
});

vi.mock('@entities/shiv', () => ({ TECHNOLOGY_LEVELS: [] }));

beforeEach(() => {
  vi.mocked(highestSelectedStepIndex).mockReset().mockReturnValue(-1);
  vi.mocked(psiLevelState).mockReset().mockReturnValue('available');
  vi.mocked(psionicAbilityBlockReason).mockReset().mockReturnValue(null);
});

describe('usePsionicTiers', () => {
  it('gives a tier for each psi level', () => {
    const { tiers } = usePsionicTiers(LOW_BUILD);

    expect(tiers.value.map(tier => tier.name)).toEqual(['Low', 'Middle', 'High']);
  });

  it('gives the id of the psionic ability of the psi level', () => {
    const { tiers } = usePsionicTiers(LOW_BUILD);

    expect(tiers.value[0].selectedId).toBe('low-right');
  });

  it('gives null for a psi level without a psionic ability', () => {
    const { tiers } = usePsionicTiers(LOW_BUILD);

    expect(tiers.value[1].selectedId).toBeNull();
  });

  it('asks the Build rule about each psi level itself', () => {
    const { tiers } = usePsionicTiers(LOW_BUILD);

    toValue(tiers);

    expect(vi.mocked(psionicAbilityBlockReason).mock.calls).toEqual(LOW_BLOCK_CALLS);
  });

  it('asks the psi level state with the selection, the lock of the build and the block of each psi level', () => {
    vi.mocked(psionicAbilityBlockReason).mockReturnValueOnce('neural-damping');

    const { tiers } = usePsionicTiers(createBuildMock(LOW_PSIONICS, true));

    toValue(tiers);

    expect(vi.mocked(psiLevelState).mock.calls).toEqual(READONLY_LOW_STATE_CALLS);
  });

  it('takes the state of each psi level from its psi level state', () => {
    vi.mocked(psiLevelState).mockReturnValueOnce('completed').mockReturnValueOnce('locked');

    const { tiers } = usePsionicTiers(LOW_BUILD);

    expect(tiers.value.map(tier => tier.state)).toEqual(['completed', 'locked', 'available']);
  });

  it('disables only the locked psi levels of an editable build', () => {
    vi.mocked(psiLevelState).mockReturnValueOnce('completed').mockReturnValueOnce('locked');

    const { tiers } = usePsionicTiers(LOW_BUILD);

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([false, true, false]);
  });

  it('disables every psi level of a readonly build', () => {
    const { tiers } = usePsionicTiers(createBuildMock(LOW_PSIONICS, true));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([true, true, true]);
  });

  it('shows the chosen psionic ability as selected and keeps the other one available', () => {
    const { tiers } = usePsionicTiers(LOW_BUILD);

    expect(tiers.value[0].options.map(option => option.appearance)).toEqual(['available', 'selected']);
  });

  it('shows the psionic abilities of an empty psi level as available', () => {
    const { tiers } = usePsionicTiers(LOW_BUILD);

    expect(tiers.value[2].options.map(option => option.appearance)).toEqual(['available', 'available']);
  });

  it('shows the psionic abilities of a locked psi level as disabled', () => {
    vi.mocked(psiLevelState).mockReturnValue('locked');

    const { tiers } = usePsionicTiers(LOW_BUILD);

    expect(tiers.value[2].options.map(option => option.appearance)).toEqual(['disabled', 'disabled']);
  });

  it('keeps the chosen psionic ability of a readonly build selected and disables the other one', () => {
    const { tiers } = usePsionicTiers(createBuildMock(LOW_PSIONICS, true));

    expect(tiers.value[0].options.map(option => option.appearance)).toEqual(['disabled', 'selected']);
  });

  it('blocks and notes the psionic abilities of a psi level the Build rule blocks for Neural Damping', () => {
    vi.mocked(psionicAbilityBlockReason).mockReturnValueOnce('neural-damping');

    const { tiers } = usePsionicTiers(LOW_BUILD);

    expect(tiers.value[0].options.map(option => [option.appearance, option.isDisabled, option.note])).toEqual(NEURAL_DAMPING_BLOCKED_OPTIONS);
  });

  it('leaves the psionic abilities of a locked psi level unblocked and without a note', () => {
    vi.mocked(psiLevelState).mockReturnValue('locked');

    const { tiers } = usePsionicTiers(createBuildMock(LOW_PSIONICS, true));

    expect(tiers.value[2].options.map(option => [option.isDisabled, option.note])).toEqual([[false, null], [false, null]]);
  });

  it('asks the highest selected psi level with the psionic abilities', () => {
    const { featuredPickerItem } = usePsionicTiers(createBuildMock(LOW_AND_HIGH_PSIONICS));

    toValue(featuredPickerItem);

    expect(highestSelectedStepIndex).toHaveBeenCalledWith(LOW_AND_HIGH_PSIONICS);
  });

  it('features the psionic ability of the highest selected psi level', () => {
    vi.mocked(highestSelectedStepIndex).mockReturnValue(2);

    const { featuredPickerItem } = usePsionicTiers(createBuildMock(LOW_AND_HIGH_PSIONICS));

    expect(featuredPickerItem.value?.id).toBe('high-left');
  });

  it('features the first psionic ability of the first psi level without psionic abilities', () => {
    const { featuredPickerItem } = usePsionicTiers(createBuildMock(NO_PSIONICS));

    expect(featuredPickerItem.value?.id).toBe('low-left');
  });
});
