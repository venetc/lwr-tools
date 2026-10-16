import { describe, expect, it, vi } from 'vitest';

import { usePsionicTiers } from '@entities/soldier/model/psionic-tiers';

import {
  ALL_UNAVAILABLE_NOTES,
  createBuildMock,
  LOW_PSIONICS,
  NEURAL_DAMPING_GENE_MODS,
  NO_GENE_MODS,
  NO_PSIONICS,
} from './psionic-tiers.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./psionic-tiers.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/body-part-content', async () => ({
  BODY_PART_CONTENT: (await import('./psionic-tiers.mock')).BODY_PART_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/psi-level-content', async () => ({
  PSI_LEVEL_CONTENT: (await import('./psionic-tiers.mock')).PSI_LEVEL_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

describe('usePsionicTiers', () => {
  it('opens the first psi level of an empty build', () => {
    const { tiers } = usePsionicTiers(createBuildMock(NO_GENE_MODS, NO_PSIONICS));

    expect(tiers.value.map(tier => tier.state)).toEqual(['available', 'locked', 'locked']);
  });

  it('completes trained psi levels and opens the next one', () => {
    const { tiers } = usePsionicTiers(createBuildMock(NO_GENE_MODS, LOW_PSIONICS));

    expect(tiers.value.map(tier => tier.state)).toEqual(['completed', 'available', 'locked']);
  });

  it('disables only the locked psi levels of an editable build', () => {
    const { tiers } = usePsionicTiers(createBuildMock(NO_GENE_MODS, LOW_PSIONICS));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([false, false, true]);
  });

  it('locks every psi level under Neural Damping', () => {
    const { tiers } = usePsionicTiers(createBuildMock(NEURAL_DAMPING_GENE_MODS, NO_PSIONICS));

    expect(tiers.value.map(tier => tier.state)).toEqual(['locked', 'locked', 'locked']);
  });

  it('keeps trained psi levels of a readonly build completed and locks the rest', () => {
    const { tiers } = usePsionicTiers(createBuildMock(NO_GENE_MODS, LOW_PSIONICS, true));

    expect(tiers.value.map(tier => tier.state)).toEqual(['completed', 'locked', 'locked']);
  });

  it('disables every psi level of a readonly build', () => {
    const { tiers } = usePsionicTiers(createBuildMock(NO_GENE_MODS, LOW_PSIONICS, true));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([true, true, true]);
  });

  it('shows the chosen psionic ability as selected and the other one as available', () => {
    const { tiers } = usePsionicTiers(createBuildMock(NO_GENE_MODS, LOW_PSIONICS));

    expect(tiers.value[0].options.map(option => option.appearance)).toEqual(['available', 'selected']);
  });

  it('shows the psionic abilities of the available psi level as available', () => {
    const { tiers } = usePsionicTiers(createBuildMock(NO_GENE_MODS, LOW_PSIONICS));

    expect(tiers.value[1].options[0].appearance).toBe('available');
  });

  it('shows the psionic abilities of a locked psi level as disabled', () => {
    const { tiers } = usePsionicTiers(createBuildMock(NO_GENE_MODS, LOW_PSIONICS));

    expect(tiers.value[2].options.map(option => option.appearance)).toEqual(['disabled', 'disabled']);
  });

  it('keeps the chosen psionic ability of a readonly build selected and disables the other one', () => {
    const { tiers } = usePsionicTiers(createBuildMock(NO_GENE_MODS, LOW_PSIONICS, true));

    expect(tiers.value[0].options.map(option => option.appearance)).toEqual(['disabled', 'selected']);
  });

  it('shows every psionic ability as disabled under Neural Damping', () => {
    const { tiers } = usePsionicTiers(createBuildMock(NEURAL_DAMPING_GENE_MODS, NO_PSIONICS));

    expect(tiers.value.flatMap(tier => tier.options.map(option => option.appearance))).toEqual(['disabled', 'disabled', 'disabled', 'disabled', 'disabled']);
  });

  it('blocks every psionic ability under Neural Damping', () => {
    const { tiers } = usePsionicTiers(createBuildMock(NEURAL_DAMPING_GENE_MODS, NO_PSIONICS));

    expect(tiers.value.flatMap(tier => tier.options.map(option => option.isDisabled))).toEqual([true, true, true, true, true]);
  });

  it('notes every psionic ability blocked by Neural Damping', () => {
    const { tiers } = usePsionicTiers(createBuildMock(NEURAL_DAMPING_GENE_MODS, NO_PSIONICS));

    expect(tiers.value.flatMap(tier => tier.options.map(option => option.note))).toEqual(ALL_UNAVAILABLE_NOTES);
  });

  it('leaves psionic abilities of a locked psi level in a readonly build unblocked and without a note', () => {
    const { tiers } = usePsionicTiers(createBuildMock(NO_GENE_MODS, LOW_PSIONICS, true));

    expect(tiers.value[2].options.map(option => [option.isDisabled, option.note])).toEqual([[false, null], [false, null]]);
  });

  it('features the psionic ability of the highest trained psi level', () => {
    const { featuredPickerItem } = usePsionicTiers(createBuildMock(NO_GENE_MODS, LOW_PSIONICS));

    expect(featuredPickerItem.value?.id).toBe('low-right');
  });

  it('features the first psionic ability of the first psi level without psionic abilities', () => {
    const { featuredPickerItem } = usePsionicTiers(createBuildMock(NO_GENE_MODS, NO_PSIONICS));

    expect(featuredPickerItem.value?.id).toBe('low-left');
  });
});
