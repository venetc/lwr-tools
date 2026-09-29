import { describe, expect, it, vi } from 'vitest';

import { useSoldierBuildTiers } from '@pages/talents/model/useSoldierBuildTiers';

import { BASE_TALENTS, createBuildMock, PARTIAL_TALENTS } from './useSoldierBuildTiers.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./useSoldierBuildTiers.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/soldier-rank-content', async () => ({
  SOLDIER_RANK_CONTENT: (await import('./useSoldierBuildTiers.mock')).SOLDIER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/soldier-class-content', () => ({ SOLDIER_CLASS_CONTENT: {} }));

vi.mock('@entities/soldier/config/constants/soldier-class-icons', () => ({ SOLDIER_CLASS_ICON: {} }));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('useSoldierBuildTiers', () => {
  it('disables a granted rank', () => {
    const { tiers } = useSoldierBuildTiers(createBuildMock(PARTIAL_TALENTS));

    expect(tiers.value[0].isDisabled).toBe(true);
  });

  it('disables any rank of a readonly build', () => {
    const { tiers } = useSoldierBuildTiers(createBuildMock(PARTIAL_TALENTS, true));

    expect(tiers.value[1].isDisabled).toBe(true);
  });

  it('disables a locked rank', () => {
    const { tiers } = useSoldierBuildTiers(createBuildMock(BASE_TALENTS));

    expect(tiers.value[2].isDisabled).toBe(true);
  });

  it('enables a completed rank that is not granted', () => {
    const { tiers } = useSoldierBuildTiers(createBuildMock(PARTIAL_TALENTS));

    expect(tiers.value[1].isDisabled).toBe(false);
  });

  it('enables the available rank', () => {
    const { tiers } = useSoldierBuildTiers(createBuildMock(PARTIAL_TALENTS));

    expect(tiers.value[2].isDisabled).toBe(false);
  });

  it('gives the id of the talent selected on the rank', () => {
    const { tiers } = useSoldierBuildTiers(createBuildMock(PARTIAL_TALENTS));

    expect(tiers.value[1].selectedId).toBe('right');
  });

  it('gives null for a rank without selection', () => {
    const { tiers } = useSoldierBuildTiers(createBuildMock(PARTIAL_TALENTS));

    expect(tiers.value[2].selectedId).toBeNull();
  });

  it('features the talent selected on the last completed rank', () => {
    const { featuredItem } = useSoldierBuildTiers(createBuildMock(PARTIAL_TALENTS));

    expect(featuredItem.value?.id).toBe('right');
  });
});
