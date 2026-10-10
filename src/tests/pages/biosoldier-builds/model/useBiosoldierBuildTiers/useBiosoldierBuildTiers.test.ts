import { describe, expect, it, vi } from 'vitest';

import { useBiosoldierBuildTiers } from '@pages/biosoldier-builds/model/useBiosoldierBuildTiers';

import { BASE_TALENTS, createBuildMock, PARTIAL_TALENTS } from './useBiosoldierBuildTiers.mock';

vi.mock('@entities/biosoldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./useBiosoldierBuildTiers.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/biosoldier/config/constants/soldier-rank-content', async () => ({
  SOLDIER_RANK_CONTENT: (await import('./useBiosoldierBuildTiers.mock')).SOLDIER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/biosoldier/config/constants/biosoldier-class-content', () => ({ BIOSOLDIER_CLASS_CONTENT: {} }));

vi.mock('@entities/biosoldier/config/constants/biosoldier-class-icons', () => ({ BIOSOLDIER_CLASS_ICON: {} }));

vi.mock('@entities/biosoldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/biosoldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('useBiosoldierBuildTiers', () => {
  it('disables a granted rank', () => {
    const { tiers } = useBiosoldierBuildTiers(createBuildMock(PARTIAL_TALENTS));

    expect(tiers.value[0].isDisabled).toBe(true);
  });

  it('disables any rank of a readonly build', () => {
    const { tiers } = useBiosoldierBuildTiers(createBuildMock(PARTIAL_TALENTS, true));

    expect(tiers.value[1].isDisabled).toBe(true);
  });

  it('disables a locked rank', () => {
    const { tiers } = useBiosoldierBuildTiers(createBuildMock(BASE_TALENTS));

    expect(tiers.value[2].isDisabled).toBe(true);
  });

  it('enables a completed rank that is not granted', () => {
    const { tiers } = useBiosoldierBuildTiers(createBuildMock(PARTIAL_TALENTS));

    expect(tiers.value[1].isDisabled).toBe(false);
  });

  it('enables the available rank', () => {
    const { tiers } = useBiosoldierBuildTiers(createBuildMock(PARTIAL_TALENTS));

    expect(tiers.value[2].isDisabled).toBe(false);
  });

  it('gives the id of the talent selected on the rank', () => {
    const { tiers } = useBiosoldierBuildTiers(createBuildMock(PARTIAL_TALENTS));

    expect(tiers.value[1].selectedId).toBe('right');
  });

  it('gives null for a rank without selection', () => {
    const { tiers } = useBiosoldierBuildTiers(createBuildMock(PARTIAL_TALENTS));

    expect(tiers.value[2].selectedId).toBeNull();
  });

  it('features the talent selected on the last completed rank', () => {
    const { featuredItem } = useBiosoldierBuildTiers(createBuildMock(PARTIAL_TALENTS));

    expect(featuredItem.value?.id).toBe('right');
  });
});
