import { describe, expect, it, vi } from 'vitest';

import { useClassTreeTiers } from '@entities/soldier/model/class-tree-tiers';

import { BASE_PERKS, createBuildMock, PARTIAL_PERKS } from './class-tree-tiers.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./class-tree-tiers.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/soldier-rank-content', async () => ({
  SOLDIER_RANK_CONTENT: (await import('./class-tree-tiers.mock')).SOLDIER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('useClassTreeTiers', () => {
  it('disables a granted rank', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[0].isDisabled).toBe(true);
  });

  it('disables any rank of a readonly build', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS, true));

    expect(tiers.value[1].isDisabled).toBe(true);
  });

  it('disables a locked rank', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(BASE_PERKS));

    expect(tiers.value[2].isDisabled).toBe(true);
  });

  it('enables a completed rank that is not granted', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[1].isDisabled).toBe(false);
  });

  it('enables the available rank', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[2].isDisabled).toBe(false);
  });

  it('gives the id of the perk selected on the rank', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[1].selectedId).toBe('right');
  });

  it('gives null for a rank without selection', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[2].selectedId).toBeNull();
  });

  it('shows the perk selected on a completed rank as selected', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[1].options[1].appearance).toBe('selected');
  });

  it('shows the neighbour of the selected perk as disabled', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[1].options[0].appearance).toBe('disabled');
  });

  it('shows a perk of the available rank as available', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[2].options[0].appearance).toBe('available');
  });

  it('shows a perk of a locked rank as disabled', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(BASE_PERKS));

    expect(tiers.value[2].options[0].appearance).toBe('disabled');
  });

  it('shows a perk above the completed ranks of a readonly build as disabled', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS, true));

    expect(tiers.value[2].options[0].appearance).toBe('disabled');
  });

  it('keeps the selected perk of a readonly build selected', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS, true));

    expect(tiers.value[1].options[1].appearance).toBe('selected');
  });

  it('leaves the neighbour of the selected perk free to replace it', () => {
    const { tiers } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(tiers.value[1].options[0].isDisabled).toBe(false);
  });

  it('features the perk selected on the last completed rank', () => {
    const { featuredPickerItem } = useClassTreeTiers(createBuildMock(PARTIAL_PERKS));

    expect(featuredPickerItem.value?.id).toBe('right');
  });
});
