import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toValue } from 'vue';

import { bodyPartState, geneModBlockReason } from '@entities/soldier';
import { useGeneModTiers } from '@widgets/build-calculator/model/gene-mod-tiers';

import {
  createBuildMock,
  HEAD_AND_CHEST_BLOCK_CALLS,
  HEAD_AND_CHEST_BUILD,
  HEAD_AND_CHEST_GENE_MODS,
  NO_GENE_MODS,
  PSIONIC_BLOCKED_OPTION,
  READONLY_HEAD_AND_CHEST_STATE_CALLS,
} from './gene-mod-tiers.mock';

vi.mock('@entities/soldier', async () => {
  const { BODY_PARTS_MOCK, treeAbilityStub } = await import('./gene-mod-tiers.mock');

  return {
    BODY_PARTS: BODY_PARTS_MOCK,
    OFFICER_RANKS: [],
    PSI_LEVELS: [],
    bodyPartState: vi.fn(),
    geneModBlockReason: vi.fn(),
    treeAbility: treeAbilityStub,
  };
});

vi.mock('@entities/shiv', () => ({ TECHNOLOGY_LEVELS: [] }));

beforeEach(() => {
  vi.mocked(bodyPartState).mockReset().mockReturnValue('available');
  vi.mocked(geneModBlockReason).mockReset().mockReturnValue(null);
});

describe('useGeneModTiers', () => {
  it('gives a tier for each body part', () => {
    const { tiers } = useGeneModTiers(HEAD_AND_CHEST_BUILD);

    expect(tiers.value.map(tier => tier.name)).toEqual(['Head', 'Chest', 'Feet']);
  });

  it('gives the id of the gene mod of the body part', () => {
    const { tiers } = useGeneModTiers(HEAD_AND_CHEST_BUILD);

    expect(tiers.value[0].selectedId).toBe('head-right');
  });

  it('gives null for a body part without a gene mod', () => {
    const { tiers } = useGeneModTiers(HEAD_AND_CHEST_BUILD);

    expect(tiers.value[2].selectedId).toBeNull();
  });

  it('asks the body part state with the gene mod of each body part and the lock of the build', () => {
    const { tiers } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS, true));

    toValue(tiers);

    expect(vi.mocked(bodyPartState).mock.calls).toEqual(READONLY_HEAD_AND_CHEST_STATE_CALLS);
  });

  it('takes the state of each body part from its body part state', () => {
    vi.mocked(bodyPartState).mockReturnValueOnce('completed').mockReturnValueOnce('locked');

    const { tiers } = useGeneModTiers(HEAD_AND_CHEST_BUILD);

    expect(tiers.value.map(tier => tier.state)).toEqual(['completed', 'locked', 'available']);
  });

  it('keeps every body part of an editable build enabled', () => {
    const { tiers } = useGeneModTiers(HEAD_AND_CHEST_BUILD);

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([false, false, false]);
  });

  it('disables every body part of a readonly build', () => {
    const { tiers } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS, true));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([true, true, true]);
  });

  it('shows the chosen gene mod as selected and keeps the other one available', () => {
    const { tiers } = useGeneModTiers(HEAD_AND_CHEST_BUILD);

    expect(tiers.value[0].options.map(option => option.appearance)).toEqual(['available', 'selected']);
  });

  it('shows the gene mods of an empty body part as available', () => {
    const { tiers } = useGeneModTiers(HEAD_AND_CHEST_BUILD);

    expect(tiers.value[2].options.map(option => option.appearance)).toEqual(['available', 'available']);
  });

  it('keeps the chosen gene mod of a readonly build selected and disables the other one', () => {
    const { tiers } = useGeneModTiers(createBuildMock(HEAD_AND_CHEST_GENE_MODS, true));

    expect(tiers.value[0].options.map(option => option.appearance)).toEqual(['disabled', 'selected']);
  });

  it('asks the Build rule about each gene mod of its body part', () => {
    const { tiers } = useGeneModTiers(HEAD_AND_CHEST_BUILD);

    toValue(tiers);

    expect(vi.mocked(geneModBlockReason).mock.calls).toEqual(HEAD_AND_CHEST_BLOCK_CALLS);
  });

  it('blocks and notes a gene mod the Build rule refuses for psionic abilities', () => {
    vi.mocked(geneModBlockReason).mockReturnValueOnce('psionic-ability');

    const { tiers } = useGeneModTiers(HEAD_AND_CHEST_BUILD);

    expect(tiers.value[0].options[0]).toMatchObject(PSIONIC_BLOCKED_OPTION);
  });

  it('leaves the gene mods the Build rule allows unblocked and without a note', () => {
    vi.mocked(geneModBlockReason).mockReturnValueOnce('psionic-ability');

    const { tiers } = useGeneModTiers(HEAD_AND_CHEST_BUILD);

    expect(tiers.value[0].options[1]).toMatchObject({ appearance: 'selected', isDisabled: false, note: null });
  });

  it('features the gene mod of the last body part with one', () => {
    const { featuredPickerItem } = useGeneModTiers(HEAD_AND_CHEST_BUILD);

    expect(featuredPickerItem.value?.id).toBe('chest-left');
  });

  it('features the first gene mod of the first body part without gene mods', () => {
    const { featuredPickerItem } = useGeneModTiers(createBuildMock(NO_GENE_MODS));

    expect(featuredPickerItem.value?.id).toBe('head-left');
  });
});
