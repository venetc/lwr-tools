import { describe, expect, it, vi } from 'vitest';

import { useOfficerTiers } from '@widgets/build-calculator/model/officer-tiers';

import {
  ALL_OFFICER_PERKS,
  ALPHA_AND_BETA_OFFICER_PERKS,
  ALPHA_AND_GAMMA_OFFICER_PERKS,
  ALPHA_OFFICER_PERKS,
  createBuildMock,
  createSuperSoldierBuildMock,
  GAMMA_OFFICER_PERKS,
  NO_OFFICER_PERKS,
} from './officer-tiers.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./officer-tiers.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/body-part-content', async () => ({
  BODY_PART_CONTENT: (await import('./officer-tiers.mock')).BODY_PART_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/officer-rank-content', async () => ({
  OFFICER_RANK_CONTENT: (await import('./officer-tiers.mock')).OFFICER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/soldier-rank-content', async () => ({
  SOLDIER_RANK_CONTENT: (await import('./officer-tiers.mock')).SOLDIER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/biosoldier-classes', () => ({ BIOSOLDIER_CLASSES: [] }));

vi.mock('@entities/soldier/config/constants/mec-classes', () => ({ MEC_CLASSES: [] }));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/soldier/config/constants/officer-rank-medals', () => ({ OFFICER_RANK_MEDAL: {} }));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('useOfficerTiers', () => {
  it('opens every officer rank of a build without officer perks', () => {
    const { tiers } = useOfficerTiers(createBuildMock(NO_OFFICER_PERKS));

    expect(tiers.value.map(tier => tier.state)).toEqual(['available', 'available', 'available']);
  });

  it('completes trained officer ranks and keeps the empty ones open', () => {
    const { tiers } = useOfficerTiers(createBuildMock(GAMMA_OFFICER_PERKS));

    expect(tiers.value.map(tier => tier.state)).toEqual(['available', 'available', 'completed']);
  });

  it('locks the empty officer ranks of a readonly build', () => {
    const { tiers } = useOfficerTiers(createBuildMock(ALPHA_OFFICER_PERKS, true));

    expect(tiers.value.map(tier => tier.state)).toEqual(['completed', 'locked', 'locked']);
  });

  it('disables no officer rank of an editable build', () => {
    const { tiers } = useOfficerTiers(createBuildMock(ALPHA_OFFICER_PERKS));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([false, false, false]);
  });

  it('disables every officer rank of a readonly build', () => {
    const { tiers } = useOfficerTiers(createBuildMock(ALPHA_OFFICER_PERKS, true));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([true, true, true]);
  });

  it('notes the officer perks with the rank the game requires', () => {
    const { tiers } = useOfficerTiers(createBuildMock(NO_OFFICER_PERKS));

    expect(tiers.value[1].options.map(option => option.note)).toEqual(['Requires Third in game', 'Requires Third in game']);
  });

  it('notes the officer perks of a completed officer rank with the rank the game requires', () => {
    const { tiers } = useOfficerTiers(createBuildMock(ALPHA_OFFICER_PERKS));

    expect(tiers.value[0].options.map(option => option.note)).toEqual(['Requires Second in game', 'Requires Second in game']);
  });

  it('shows the chosen officer perk of a completed officer rank as selected and the other one as disabled', () => {
    const { tiers } = useOfficerTiers(createBuildMock(ALPHA_OFFICER_PERKS));

    expect(tiers.value[0].options.map(option => option.appearance)).toEqual(['selected', 'disabled']);
  });

  it('shows the officer perks of an empty officer rank above an empty one as available', () => {
    const { tiers } = useOfficerTiers(createBuildMock(NO_OFFICER_PERKS));

    expect(tiers.value[2].options.map(option => option.appearance)).toEqual(['available', 'available']);
  });

  it('shows the officer perks of an empty officer rank of a readonly build as disabled', () => {
    const { tiers } = useOfficerTiers(createBuildMock(ALPHA_OFFICER_PERKS, true));

    expect(tiers.value[2].options.map(option => option.appearance)).toEqual(['disabled', 'disabled']);
  });

  it('keeps the chosen officer perks of a readonly build selected', () => {
    const { tiers } = useOfficerTiers(createBuildMock(ALL_OFFICER_PERKS, true));

    expect(tiers.value.map(tier => tier.options.map(option => option.appearance))).toEqual([
      ['selected', 'disabled'],
      ['disabled', 'selected'],
      ['selected', 'disabled'],
    ]);
  });

  it('features the officer perk of the highest trained officer rank', () => {
    const { featuredPickerItem } = useOfficerTiers(createBuildMock(ALPHA_AND_BETA_OFFICER_PERKS));

    expect(featuredPickerItem.value?.id).toBe('beta-right');
  });

  it('features the officer perk of the highest trained officer rank above an empty one', () => {
    const { featuredPickerItem } = useOfficerTiers(createBuildMock(ALPHA_AND_GAMMA_OFFICER_PERKS));

    expect(featuredPickerItem.value?.id).toBe('gamma-right');
  });

  it('features the first officer perk of the first officer rank without officer perks', () => {
    const { featuredPickerItem } = useOfficerTiers(createBuildMock(NO_OFFICER_PERKS));

    expect(featuredPickerItem.value?.id).toBe('alpha-left');
  });

  it('ignores Neural Damping and psionic abilities of the build', () => {
    const { tiers } = useOfficerTiers(createSuperSoldierBuildMock(ALPHA_OFFICER_PERKS));

    expect(tiers.value.map(tier => tier.state)).toEqual(['completed', 'available', 'available']);
  });
});
