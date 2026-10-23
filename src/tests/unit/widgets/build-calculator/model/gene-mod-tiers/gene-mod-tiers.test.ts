import { describe, expect, it, vi } from 'vitest';

import { useGeneModTiers } from '@widgets/build-calculator/model/gene-mod-tiers';

import { createBuildMock, HEAD_AND_CHEST_GENE_MODS, NO_GENE_MODS, PSIONICS, UNAVAILABLE_NOTE } from './gene-mod-tiers.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./gene-mod-tiers.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/body-part-content', async () => ({
  BODY_PART_CONTENT: (await import('./gene-mod-tiers.mock')).BODY_PART_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

describe('useGeneModTiers', () => {
  it('completes a body part with a gene mod', () => {
    const { tiers } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS));

    expect(tiers.value[0].state).toBe('completed');
  });

  it('opens an empty body part of an editable build', () => {
    const { tiers } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS));

    expect(tiers.value[2].state).toBe('available');
  });

  it('keeps a body part with a gene mod completed in a readonly build', () => {
    const { tiers } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS, true));

    expect(tiers.value[0].state).toBe('completed');
  });

  it('locks an empty body part of a readonly build', () => {
    const { tiers } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS, true));

    expect(tiers.value[2].state).toBe('locked');
  });

  it('disables every body part of a readonly build', () => {
    const { tiers } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS, true));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([true, true, true]);
  });

  it('keeps every body part of an editable build enabled', () => {
    const { tiers } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([false, false, false]);
  });

  it('shows the chosen gene mod as selected', () => {
    const { tiers } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS));

    expect(tiers.value[0].options[1].appearance).toBe('selected');
  });

  it('keeps the other gene mod of a body part available', () => {
    const { tiers } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS));

    expect(tiers.value[0].options[0].appearance).toBe('available');
  });

  it('shows a gene mod of an empty body part as available', () => {
    const { tiers } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS));

    expect(tiers.value[2].options[0].appearance).toBe('available');
  });

  it('keeps the chosen gene mod of a readonly build selected', () => {
    const { tiers } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS, true));

    expect(tiers.value[0].options[1].appearance).toBe('selected');
  });

  it('shows the other gene mod of a readonly build as disabled', () => {
    const { tiers } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS, true));

    expect(tiers.value[0].options[0].appearance).toBe('disabled');
  });

  it('features the gene mod of the last body part with one', () => {
    const { featuredPickerItem } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS));

    expect(featuredPickerItem.value?.id).toBe('chest-first');
  });

  it('features the first gene mod of the first body part without gene mods', () => {
    const { featuredPickerItem } = useGeneModTiers(createBuildMock(NO_GENE_MODS));

    expect(featuredPickerItem.value?.id).toBe('neural-damping');
  });

  it('shows Neural Damping as disabled while psionic abilities are selected', () => {
    const { tiers } = useGeneModTiers(createBuildMock(NO_GENE_MODS, false, PSIONICS));

    expect(tiers.value[0].options[0].appearance).toBe('disabled');
  });

  it('blocks Neural Damping while psionic abilities are selected', () => {
    const { tiers } = useGeneModTiers(createBuildMock(NO_GENE_MODS, false, PSIONICS));

    expect(tiers.value[0].options[0].isDisabled).toBe(true);
  });

  it('notes Neural Damping blocked by psionic abilities', () => {
    const { tiers } = useGeneModTiers(createBuildMock(NO_GENE_MODS, false, PSIONICS));

    expect(tiers.value[0].options[0].note).toBe(UNAVAILABLE_NOTE);
  });

  it('keeps the other brain gene mod available and unblocked while psionic abilities are selected', () => {
    const { tiers } = useGeneModTiers(createBuildMock(NO_GENE_MODS, false, PSIONICS));

    expect(tiers.value[0].options[1]).toMatchObject({ appearance: 'available', isDisabled: false, note: null });
  });

  it('leaves Neural Damping unblocked and without a note without psionic abilities', () => {
    const { tiers } = useGeneModTiers(createBuildMock(NO_GENE_MODS));

    expect(tiers.value[0].options[0]).toMatchObject({ isDisabled: false, note: null });
  });
});
