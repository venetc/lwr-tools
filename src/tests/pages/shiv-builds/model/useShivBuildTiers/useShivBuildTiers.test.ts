import { describe, expect, it, vi } from 'vitest';

import { useShivBuildTiers } from '@pages/shiv-builds/model/useShivBuildTiers';

import { createBuildMock, FIRST_FILLED_PERKS } from './useShivBuildTiers.mock';

vi.mock('@entities/shiv/config/constants/perk-content', async () => ({
  SHIV_PERK_CONTENT: (await import('./useShivBuildTiers.mock')).SHIV_PERK_CONTENT_MOCK,
}));

vi.mock('@entities/shiv/config/constants/technology-level-content', async () => ({
  TECHNOLOGY_LEVEL_CONTENT: (await import('./useShivBuildTiers.mock')).TECHNOLOGY_LEVEL_CONTENT_MOCK,
}));

vi.mock('@entities/shiv/config/constants/perk-icons', () => ({ SHIV_PERK_ICON: {} }));

vi.mock('@entities/shiv/config/constants/technology-level-icons', () => ({ TECHNOLOGY_LEVEL_ICON: {} }));

describe('useShivBuildTiers', () => {
  it('completes a level with a selection', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS));

    expect(tiers.value[0].state).toBe('completed');
  });

  it('opens an empty level of an editable build', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS));

    expect(tiers.value[1].state).toBe('available');
  });

  it('keeps a level with a selection completed in a readonly build', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS, true));

    expect(tiers.value[0].state).toBe('completed');
  });

  it('locks an empty level of a readonly build', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS, true));

    expect(tiers.value[1].state).toBe('locked');
  });

  it('keeps every level of an editable build enabled', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([false, false]);
  });

  it('disables every level of a readonly build', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS, true));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([true, true]);
  });

  it('features the perk selected on the highest filled level', () => {
    const { featuredItem } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS));

    expect(featuredItem.value?.id).toBe('right');
  });
});
