import { describe, expect, it, vi } from 'vitest';

import { useOfficerTiers } from '@entities/soldier/model/officer-tiers';

import {
  ALL_OFFICER_PERKS,
  ALPHA_AND_BETA_OFFICER_PERKS,
  ALPHA_OFFICER_PERKS,
  BASE_PERKS,
  createBuildMock,
  createSuperSoldierBuildMock,
  FULL_PERKS,
  NO_OFFICER_PERKS,
  SECOND_RANK_PERKS,
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

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/soldier/config/constants/officer-rank-medals', () => ({ OFFICER_RANK_MEDAL: {} }));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('useOfficerTiers', () => {
  it('opens the first officer rank once the class tree completes its required rank', () => {
    const { tiers } = useOfficerTiers(createBuildMock(FULL_PERKS, NO_OFFICER_PERKS));

    expect(tiers.value.map(tier => tier.state)).toEqual(['available', 'locked', 'locked']);
  });

  it('completes trained officer ranks and opens the next one', () => {
    const { tiers } = useOfficerTiers(createBuildMock(FULL_PERKS, ALPHA_OFFICER_PERKS));

    expect(tiers.value.map(tier => tier.state)).toEqual(['completed', 'available', 'locked']);
  });

  it('locks the next officer rank while the class tree misses its required rank', () => {
    const { tiers } = useOfficerTiers(createBuildMock(SECOND_RANK_PERKS, ALPHA_OFFICER_PERKS));

    expect(tiers.value.map(tier => tier.state)).toEqual(['completed', 'locked', 'locked']);
  });

  it('locks every officer rank while the class tree misses the first required rank', () => {
    const { tiers } = useOfficerTiers(createBuildMock(BASE_PERKS, NO_OFFICER_PERKS));

    expect(tiers.value.map(tier => tier.state)).toEqual(['locked', 'locked', 'locked']);
  });

  it('locks every officer rank of a readonly build', () => {
    const { tiers } = useOfficerTiers(createBuildMock(FULL_PERKS, ALL_OFFICER_PERKS, true));

    expect(tiers.value.map(tier => tier.state)).toEqual(['locked', 'locked', 'locked']);
  });

  it('disables only the locked officer ranks of an editable build', () => {
    const { tiers } = useOfficerTiers(createBuildMock(FULL_PERKS, ALPHA_OFFICER_PERKS));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([false, false, true]);
  });

  it('gives a missing required rank as the lock reason before an empty officer rank below', () => {
    const { tiers } = useOfficerTiers(createBuildMock(BASE_PERKS, NO_OFFICER_PERKS));

    expect(tiers.value.map(tier => tier.lockReason)).toEqual(['Requires Second', 'Requires Third', 'Requires Third']);
  });

  it('gives an empty officer rank below as the lock reason once the required rank is completed', () => {
    const { tiers } = useOfficerTiers(createBuildMock(FULL_PERKS, NO_OFFICER_PERKS));

    expect(tiers.value.map(tier => tier.lockReason)).toEqual([null, 'Requires Alpha', 'Requires Beta']);
  });

  it('gives no lock reason in a readonly build', () => {
    const { tiers } = useOfficerTiers(createBuildMock(BASE_PERKS, NO_OFFICER_PERKS, true));

    expect(tiers.value.map(tier => tier.lockReason)).toEqual([null, null, null]);
  });

  it('notes the officer perks of a locked officer rank with its lock reason', () => {
    const { tiers } = useOfficerTiers(createBuildMock(FULL_PERKS, NO_OFFICER_PERKS));

    expect(tiers.value[1].options.map(option => option.note)).toEqual(['Requires Alpha', 'Requires Alpha']);
  });

  it('leaves the officer perks of an open officer rank without a note', () => {
    const { tiers } = useOfficerTiers(createBuildMock(FULL_PERKS, NO_OFFICER_PERKS));

    expect(tiers.value[0].options.map(option => option.note)).toEqual([null, null]);
  });

  it('shows the chosen officer perk of a completed officer rank as selected and the other one as disabled', () => {
    const { tiers } = useOfficerTiers(createBuildMock(FULL_PERKS, ALPHA_OFFICER_PERKS));

    expect(tiers.value[0].options.map(option => option.appearance)).toEqual(['selected', 'disabled']);
  });

  it('shows the officer perks of the open officer rank as available', () => {
    const { tiers } = useOfficerTiers(createBuildMock(FULL_PERKS, ALPHA_OFFICER_PERKS));

    expect(tiers.value[1].options.map(option => option.appearance)).toEqual(['available', 'available']);
  });

  it('shows the officer perks of a locked officer rank as disabled', () => {
    const { tiers } = useOfficerTiers(createBuildMock(FULL_PERKS, ALPHA_OFFICER_PERKS));

    expect(tiers.value[2].options.map(option => option.appearance)).toEqual(['disabled', 'disabled']);
  });

  it('keeps the chosen officer perks of a readonly build selected', () => {
    const { tiers } = useOfficerTiers(createBuildMock(FULL_PERKS, ALL_OFFICER_PERKS, true));

    expect(tiers.value.map(tier => tier.options.map(option => option.appearance))).toEqual([
      ['selected', 'disabled'],
      ['disabled', 'selected'],
      ['selected', 'disabled'],
    ]);
  });

  it('features the officer perk of the highest trained officer rank', () => {
    const { featuredPickerItem } = useOfficerTiers(createBuildMock(FULL_PERKS, ALPHA_AND_BETA_OFFICER_PERKS));

    expect(featuredPickerItem.value?.id).toBe('beta-right');
  });

  it('features the first officer perk of the first officer rank without officer perks', () => {
    const { featuredPickerItem } = useOfficerTiers(createBuildMock(FULL_PERKS, NO_OFFICER_PERKS));

    expect(featuredPickerItem.value?.id).toBe('alpha-left');
  });

  it('ignores Neural Damping and psionic abilities of the build', () => {
    const { tiers } = useOfficerTiers(createSuperSoldierBuildMock(FULL_PERKS, ALPHA_OFFICER_PERKS));

    expect(tiers.value.map(tier => tier.state)).toEqual(['completed', 'available', 'locked']);
  });
});
